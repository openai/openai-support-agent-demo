import { MODEL } from "@/config/constants";
import { encodingForModel, getEncoding, TiktokenModel } from "js-tiktoken";

const OLLAMA_MODEL_PREFIX_TO_ENCODING: Record<string, string> = {
  llama: "cl100k_base",
  qwen: "cl100k_base",
  mistral: "cl100k_base",
  phi: "cl100k_base",
  gemma: "cl100k_base",
};

function mapModelToEncoding(modelName: string) {
  const lower = modelName.toLowerCase();
  for (const prefix of Object.keys(OLLAMA_MODEL_PREFIX_TO_ENCODING)) {
    if (lower.startsWith(prefix)) {
      return OLLAMA_MODEL_PREFIX_TO_ENCODING[prefix];
    }
  }
  return modelName;
}

export const TOKEN_THRESHOLD = 25_000;

const PROVIDER_TOKEN_LIMITS: Record<
  string,
  { envVar: string; default: number }
> = {
  openai: { envVar: "CHATWOOT_OPENAI_TOKEN_LIMIT", default: TOKEN_THRESHOLD },
  ollama: { envVar: "CHATWOOT_OLLAMA_TOKEN_LIMIT", default: 6_000 },
  "ollama-openai": {
    envVar: "CHATWOOT_OLLAMA_OPENAI_TOKEN_LIMIT",
    default: TOKEN_THRESHOLD,
  },
};

function normalizeProviderName(providerName?: string) {
  return providerName?.trim().toLowerCase() || "openai";
}

function resolveEnvVarName(providerName: string) {
  const normalized = providerName
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "")
    .toUpperCase();
  return `CHATWOOT_${normalized || "OPENAI"}_TOKEN_LIMIT`;
}

export function getProviderTokenLimit(providerName?: string): number {
  const normalized = normalizeProviderName(providerName);
  const config = PROVIDER_TOKEN_LIMITS[normalized];
  const envVarName = config?.envVar ?? resolveEnvVarName(normalized);
  const envOverride = process.env[envVarName];
  const defaultFallback = config?.default ?? TOKEN_THRESHOLD;

  const fallbackEnv = process.env.CHATWOOT_DEFAULT_TOKEN_LIMIT;
  const candidates = [envOverride, fallbackEnv];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      const parsed = Number.parseInt(candidate.trim(), 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return defaultFallback;
}

export function estimateMessageTokens(
  messages: any[],
  modelName: TiktokenModel = MODEL as TiktokenModel
) {
  let encoding;
  const mapped = mapModelToEncoding(modelName);
  try {
    encoding = encodingForModel(mapped as TiktokenModel);
  } catch {
    const fallbackBase = mapped.startsWith("o") || mapped.includes("gpt-4o")
      ? "o200k_base"
      : "cl100k_base";
    try {
      encoding = encodingForModel(fallbackBase as TiktokenModel);
    } catch {
      encoding = getEncoding(fallbackBase);
    }
  }

  let total = 0;
  for (const msg of messages) {
    const content = (msg as any).content;
    if (Array.isArray(content)) {
      for (const part of content) {
        if (typeof part?.text === "string") {
          total += encoding.encode(part.text).length;
        }
      }
    } else if (typeof content === "string") {
      total += encoding.encode(content).length;
    }
  }
  return total;
}

export type { TiktokenModel };
