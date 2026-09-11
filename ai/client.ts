import "server-only";
import OpenAI from "openai";
import {
  getAIConfig,
  getVectorStoreConfig,
  type AIConfig,
} from "./config";
import {
  createProviderClient,
  createVectorStoreClient,
  getProviderCapabilities,
} from "./provider";

type ResponseTool = { type?: string; [key: string]: unknown };

/**
 * Factory seam for tests or future dependency injection. Application code uses
 * the singleton below and never constructs a provider SDK directly.
 */
export function createAIClient(config: AIConfig): OpenAI {
  return createProviderClient(config);
}

const config = getAIConfig();

export const aiClient = createAIClient(config);
export const aiModel = config.model;

let vectorStoreClient: OpenAI | undefined;

/**
 * Lazily creates an OpenAI client for Vector Stores. Keeping it separate from
 * `aiClient` prevents OpenRouter's base URL from being used for OpenAI-only
 * resource APIs.
 */
export function getVectorStoreClient(): OpenAI {
  vectorStoreClient ??= createVectorStoreClient(getVectorStoreConfig());
  return vectorStoreClient;
}

/**
 * Returns a provider-compatible Responses API payload. Callers only deal in
 * capabilities—not a concrete provider name or provider-specific URL.
 */
export function getResponseProviderOptions<T extends ResponseTool>(tools: T[]) {
  const capabilities = getProviderCapabilities(config.provider);

  if (capabilities.managedFileSearch) {
    return {
      tools,
      include: ["file_search_call.results"],
    };
  }

  return {
    // Preserve the app's user-defined function tools. Only the OpenAI-hosted
    // file_search tool is unavailable through OpenRouter.
    tools: tools.filter((tool) => tool.type !== "file_search"),
  };
}
