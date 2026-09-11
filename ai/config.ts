/** Providers supported by this application's AI infrastructure. */
export type AIProvider = "openai" | "openrouter";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseURL?: string;
  model: string;
}

/** Configuration for OpenAI-managed resources such as Vector Stores. */
export interface VectorStoreConfig {
  apiKey: string;
}

type Environment = NodeJS.ProcessEnv;

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL_ALIASES = new Set(["openrouter/auto"]);
const DEFAULT_OPENROUTER_EMBEDDING_MODEL = "openai/text-embedding-3-small";

function requiredEnv(name: string, environment: Environment): string {
  const value = environment[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getProvider(environment: Environment): AIProvider {
  const provider = (environment.AI_PROVIDER ?? "openai").toLowerCase();

  if (provider === "openai" || provider === "openrouter") {
    return provider;
  }

  throw new Error(
    `Unsupported AI_PROVIDER: ${provider}. Supported providers: openai, openrouter.`
  );
}

function getOpenRouterModel(environment: Environment): string {
  const model = requiredEnv("OPENROUTER_MODEL", environment);

  // `openrouter` is the gateway, not the model publisher. Its only supported
  // catalog alias is `openrouter/auto`; GPT model IDs belong to `openai/*`.
  if (
    model.startsWith("openrouter/") &&
    !OPENROUTER_MODEL_ALIASES.has(model)
  ) {
    throw new Error(
      `Invalid OPENROUTER_MODEL: ${model}. Use a catalog model ID such as openai/gpt-5.2.`
    );
  }

  return model;
}

/**
 * Resolves provider-specific environment variables into the provider-neutral
 * configuration consumed by the AI client factory.
 */
export function getAIConfig(environment: Environment = process.env): AIConfig {
  const provider = getProvider(environment);

  if (provider === "openrouter") {
    return {
      provider,
      apiKey: requiredEnv("OPENROUTER_API_KEY", environment),
      baseURL: OPENROUTER_BASE_URL,
      model: getOpenRouterModel(environment),
    };
  }

  return {
    provider,
    apiKey: requiredEnv("OPENAI_API_KEY", environment),
    model: requiredEnv("OPENAI_MODEL", environment),
  };
}

/**
 * Vector Stores are an OpenAI-managed resource, independent from the model
 * inference provider. This permits OpenRouter inference with OpenAI-backed RAG.
 */
export function getVectorStoreConfig(
  environment: Environment = process.env
): VectorStoreConfig {
  const apiKey =
    environment.OPENAI_VECTOR_STORE_API_KEY?.trim() ??
    environment.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Vector Store is not configured. Set OPENAI_VECTOR_STORE_API_KEY (or OPENAI_API_KEY). OpenRouter does not provide OpenAI Vector Stores."
    );
  }

  return { apiKey };
}

/** The model used by the local RAG store when inference is routed via OpenRouter. */
export function getOpenRouterEmbeddingModel(
  environment: Environment = process.env
): string {
  return (
    environment.OPENROUTER_EMBEDDING_MODEL?.trim() ??
    DEFAULT_OPENROUTER_EMBEDDING_MODEL
  );
}
