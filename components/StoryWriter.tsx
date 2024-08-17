"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Frame } from "@gptscript-ai/gptscript";
import renderEventMessage from "@/lib/renderEventMessage";

const storiesPath = "public/stories";

function StoryWriter() {
  const [story, setStory] = useState<string>("");
  const [pages, setPages] = useState<number>(1);
  const [progress, setProgress] = useState<string>();
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState<string>("");
  const [events, setEvents] = useState<Frame[]>([]);

  async function runScript() {
    setRunStarted(true);
    setRunFinished(false);

    const response = await fetch("/api/run-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story, pages, path: storiesPath }),
    });

    if (response.ok && response.body) {
      console.log("streaming started... ");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      handleStream(reader, decoder);
    } else {
      setRunStarted(false);
      setRunFinished(true);
    }
  }

  async function handleStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder
  ) {
    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const textChunk = decoder.decode(value, { stream: true });
      accumulatedText += textChunk;

      const eventData = accumulatedText
        .split("\n\n")
        .filter((line) => line.startsWith("event: "))
        .map((line) => line.replace(/^event: /, ""));

      // Make sure to only process fully parsed events
      eventData.forEach((data, index) => {
        try {
          const parsedData = JSON.parse(data);

          if (parsedData.type === "callProgress") {
            setProgress(parsedData.output[parsedData.output.length - 1].content);
            setCurrentTool(parsedData.tool?.description ?? "");
          } else if (parsedData.type === "callStart") {
            setCurrentTool(parsedData.tool?.description ?? "");
          } else if (parsedData.type === "runFinish") {
            setRunFinished(true);
            setRunStarted(false);
          } else {
            setEvents((prev) => [...prev, parsedData]);
          }
        } catch (error) {
          console.log("Failed to parse JSON", error);
        }
      });

      // Make sure to handle incomplete data
      accumulatedText = accumulatedText.endsWith("\n\n") ? "" : accumulatedText;
    }
  }

  return (
    <div className="flex flex-col container max-sm:w-full">
      <section className="flex-1 flex flex-col border border-rose-500 rounded-md space-y-2 p-10 max-sm:p-2">
        <Textarea
          placeholder="The story should be about - Prompt here!"
          className="flex-1"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
        <Select onValueChange={(value) => setPages(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="How many pages to generate?" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {Array.from({ length: 10 }, (_, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={!(story.length > 12) || !pages || runStarted}
          className="w-full bg-rose-400 select-none hover:bg-rose-500"
          size="lg"
          onClick={runScript}
        >
          Generate Story
        </Button>
      </section>

      <section className="flex-1 mt-5 pb-5">
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-auto">
          <div>
            {runFinished === null && (
              <>
                <p className="animate-pulse">
                  I&apos;m waiting for you to generate a story above...
                </p>
                <br />
              </>
            )}
            <span className="mr-5">{">>"}</span>
            {progress}
          </div>

          {currentTool && (
            <div className="py-10">
              <span className="mr-5">{"---- [Current Tool] ----"}</span>
              {currentTool}
            </div>
          )}

          <div className="space-y-5">
            {events.map((event, index) => (
              <div key={index}>
                <span className="mr-5">{">>"}</span>
                {renderEventMessage(event)}
              </div>
            ))}
          </div>

          {runStarted && (
            <div className="py-10">
              <span className="mr-5">
                {"---- [AI StoryTeller Has Started] ----"}
              </span>
              <br />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StoryWriter;
