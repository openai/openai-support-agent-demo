import OpenAI from "openai";
import type { AIConfig, AIProvider } from "./config";

type ProviderClientFactory = (config: AIConfig) => OpenAI;

export interface AIProviderCapabilities {
  /** OpenAI-managed file_search backed by Vector Stores. */
  managedFileSearch: boolean;
}

const providerCapabilities: Record<AIProvider, AIProviderCapabilities> = {
  openai: { managedFileSearch: true },
  // OpenRouter supports user-defined function tools, but it does not expose
  // OpenAI's managed Vector Store/file_search tool.
  openrouter: { managedFileSearch: false },
};

const providerFactories: Record<AIProvider, ProviderClientFactory> = {
  openai: (config) => new OpenAI({ apiKey: config.apiKey }),
  // OpenRouter exposes an OpenAI-compatible API. Keeping this adapter here
  // prevents its URL and API-key convention from leaking into application code.
  openrouter: (config) =>
    new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    }),
};

/** Creates an SDK client for the configured provider. */
export function createProviderClient(config: AIConfig): OpenAI {
  return providerFactories[config.provider](config);
}

export function getProviderCapabilities(
  provider: AIProvider
): AIProviderCapabilities {
  return providerCapabilities[provider];
}
