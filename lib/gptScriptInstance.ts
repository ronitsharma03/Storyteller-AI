import { GPTScript } from "@gptscript-ai/gptscript";

const gInstance = new GPTScript({
    APIKey: process.env.OPENAI_API_KEY,
});

export default gInstance; 