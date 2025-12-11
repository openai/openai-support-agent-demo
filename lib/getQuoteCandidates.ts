import type { Conversation, Message } from "@/types/chatwoot";
import {
  getConversationTranscript,
  type ConversationTranscriptEntry,
} from "@/lib/getConversationTranscript";

export type QuoteCandidate = {
  messageId: number;
  sender: "user" | "assistant";
  snippet: string;
  createdAt?: Date;
};

export type GetQuoteCandidatesOptions = {
  conversation?: Conversation | null;
  message?: Message | Record<string, unknown> | null;
  userLimit?: number;
  assistantLimit?: number;
  maxCandidates?: number;
};

const DEFAULT_MAX_CANDIDATES = 6;

const CHANNEL_KEYS = [
  "channel",
  "inbox_channel",
  "inboxChannel",
  "source_channel",
  "sourceChannel",
  "provider_channel",
  "providerChannel",
  "conversation_channel",
  "conversationChannel",
  "message_channel",
  "messageChannel",
  "medium",
];

const NESTED_CHANNEL_CARRIERS = [
  "additional_attributes",
  "additionalAttributes",
  "content_attributes",
  "contentAttributes",
  "meta",
  "conversation",
  "message",
  "sender",
  "inbox",
  "data",
  "payload",
  "source",
];

function collectChannelHints(...sources: Array<unknown>): string[] {
  const hints: string[] = [];
  const queue: Array<unknown> = sources.filter(
    (source) => source && typeof source === "object"
  );
  const visited = new Set<object>();

  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== "object") {
      continue;
    }
    if (visited.has(current as object)) {
      continue;
    }
    visited.add(current as object);
    const record = current as Record<string, unknown>;

    for (const key of CHANNEL_KEYS) {
      const value = record[key];
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) {
          hints.push(trimmed);
        }
      }
    }

    for (const key of NESTED_CHANNEL_CARRIERS) {
      const nested = record[key];
      if (nested && typeof nested === "object") {
        queue.push(nested);
      }
    }
  }

  return hints;
}

function isUnsupportedChannel(channel: string): boolean {
  const normalized = channel.toLowerCase();
  if (!normalized) {
    return false;
  }
  if (normalized.includes("sms")) {
    return true;
  }
  if (normalized.includes("twilio") && normalized.includes("whatsapp")) {
    return true;
  }
  return false;
}

function filterQuoteableEntries(
  entries: ConversationTranscriptEntry[],
  maxCandidates: number
): QuoteCandidate[] {
  const eligible = entries.filter((entry) => {
    if (!entry?.quoteEligible) {
      return false;
    }
    if (entry.sender !== "assistant" && entry.sender !== "user") {
      return false;
    }
    if (typeof entry.messageId !== "number" || !Number.isFinite(entry.messageId)) {
      return false;
    }
    if (typeof entry.contentSnippet !== "string") {
      return false;
    }
    const snippet = entry.contentSnippet.trim();
    if (!snippet) {
      return false;
    }
    return true;
  });

  const limited =
    maxCandidates >= 0 ? eligible.slice(0, maxCandidates) : eligible.slice();

  return limited.map((entry) => ({
    messageId: entry.messageId!,
    sender: entry.sender,
    snippet: entry.contentSnippet.trim(),
    createdAt: entry.createdAt,
  }));
}

export async function getQuoteCandidates(
  conversationKey: string,
  options: GetQuoteCandidatesOptions = {}
): Promise<QuoteCandidate[]> {
  const {
    conversation,
    message,
    userLimit,
    assistantLimit,
    maxCandidates = DEFAULT_MAX_CANDIDATES,
  } = options;

  const channelHints = collectChannelHints(conversation, message);
  if (channelHints.some((hint) => isUnsupportedChannel(hint))) {
    return [];
  }

  const transcriptEntries = await getConversationTranscript(conversationKey, {
    userLimit,
    assistantLimit,
  });

  if (!Array.isArray(transcriptEntries) || transcriptEntries.length === 0) {
    return [];
  }

  return filterQuoteableEntries(transcriptEntries, maxCandidates);
}

export default getQuoteCandidates;
