import { openaiProvider } from "./openai";
import { ollamaProvider } from "./ollama";
import { ollamaOpenAIProvider } from "./ollama_openai";
import type { ProviderEvent } from "./openai";
import type { LimiterTokens } from "./limiter";

export interface ProviderOptions {
  model?: string;
  limiterTokens?: LimiterTokens;
}

export type ProviderFunction = (
  messages: any[],
  tools: any,
  options?: ProviderOptions
) => AsyncGenerator<ProviderEvent>;

export function getProvider(name: string | undefined): ProviderFunction {
    switch (name) {
      case "ollama":
        return ollamaProvider;
      case "ollama-openai":
        return ollamaOpenAIProvider;
      case "openai":
      default:
        return openaiProvider;
    }
}