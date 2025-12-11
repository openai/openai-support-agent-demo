import { getConversationKey } from "@/lib/getConversationKey";
import {
  getNumericId,
  storeAssistantMessage,
  type StoreAssistantMessageParams,
} from "@/lib/storeConversationMessage";

export type BotMessageIdentifiers = {
  messageId?: number;
  sourceId?: number;
  inboxId?: number;
};

export type StoreBotMessageParams = {
  accountId: number;
  conversationId: number;
  payload: unknown;
  fallbackContent?: string;
  conversationKey?: string;
  defaultMessageId?: number;
  defaultInboxId?: number;
  createdAt?: StoreAssistantMessageParams["createdAt"];
};

export type StoreBotMessageResult = {
  stored: true;
  messageId: number;
  inboxId: number;
  sourceId?: number;
  conversationKey: string;
  content: string;
};

export function resolveBotMessageIdentifiers(payload: unknown): BotMessageIdentifiers {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const record = payload as Record<string, unknown>;

  const messageId =
    getNumericId((record as any)?.id) ??
    getNumericId((record as any)?.message_id) ??
    undefined;

  const sourceId = getNumericId((record as any)?.source_id) ?? undefined;

  let inboxId = getNumericId((record as any)?.inbox_id) ?? undefined;
  if (inboxId === undefined) {
    const conversation = (record as any)?.conversation;
    if (conversation && typeof conversation === "object") {
      inboxId = getNumericId((conversation as any)?.inbox_id) ?? undefined;
    }
  }
  if (inboxId === undefined) {
    inboxId = getNumericId((record as any)?.inboxId) ?? undefined;
  }

  return { messageId, sourceId, inboxId };
}

export async function storeBotMessage({
  accountId,
  conversationId,
  payload,
  fallbackContent,
  conversationKey: providedConversationKey,
  defaultMessageId,
  defaultInboxId,
  createdAt: explicitCreatedAt,
}: StoreBotMessageParams): Promise<StoreBotMessageResult | undefined> {
  if (!payload || typeof payload !== "object") {
    console.warn("storeBotMessage payload missing", {
      accountId,
      conversationId,
    });
    return undefined;
  }

  const record = payload as Record<string, unknown>;

  const { messageId, sourceId, inboxId } = resolveBotMessageIdentifiers(record);

  const resolvedMessageId =
    getNumericId(messageId) ??
    getNumericId(sourceId) ??
    getNumericId(defaultMessageId) ??
    undefined;

  const resolvedInboxId =
    getNumericId(inboxId) ?? getNumericId(defaultInboxId) ?? undefined;

  if (typeof resolvedMessageId !== "number" || typeof resolvedInboxId !== "number") {
    console.warn("storeBotMessage missing identifiers", {
      hasMessageId: typeof messageId === "number",
      hasSourceId: typeof sourceId === "number",
      hasInboxId: typeof inboxId === "number", // inboxId maybe undefined
      hasDefaultInboxId: typeof defaultInboxId === "number",
      accountId,
      conversationId,
    });
    return undefined;
  }

  const contentValue =
    typeof record?.content === "string"
      ? record.content
      : typeof fallbackContent === "string"
        ? fallbackContent
        : "";

  const createdAtValue =
    explicitCreatedAt ??
    ((record?.created_at ?? record?.createdAt) as
      | Date
      | string
      | number
      | null
      | undefined);

  const hasConversationKey =
    typeof providedConversationKey === "string" &&
    providedConversationKey.trim().length > 0;

  const conversationKey = hasConversationKey
    ? defaultInboxId === undefined || defaultInboxId === resolvedInboxId
      ? providedConversationKey.trim()
      : getConversationKey(accountId, conversationId, resolvedInboxId)
    : getConversationKey(accountId, conversationId, resolvedInboxId);

  await storeAssistantMessage({
    accountId,
    conversationId,
    inboxId: resolvedInboxId,
    conversationKey,
    messageId: resolvedMessageId,
    content: contentValue,
    createdAt: createdAtValue,
  });

  return {
    stored: true,
    messageId: resolvedMessageId,
    inboxId: resolvedInboxId,
    sourceId: getNumericId(sourceId) ?? undefined,
    conversationKey,
    content: contentValue,
  };
}
