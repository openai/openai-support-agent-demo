import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { getConversationKey } from "@/lib/getConversationKey";

export type StoreAssistantMessageParams = {
  accountId: number;
  conversationId: number;
  inboxId: number;
  messageId: number;
  content: string;
  conversationKey?: string;
  createdAt?: Date | string | number | null;
};

export function getNumericId(value: unknown): number | undefined {
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

function toDate(value: Date | string | number | null | undefined): Date | undefined {
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

export async function storeAssistantMessage({
  accountId,
  conversationId,
  inboxId,
  messageId,
  content,
  conversationKey: providedKey,
  createdAt: rawCreatedAt,
}: StoreAssistantMessageParams) {
  if (!Number.isFinite(accountId) || !Number.isFinite(conversationId)) {
    return;
  }
  if (!Number.isFinite(inboxId) || !Number.isFinite(messageId)) {
    return;
  }

  const conversationKey =
    providedKey ?? getConversationKey(accountId, conversationId, inboxId);

  const normalizedContent =
    typeof content === "string"
      ? content
      : typeof content === "object"
        ? JSON.stringify(content)
        : String(content ?? "");

  const messageData: Parameters<typeof prisma.conversationMessage.upsert>[0]["create"] = {
    messageId,
    conversationId,
    inboxId,
    conversationKey,
    sender: "bot",
    content: normalizedContent,
  };

  const createdAt = toDate(rawCreatedAt ?? undefined);
  if (createdAt) {
    messageData.createdAt = createdAt;
  }

  try {
    await prisma.conversationMessage.upsert({
      where: { conversationKey_messageId: { conversationKey, messageId } },
      update: {},
      create: messageData,
    });
  } catch (err) {
    console.error("assistant message log error", err);
    return;
  }

  try {
    const redisClient = redis as unknown as {
      exists?: (key: string) => Promise<number>;
      pipeline?: () => {
        rpush: (key: string, value: string) => unknown;
        expire: (key: string, seconds: number) => unknown;
        exec: () => Promise<unknown>;
      };
    };

    if (
      typeof redisClient?.exists === "function" &&
      typeof redisClient?.pipeline === "function"
    ) {
      const key = conversationKey;
      const keyExists = await redisClient.exists(key);
      if (!keyExists) {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recent = await prisma.conversationMessage.findMany({
          where: { conversationKey, createdAt: { gte: since } },
          orderBy: { messageId: "asc" },
        });
        if (recent.length) {
          const pipeline = redisClient.pipeline();
          for (const record of recent) {
            pipeline.rpush(key, JSON.stringify(record));
          }
          pipeline.expire(key, 86400);
          await pipeline.exec();
        }
      } else {
        const pipeline = redisClient.pipeline();
        const redisPayload = {
          messageId,
          conversationId,
          inboxId,
          conversationKey,
          sender: "bot",
          content: normalizedContent,
          createdAt: createdAt ?? undefined,
        };
        pipeline.rpush(key, JSON.stringify(redisPayload));
        pipeline.expire(key, 86400);
        await pipeline.exec();
      }
    }
  } catch (err) {
    console.error("assistant message redis log error", err);
  }
}

export default storeAssistantMessage;
