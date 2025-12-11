import { getConversationHistory } from "@/lib/getConversationHistory";
import redis from "@/lib/redis";
import type { ResponseMessage } from "@/lib/utils/toResponseMessage";

const DEFAULT_HISTORY_LIMIT = 50;
const MAX_HISTORY_LIMIT = 100;
const MAX_SNIPPET_LENGTH = 120;
const HIGHLIGHT_LIMIT = 2;
const SYNOPSIS_CACHE_TTL_SECONDS = 300;

export type ConversationSynopsisOptions = {
  latestMessageId?: number | string | null;
  limit?: number;
  history?: ResponseMessage[];
};

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.slice(0, Math.max(0, maxLength - 1)).trimEnd();
  return `${truncated}…`;
}

function extractText(message: ResponseMessage): string {
  if (!message || message.role === "system" || message.role === "developer") {
    return "";
  }
  if (!Array.isArray(message.content)) {
    return "";
  }
  const pieces: string[] = [];
  for (const part of message.content) {
    if (!part) {
      continue;
    }

    switch (part.type) {
      case "input_text":
      case "output_text":
        if (typeof part.text === "string" && part.text.trim()) {
          pieces.push(part.text);
        }
        break;
      default:
        // Ignore images or any other non-text content types.
        break;
    }
  }

  if (!pieces.length) {
    return "";
  }

  return collapseWhitespace(pieces.join(" "));
}

type TurnSnippet = {
  role: "user" | "assistant";
  snippet: string;
};

function gatherHighlights(
  turns: TurnSnippet[],
  role: TurnSnippet["role"],
  limit: number
): string[] {
  const highlights: string[] = [];
  const seen = new Set<string>();
  for (let i = turns.length - 1; i >= 0 && highlights.length < limit; i -= 1) {
    const turn = turns[i];
    if (turn.role !== role) {
      continue;
    }
    const normalized = turn.snippet.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    highlights.push(turn.snippet);
  }
  return highlights.reverse();
}

function formatHighlights(snippets: string[]): string {
  return snippets.map((snippet) => `"${snippet}"`).join("; ");
}

function buildSynopsis(turns: TurnSnippet[]): string | undefined {
  if (!turns.length) {
    return undefined;
  }

  const totalTurns = turns.length;
  const userTurns = turns.filter((turn) => turn.role === "user").length;
  const assistantTurns = turns.filter((turn) => turn.role === "assistant").length;

  const customerHighlights = gatherHighlights(turns, "user", HIGHLIGHT_LIMIT);
  const assistantHighlights = gatherHighlights(
    turns,
    "assistant",
    HIGHLIGHT_LIMIT
  );

  const latest = turns[turns.length - 1];
  const latestRoleLabel = latest.role === "assistant" ? "assistant" : "customer";

  const sentences: string[] = [
    `Conversation synopsis (${totalTurns} turns: ${userTurns} customer / ${assistantTurns} assistant).`,
  ];

  if (customerHighlights.length) {
    sentences.push(`Customer focus: ${formatHighlights(customerHighlights)}.`);
  }

  if (assistantHighlights.length) {
    sentences.push(`Agent notes: ${formatHighlights(assistantHighlights)}.`);
  }

  if (latest?.snippet) {
    sentences.push(`Latest turn (${latestRoleLabel}): "${latest.snippet}".`);
  }

  return sentences.join(" ");
}

async function readCachedSynopsis(cacheKey: string): Promise<string | undefined> {
  try {
    if (typeof (redis as any)?.get !== "function") {
      return undefined;
    }
    const cached = await redis.get(cacheKey);
    if (typeof cached !== "string" || !cached.trim()) {
      return undefined;
    }
    try {
      const parsed = JSON.parse(cached);
      if (typeof parsed?.summary === "string") {
        return parsed.summary;
      }
    } catch {
      return cached;
    }
  } catch {
    // ignore redis errors
  }
  return undefined;
}

async function writeCachedSynopsis(cacheKey: string, summary: string) {
  try {
    if (typeof (redis as any)?.set !== "function") {
      return;
    }
    await redis.set(
      cacheKey,
      JSON.stringify({ summary, updatedAt: Date.now() }),
      "EX",
      SYNOPSIS_CACHE_TTL_SECONDS
    );
  } catch {
    // ignore redis errors
  }
}

export async function getConversationSynopsis(
  conversationKey: string,
  options?: ConversationSynopsisOptions
): Promise<string | undefined> {
  const normalizedKey = typeof conversationKey === "string" ? conversationKey.trim() : "";
  if (!normalizedKey) {
    return undefined;
  }

  const rawLimit = options?.limit;
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.trunc(rawLimit as number), 1), MAX_HISTORY_LIMIT)
    : DEFAULT_HISTORY_LIMIT;

  const latestMessageId = options?.latestMessageId;
  const cacheKey = latestMessageId !== undefined && latestMessageId !== null
    ? `synopsis:${normalizedKey}:${String(latestMessageId)}`
    : `synopsis:${normalizedKey}`;

  const cached = await readCachedSynopsis(cacheKey);
  if (cached) {
    return cached;
  }

  let history = options?.history;
  if (!history) {
    history = await getConversationHistory(normalizedKey, limit);
  }

  if (!Array.isArray(history) || !history.length) {
    return undefined;
  }

  const recent = history.slice(-limit);
  const turns: TurnSnippet[] = recent
    .map((message) => {
      const role =
        message.role === "assistant"
          ? "assistant"
          : message.role === "user"
            ? "user"
            : undefined;
      if (!role) {
        return undefined;
      }
      const text = extractText(message);
      if (!text) {
        return undefined;
      }
      const snippet = truncate(text, MAX_SNIPPET_LENGTH);
      if (!snippet) {
        return undefined;
      }
      return { role, snippet };
    })
    .filter((value): value is TurnSnippet => Boolean(value));

  const summary = buildSynopsis(turns);
  if (!summary) {
    return undefined;
  }

  await writeCachedSynopsis(cacheKey, summary);
  return summary;
}
