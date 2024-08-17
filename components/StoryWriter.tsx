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

function StoryWriter() {
    const [story, setStory] = useState("");

  return (
    <div className="flex flex-col container">
      <section className="flex-1 flex flex-col border border-rose-500 rounded-md space-y-2 p-10">
        <Textarea placeholder="The story should be about - Prompt here!" className="flex-1" value={story} onChange={(e)=>setStory(e.target.value)}/>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="How many pages to generate?" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {
                Array.from({length:10}, (_, i) => (
                    <SelectItem key={i} value={String(i+1)}>{i+1}</SelectItem>
                ))
            }
          </SelectContent>
        </Select>
        <Button className="w-full bg-rose-500" size="lg">Generate Story</Button>
      </section>

      <section className="flex-1 mt-5 pb-5"></section>
    </div>
  );
}

export default StoryWriter;
