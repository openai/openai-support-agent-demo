import prisma from "@/lib/prisma";
import redis from "@/lib/redis";

export type ConversationTranscriptEntry = {
  messageId?: number;
  sender: "user" | "assistant";
  contentSnippet: string;
  quoteEligible: boolean;
  createdAt?: Date;
};

export type GetConversationTranscriptOptions = {
  userLimit?: number;
  assistantLimit?: number;
};

type RawTranscriptRecord = {
  messageId?: number | string | null;
  sender?: string | null;
  message_type?: string | number | null;
  messageType?: string | number | null;
  type?: string | number | null;
  content?: unknown;
  createdAt?: string | number | Date | null;
  created_at?: string | number | Date | null;
  private?: boolean | string | null;
  is_private?: boolean | string | null;
  content_attributes?: Record<string, unknown> | null;
  additional_attributes?: Record<string, unknown> | null;
  channel?: string | null;
  inboxChannel?: string | null;
  conversationChannel?: string | null;
  [key: string]: unknown;
};

const DEFAULT_USER_LIMIT = 4;
const DEFAULT_ASSISTANT_LIMIT = 4;
const MAX_SNIPPET_LENGTH = 40;
const PRISMA_LOOKBACK_LIMIT = 50;

function toDate(value: unknown): Date | undefined {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value > 1_000_000_000_000 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  return false;
}

function normalizeRole(raw: RawTranscriptRecord): "assistant" | "user" | undefined {
  const sender = typeof raw.sender === "string" ? raw.sender.toLowerCase() : undefined;
  if (sender && sender.includes("bot")) {
    return "assistant";
  }

  const messageType = raw.message_type ?? raw.messageType ?? raw.type;
  if (typeof messageType === "string") {
    const normalized = messageType.toLowerCase();
    if (normalized.includes("outgoing") || normalized.includes("assistant")) {
      return "assistant";
    }
    if (normalized.includes("incoming") || normalized.includes("user")) {
      return "user";
    }
  }
  if (typeof messageType === "number") {
    if (messageType === 1) {
      return "assistant";
    }
    if (messageType === 0) {
      return "user";
    }
  }

  if (sender && (sender.includes("agent") || sender.includes("assistant"))) {
    return "assistant";
  }

  return sender ? "user" : undefined;
}

function extractChannel(raw: RawTranscriptRecord): string | undefined {
  const candidates = [
    raw.channel,
    raw.inboxChannel,
    raw.conversationChannel,
    raw.additional_attributes?.channel,
    raw.additional_attributes?.inbox_channel,
    raw.content_attributes?.channel,
    raw.content_attributes?.inbox_channel,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }
  return undefined;
}

function isUnsupportedChannel(channel: string | undefined): boolean {
  if (!channel) {
    return false;
  }
  const normalized = channel.toLowerCase();
  if (normalized.includes("sms")) {
    return true;
  }
  if (normalized.includes("twilio") && normalized.includes("whatsapp")) {
    return true;
  }
  return false;
}

function buildSnippet(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_SNIPPET_LENGTH) {
    return normalized;
  }
  const truncated = normalized.slice(0, MAX_SNIPPET_LENGTH - 1).trimEnd();
  return `${truncated}…`;
}

function normalizeContent(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function parseMessageId(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number.parseInt(trimmed, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function isPrivateTurn(raw: RawTranscriptRecord): boolean {
  if (parseBoolean(raw.private) || parseBoolean(raw.is_private)) {
    return true;
  }
  const messageType = raw.message_type ?? raw.messageType ?? raw.type;
  if (typeof messageType === "string") {
    const normalized = messageType.toLowerCase();
    if (normalized.includes("private") || normalized.includes("note")) {
      return true;
    }
  }
  if (typeof messageType === "number") {
    if (messageType === 2) {
      return true;
    }
  }
  const attrs = raw.content_attributes;
  if (attrs && typeof attrs === "object") {
    if (parseBoolean((attrs as Record<string, unknown>).private)) {
      return true;
    }
  }
  return false;
}

function normalizeRecord(
  raw: RawTranscriptRecord
): (ConversationTranscriptEntry & { createdAt?: Date }) | undefined {
  const sender = normalizeRole(raw);
  if (!sender) {
    return undefined;
  }

  const content = normalizeContent(raw.content);
  if (content === undefined) {
    return undefined;
  }

  const messageId = parseMessageId(raw.messageId);
  const createdAt = toDate(raw.createdAt ?? raw.created_at);
  const channel = extractChannel(raw);
  if (isUnsupportedChannel(channel)) {
    return undefined;
  }
  const quoteEligible = !isPrivateTurn(raw);

  const snippet = buildSnippet(content);

  return {
    messageId,
    sender,
    contentSnippet: snippet,
    quoteEligible,
    createdAt,
  };
}

function mergeEntries(
  records: RawTranscriptRecord[],
  userLimit: number,
  assistantLimit: number
): ConversationTranscriptEntry[] {
  const userEntries: ConversationTranscriptEntry[] = [];
  const assistantEntries: ConversationTranscriptEntry[] = [];
  const seenIds = new Set<number>();

  for (let i = records.length - 1; i >= 0; i -= 1) {
    const raw = records[i];
    const normalized = normalizeRecord(raw);
    if (!normalized) {
      continue;
    }
    if (typeof normalized.messageId === "number") {
      if (seenIds.has(normalized.messageId)) {
        continue;
      }
      seenIds.add(normalized.messageId);
    }
    if (normalized.sender === "user") {
      if (userEntries.length >= userLimit) {
        continue;
      }
      userEntries.push(normalized);
    } else if (normalized.sender === "assistant") {
      if (assistantEntries.length >= assistantLimit) {
        continue;
      }
      assistantEntries.push(normalized);
    }
    if (userEntries.length >= userLimit && assistantEntries.length >= assistantLimit) {
      break;
    }
  }

  const combined = [...userEntries, ...assistantEntries];
  combined.sort((a, b) => {
    const aTime = a.createdAt?.getTime() ?? 0;
    const bTime = b.createdAt?.getTime() ?? 0;
    if (aTime === bTime) {
      const aId = a.messageId ?? 0;
      const bId = b.messageId ?? 0;
      return bId - aId;
    }
    return bTime - aTime;
  });
  return combined;
}

async function loadFromRedis(
  conversationKey: string
): Promise<RawTranscriptRecord[] | undefined> {
  try {
    const redisClient = redis as unknown as {
      lrange?: (key: string, start: number, stop: number) => Promise<string[] | null>;
    };
    if (typeof redisClient?.lrange !== "function") {
      return undefined;
    }
    const entries = await redisClient.lrange(conversationKey, 0, -1);
    if (!entries || !entries.length) {
      return undefined;
    }
    const parsed = entries
      .map((entry) => {
        try {
          return JSON.parse(entry) as RawTranscriptRecord;
        } catch {
          return undefined;
        }
      })
      .filter((item): item is RawTranscriptRecord => Boolean(item));
    if (!parsed.length) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

async function loadFromPrisma(
  conversationKey: string,
  take: number
): Promise<RawTranscriptRecord[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const records = await prisma.conversationMessage.findMany({
    where: { conversationKey, createdAt: { gte: since } },
    orderBy: { messageId: "desc" },
    take,
  });
  return records.reverse() as unknown as RawTranscriptRecord[];
}

export async function getConversationTranscript(
  conversationKey: string,
  options: GetConversationTranscriptOptions = {}
): Promise<ConversationTranscriptEntry[]> {
  const userLimit = Math.max(0, options.userLimit ?? DEFAULT_USER_LIMIT);
  const assistantLimit = Math.max(0, options.assistantLimit ?? DEFAULT_ASSISTANT_LIMIT);
  if (userLimit === 0 && assistantLimit === 0) {
    return [];
  }

  const redisRecords = await loadFromRedis(conversationKey);
  if (redisRecords) {
    return mergeEntries(redisRecords, userLimit, assistantLimit);
  }

  const take = Math.max(
    PRISMA_LOOKBACK_LIMIT,
    (userLimit + assistantLimit) * 3,
    userLimit * 4,
    assistantLimit * 4
  );
  const prismaRecords = await loadFromPrisma(conversationKey, take);
  if (!prismaRecords.length) {
    return [];
  }
  return mergeEntries(prismaRecords, userLimit, assistantLimit);
}

export default getConversationTranscript;
