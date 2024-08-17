import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
// import gInstance from "@/lib/gptScriptInstance";

const script = "app/api/run-script/story-book.gpt";

export async function POST(request: NextRequest) {
  const { story, pages } = await request.json();

  // similar like a command to tell gptScript whagt to generate
  // gptscript ./storybook.gpt --story "story name" --pages 5 --path "/public/stories"
  // const opts: RunOpts = {
  //     disableCache: true,
  //      input: `--story ${story} --pages ${pages} --path ${path }`
  // }

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // const run = await gInstance.run(script, opts);

          // run.on(RunEventType.Event, (data) => {
          //     controller.enqueue(encoder.encode(
          //         `event: ${JSON.stringify(data)}\n\n`
          //     ));
          // });

          // await run.text();
          const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
          const result = async () => {
            return groq.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content: "You are a helpful assistant",
                },
                {
                  role: "user",
                  content: `${story} of about ${pages}`,
                },
              ],
              model: "llama3-8b-8192",
              temperature: 0.4,
              max_tokens: 8192,
              top_p: 1,
              stop: null,
              stream: true,
            });
          };

          const chatCompletion = await result();
          let paragraph = "";

          for await (const chunk of chatCompletion) {
            // // Print the completion returned by the LLM.
            // console.log(chunk.choices[0]?.delta?.content || "");
            // controller.enqueue(
            //   encoder.encode(`event: ${JSON.stringify(chunk.choices[0]?.delta?.content)}\n\n`)
            // );
            const content = chunk.choices[0]?.delta?.content || "";

            // Accumulate the text into a paragraph
            paragraph += content;

            // Check if a full sentence or paragraph is formed
            if (content.endsWith(".") || content.endsWith("\n\n")) {
              controller.enqueue(
                encoder.encode(`event: ${JSON.stringify(paragraph)}\n\n`)
              );
              paragraph = ""; // Reset for the next sentence/paragraph
            }
          }
          // controller.enqueue(
          //   encoder.encode(`event: ${JSON.stringify(chat)}\n\n`)
          // );

          controller.close();
        } catch (error) {
          controller.error(error);
          console.log(error);
        }
      },
    });
    // now the stream has been created now forntend should continuously listen the events and show the data on the frontend that is being streamed and the connection should not get closed

    return new Response(stream, {
      headers: {
        "Content-type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
