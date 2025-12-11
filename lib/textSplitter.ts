import { TokenTextSplitter } from "langchain/text_splitter";
import { TEXT_SPLITTER_CONFIG } from "@/config/vectorStore";

const splitter = new TokenTextSplitter({
  ...TEXT_SPLITTER_CONFIG,
  encodingName: "cl100k_base",
});

export async function splitText(text: string): Promise<string[]> {
  return splitter.splitText(text);
}
