import { toolsList } from "../../config/tools-list";
import { VECTOR_STORE_ID } from "@/config/constants";

/**
 * Tool definitions used by the assistant. The OpenAI provider expects the
 * builtin `file_search` tool referencing the remote vector store, while the
 * Ollama provider only needs the function tools defined in `toolsList`.
 */

export const functionTools = toolsList;

export const functionToolNames = functionTools
  .map((tool) => (tool.type === "function" ? tool.function?.name : null))
  .filter((name): name is string => typeof name === "string");

// Tools for the OpenAI provider (includes built-in file search)
export const tools = [
  {
    type: "file_search",
    vector_store_ids: [VECTOR_STORE_ID],
  },
  ...functionTools,
];

// Tools for the Ollama provider (function tools only)
export const ollamaTools = [...functionTools];
