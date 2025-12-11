import { ProviderType } from "./limiter";

type OpenAIRateLimitInfo = {
  isRateLimit: boolean;
  retryAfterMs?: number;
  code?: string;
  type?: string;
};

function toMilliseconds(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }
  return undefined;
}

function toSeconds(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return Math.max(0, parsed);
    }
  }
  return undefined;
}

function toMillisecondsFromSeconds(value: unknown): number | undefined {
  const seconds = toSeconds(value);
  if (seconds === undefined) {
    return undefined;
  }
  return Math.max(0, Math.floor(seconds * 1000));
}

function extractMessage(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "message" in value) {
    const message = (value as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }
  return undefined;
}

function parseRetryAfterFromMessage(message: string | undefined): number | undefined {
  if (!message) {
    return undefined;
  }
  const match = message.match(/try again in\s+([\d.]+)s?/i);
  if (!match) {
    return undefined;
  }
  const seconds = Number(match[1]);
  if (!Number.isFinite(seconds)) {
    return undefined;
  }
  return Math.max(0, Math.floor(seconds * 1000));
}

function coerceOpenAIErrorCandidate(error: unknown): Record<string, unknown> | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const candidate = error as Record<string, unknown>;
  const nestedError =
    (candidate.error as Record<string, unknown> | undefined) ??
    (candidate.response as any)?.data?.error ??
    (candidate.response as any)?.error ??
    (candidate.data as any)?.error ??
    (candidate.body as any)?.error;
  if (nestedError && typeof nestedError === "object") {
    return nestedError as Record<string, unknown>;
  }
  return candidate;
}

export function getOpenAIRateLimitInfo(error: unknown): OpenAIRateLimitInfo {
  if (!error || typeof error !== "object") {
    return { isRateLimit: false };
  }

  const candidate = error as Record<string, unknown>;
  const nested = coerceOpenAIErrorCandidate(error) ?? {};
  const code = (candidate.code ?? nested.code) as unknown;
  const type = (candidate.type ?? nested.type) as unknown;
  const errorCode = typeof code === "string" ? code : undefined;
  const errorType = typeof type === "string" ? type : undefined;

  const isRateLimit =
    errorCode === "rate_limit_exceeded" ||
    (typeof nested.code === "string" && nested.code === "rate_limit_exceeded") ||
    errorType === "tokens" ||
    (typeof nested.type === "string" && nested.type === "tokens");

  if (!isRateLimit) {
    return { isRateLimit: false };
  }

  const retryAfterMsCandidates: Array<number | undefined> = [
    toMillisecondsFromSeconds(nested.retry_after),
    toMilliseconds(nested.retry_after_ms),
    toMillisecondsFromSeconds((nested as any)?.retryAfter),
    toMilliseconds((nested as any)?.retryAfterMs),
    toMillisecondsFromSeconds((nested as any)?.estimated_wait),
    toMillisecondsFromSeconds((nested as any)?.estimated_wait_seconds),
    toMillisecondsFromSeconds((nested as any)?.estimated_wait_time),
    toMillisecondsFromSeconds(candidate.retry_after),
    toMilliseconds(candidate.retry_after_ms),
  ];

  let retryAfterMs = retryAfterMsCandidates.find(
    (value): value is number => value !== undefined
  );

  if (retryAfterMs === undefined) {
    retryAfterMs = parseRetryAfterFromMessage(extractMessage(nested));
  }

  if (retryAfterMs === undefined) {
    retryAfterMs = parseRetryAfterFromMessage(extractMessage(candidate));
  }

  return {
    isRateLimit: true,
    retryAfterMs,
    code: errorCode ?? (typeof nested.code === "string" ? nested.code : undefined),
    type: errorType ?? (typeof nested.type === "string" ? nested.type : undefined),
  };
}

function parseInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return fallback;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

const DEFAULT_MAX_RETRIES = Math.max(
  0,
  parseInteger(process.env.CHATWOOT_PROVIDER_MAX_RETRIES, 2)
);
const DEFAULT_BASE_DELAY_MS = Math.max(
  0,
  parseInteger(process.env.CHATWOOT_PROVIDER_RETRY_BASE_MS, 500)
);
const DEFAULT_MAX_DELAY_MS = Math.max(
  DEFAULT_BASE_DELAY_MS || 0,
  parseInteger(process.env.CHATWOOT_PROVIDER_RETRY_MAX_MS, 10_000)
);
const DEFAULT_ENABLE_JITTER = parseBoolean(
  process.env.CHATWOOT_PROVIDER_RETRY_ENABLE_JITTER,
  true
);

const randomJitter = (delayMs: number) => {
  if (!Number.isFinite(delayMs) || delayMs <= 0) return 0;
  return Math.random() * delayMs;
};

const RETRY_AFTER_HEADER = "retry-after";

function isMapLike(value: unknown): value is Map<string, unknown> {
  return !!value && typeof (value as Map<string, unknown>).get === "function";
}

function extractHeader(headers: unknown, name: string): string | undefined {
  if (!headers) return undefined;
  if (isMapLike(headers)) {
    const direct = headers.get(name);
    if (typeof direct === "string") return direct;
    if (typeof direct === "number") return String(direct);
    const fallback = headers.get(name.toLowerCase());
    if (typeof fallback === "string") return fallback;
    if (typeof fallback === "number") return String(fallback);
    return undefined;
  }
  if (typeof (headers as any).get === "function") {
    const direct = (headers as any).get(name);
    if (typeof direct === "string") return direct;
    if (typeof direct === "number") return String(direct);
    const fallback = (headers as any).get(name.toLowerCase?.() ?? name);
    if (typeof fallback === "string") return fallback;
    if (typeof fallback === "number") return String(fallback);
  }
  if (typeof headers === "object") {
    for (const [key, value] of Object.entries(headers as Record<string, unknown>)) {
      if (key.toLowerCase() === name.toLowerCase()) {
        if (Array.isArray(value)) {
          const first = value[0];
          if (typeof first === "string") return first;
          if (typeof first === "number") return String(first);
        }
        if (typeof value === "string") return value;
        if (typeof value === "number") return String(value);
      }
    }
  }
  return undefined;
}

function parseRetryAfter(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.floor(numeric * 1000));
  }
  const parsedDate = Number(new Date(trimmed));
  if (Number.isFinite(parsedDate)) {
    const delta = parsedDate - Date.now();
    return delta > 0 ? delta : 0;
  }
  return undefined;
}

function extractStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const candidate = error as Record<string, unknown>;
  const statusCandidates = [
    candidate.status,
    candidate.statusCode,
    (candidate.response as any)?.status,
    (candidate.response as any)?.statusCode,
    (candidate.response as any)?.status_code,
  ];
  for (const value of statusCandidates) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

function extractRetryAfterMs(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const candidate = error as Record<string, unknown>;
  const response = candidate.response as Record<string, unknown> | undefined;
  const headerSources = [candidate.headers, response?.headers];
  for (const headers of headerSources) {
    const value = extractHeader(headers, RETRY_AFTER_HEADER);
    const parsed = parseRetryAfter(value);
    if (parsed !== undefined) {
      return parsed;
    }
  }
  return undefined;
}

function isRetryableStatus(status: number | undefined): boolean {
  if (status === undefined) return false;
  if (status === 429) return true;
  return status >= 500 && status < 600;
}

const sleep = (ms: number) =>
  ms > 0
    ? new Promise<void>((resolve) => setTimeout(resolve, ms))
    : Promise.resolve();

export interface RetryOptions {
  provider?: ProviderType | string;
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  onRetry?: (details: RetryAttemptDetails) => void;
  sleepFn?: (ms: number) => Promise<void>;
  jitterFn?: (delayMs: number, attempt: number) => number;
}

export interface RetryAttemptDetails {
  attempt: number;
  delayMs: number;
  status?: number;
  retryAfterMs?: number;
  error: unknown;
  provider?: string;
}

export class ProviderRetryError extends Error {
  readonly provider?: string;
  readonly status?: number;
  readonly attempts: number;
  readonly retriesExhausted: boolean;
  readonly retryable: boolean;

  constructor(
    message: string,
    options: {
      provider?: string;
      status?: number;
      attempts: number;
      retriesExhausted: boolean;
      retryable: boolean;
      cause?: unknown;
    }
  ) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = "ProviderRetryError";
    this.provider = options.provider;
    this.status = options.status;
    this.attempts = options.attempts;
    this.retriesExhausted = options.retriesExhausted;
    this.retryable = options.retryable;
  }
}

export async function retryWithBackoff<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<{ result: T; attempts: number }> {
  const provider = options.provider;
  const maxRetries = Math.max(
    0,
    Number.isFinite(options.maxRetries)
      ? Math.floor(options.maxRetries as number)
      : DEFAULT_MAX_RETRIES
  );
  const baseDelayMs = Math.max(
    0,
    Number.isFinite(options.baseDelayMs)
      ? Math.floor(options.baseDelayMs as number)
      : DEFAULT_BASE_DELAY_MS
  );
  const maxDelayMs = Math.max(
    baseDelayMs,
    Number.isFinite(options.maxDelayMs)
      ? Math.floor(options.maxDelayMs as number)
      : DEFAULT_MAX_DELAY_MS
  );
  const sleepFn = options.sleepFn ?? sleep;
  const jitterFn =
    options.jitterFn ?? (DEFAULT_ENABLE_JITTER ? randomJitter : undefined);

  let attempt = 0;
  while (true) {
    try {
      const result = await operation(attempt);
      return { result, attempts: attempt + 1 };
    } catch (error) {
      const status = extractStatus(error);
      const openAiInfo = getOpenAIRateLimitInfo(error);
      const retryStatus = status ?? (openAiInfo.isRateLimit ? 429 : undefined);
      const retryable = isRetryableStatus(status) || openAiInfo.isRateLimit;
      const attemptsCompleted = attempt + 1;

      if (!retryable) {
        throw error;
      }

      if (attempt >= maxRetries) {
        throw new ProviderRetryError(
          `Provider request exhausted retries${
            provider ? ` (${provider})` : ""
          } after ${attemptsCompleted} attempt${attemptsCompleted === 1 ? "" : "s"}`,
          {
            provider,
            status: retryStatus,
            attempts: attemptsCompleted,
            retriesExhausted: true,
            retryable: true,
            cause: error,
          }
        );
      }

      const retryAfterMsFromHeaders = extractRetryAfterMs(error);
      const retryAfterMs =
        retryAfterMsFromHeaders !== undefined
          ? retryAfterMsFromHeaders
          : openAiInfo.retryAfterMs;
      const exponentialDelay = Math.min(
        maxDelayMs,
        Math.max(baseDelayMs, baseDelayMs * Math.pow(2, attempt))
      );
      const nextAttempt = attempt + 1;
      let computedDelay = exponentialDelay;
      if (
        retryAfterMs === undefined &&
        jitterFn &&
        Number.isFinite(exponentialDelay) &&
        exponentialDelay > 0
      ) {
        const jittered = jitterFn(exponentialDelay, nextAttempt);
        if (Number.isFinite(jittered)) {
          computedDelay = Math.min(
            maxDelayMs,
            Math.max(0, Math.floor(jittered as number))
          );
        }
      }
      const delayMs = retryAfterMs !== undefined ? retryAfterMs : computedDelay;

      options.onRetry?.({
        attempt: nextAttempt,
        delayMs,
        retryAfterMs,
        status: retryStatus,
        error,
        provider: provider ? String(provider) : undefined,
      });

      await sleepFn(delayMs);
      attempt = nextAttempt;
    }
  }
}
