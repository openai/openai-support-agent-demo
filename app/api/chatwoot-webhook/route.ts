import { NextResponse } from "next/server";
import { parse } from "partial-json";
import type { ChatwootWebhookPayload, Conversation } from "@/types/chatwoot";
import prisma from "@/lib/prisma";
import {
  getNextAgent,
  setActiveConversation,
  type AgentAvailabilitySummary,
} from "@/lib/agentRotation";
import { sendBotMessage } from "@/lib/chatwootBot";
import redis from "@/lib/redis";
import { storeBotMessage } from "@/lib/storeBotMessage";
import handOff from "@/lib/handoff";
import {
  getConversation,
  getConversationMessages,
  getConversationLabels,
  setConversationLabels,
  updateConversationCustomAttributes,
} from "@/lib/chatwoot";
import { CONVO_LABELS, HANDOFF_STATUS_LABELS } from "@/lib/constants";
import { getProvider } from "@/lib/providers";
import { ProviderRetryError } from "@/lib/providers/retry";
import { INBOX_MODE } from "@/config/inboxMode";
import { tools } from "@/lib/tools/tools";
import {
  toResponseMessage,
  type ResponseContentItem,
  type ResponseMessage,
} from "@/lib/utils/toResponseMessage";
import {
  enqueueRequest,
  updateRequest,
  updateQueuePositions,
  formatQueuePositionMessage,
  type QueuePositionUpdate,
} from "@/lib/handoffQueue";
import { handoffStrategy } from "@/config/handoffStrategy";
import { releaseAgent } from "@/lib/conversationResolution";
import { CHATWOOT_SYSTEM_PROMPT, MODEL } from "@/config/constants";
import {
  RELEVANCE_FOLLOW_UP_MESSAGE,
  RELEVANCE_REJECTION_MESSAGE,
} from "@/config/guardrailMessages";
import { getConversationKey } from "@/lib/getConversationKey";
import { getConversationHistory } from "@/lib/getConversationHistory";
import { getConversationSynopsis } from "@/lib/getConversationSynopsis";
import { getQuoteCandidates, type QuoteCandidate } from "@/lib/getQuoteCandidates";
import { fetchAttachmentImage } from "@/lib/chatwoot/fetchAttachmentImage";
import {
  runRelevanceGuardrail,
  runJailbreakGuardrail,
} from "@/lib/guardrails";
import {
  gatherImageInsights,
  type GatherImageInsightsResult,
} from "@/lib/chatwoot/imageInsights";
import {
  COMPLAINT_FORM_REMINDER_TEXT,
  COMPLAINT_FORM_SUBMISSION_CONFIRMATION_TEXT,
} from "@/lib/chatwoot/messages";
import {
  recordReleaseFailure,
  clearReleaseAttempts,
} from "@/lib/releaseAttempts";
import { notifyMessageIssue, notifyHandoffIssue } from "@/lib/friendlyErrors";
import { shouldQuoteInboundMessage } from "@/lib/quoteHeuristics";
import {
  estimateMessageTokens,
  getProviderTokenLimit,
  type TiktokenModel,
} from "@/lib/utils/tokenCounter";
import {
  enqueueChatwootJob,
  isChatwootQueueEnabled,
  setChatwootJobRunner,
  setChatwootQueueFailureReporter,
} from "@/lib/chatwoot/jobQueue";
import {
  chatwootToolExecutors,
  type ChatwootToolExecutionContext,
} from "@/lib/chatwoot/toolExecutors";
import {
  submitOpenAIToolOutputs,
  type ProviderEvent,
} from "@/lib/providers/openai";

type HistoryTurn = { role: string; content: string };

const QUOTE_TRANSCRIPT_USER_LIMIT = 4;
const QUOTE_TRANSCRIPT_ASSISTANT_LIMIT = 2;
const MAX_DEVELOPER_QUOTE_LINES = 6;
const SYNOPSIS_HISTORY_LIMIT = 50;
const PROMPT_HISTORY_LIMIT = 20;

type ChatwootJobPhase =
  | "payload-normalization"
  | "attachment-insight"
  | "history-retrieval"
  | "guardrail-evaluation"
  | "provider-execution"
  | "chatwoot-postback";

type ChatwootJobPhaseEventType = "start" | "complete";

type ChatwootJobPhaseLog = {
  jobId?: number | string;
  phase: ChatwootJobPhase;
  event: ChatwootJobPhaseEventType;
  elapsedMs: number;
  phaseMs?: number;
  timestamp: number;
};

const SKIP_FALLBACK_SYMBOL = Symbol("chatwootSkipFallback");

function markErrorToSkipFallback(error: unknown) {
  if (error && typeof error === "object") {
    Object.defineProperty(error, SKIP_FALLBACK_SYMBOL, {
      value: true,
      enumerable: false,
      configurable: true,
    });
  }
}

function shouldSkipFallbackForError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      (error as Record<symbol, unknown>)[SKIP_FALLBACK_SYMBOL]
  );
}

const HANDOFF_STATUS_LABEL_SET = new Set<string>(HANDOFF_STATUS_LABELS);

function normalizeLabelArray(labels: unknown): string[] {
  if (!Array.isArray(labels)) {
    return [];
  }
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const label of labels) {
    if (typeof label !== "string") continue;
    const trimmed = label.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    normalized.push(trimmed);
  }
  return normalized;
}

function dedupeLabels(labels: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const label of labels) {
    if (seen.has(label)) continue;
    seen.add(label);
    result.push(label);
  }
  return result;
}

/**
 * Ensures status updates preserve any non-handoff labels on the conversation.
 *
 * The managed status labels are defined in HANDOFF_STATUS_LABELS (see
 * lib/constants.ts) so other pipelines can share the same allowlist.
 */
async function mergeStatusLabelForConversation({
  accountId,
  conversationId,
  conversation,
  statusLabel,
  logContext,
}: {
  accountId: number | undefined;
  conversationId: number | undefined;
  conversation?: Conversation | null;
  statusLabel: string;
  logContext?: string;
}): Promise<string[]> {
  if (typeof accountId !== "number" || typeof conversationId !== "number") {
    return [statusLabel];
  }

  let existingLabels = normalizeLabelArray((conversation as any)?.label_list);
  let source: "payload" | "fetched" | "none" = existingLabels.length
    ? "payload"
    : "none";

  if (!existingLabels.length) {
    try {
      const current = await getConversationLabels(accountId, conversationId);
      const fetched = normalizeLabelArray((current as any)?.payload);
      if (fetched.length) {
        existingLabels = fetched;
        source = "fetched";
      }
    } catch (err) {
      console.error("handoff merge labels fetch error", err);
    }
  }

  const preserved = existingLabels.filter(
    (label) => !HANDOFF_STATUS_LABEL_SET.has(label)
  );
  const merged = dedupeLabels([...preserved, statusLabel]);

  if (conversation && typeof conversation === "object") {
    (conversation as Record<string, unknown>).label_list = merged;
  }

  if (logContext) {
    console.info("handoff", {
      step: "merge-labels",
      context: logContext,
      accountId,
      conversationId,
      statusLabel,
      source,
      preservedCount: preserved.length,
    });
  }

  return merged;
}

function logChatwootJobPhase(details: ChatwootJobPhaseLog) {
  console.info("chatwoot webhook job phase", details);
}

function createChatwootJobPhaseTimer(jobId?: number | string) {
  const jobStart = Date.now();
  return {
    startPhase(phase: ChatwootJobPhase) {
      const phaseStart = Date.now();
      logChatwootJobPhase({
        jobId,
        phase,
        event: "start",
        elapsedMs: phaseStart - jobStart,
        timestamp: phaseStart,
      });
      let finished = false;
      return () => {
        if (finished) {
          return;
        }
        finished = true;
        const phaseEnd = Date.now();
        logChatwootJobPhase({
          jobId,
          phase,
          event: "complete",
          elapsedMs: phaseEnd - jobStart,
          phaseMs: phaseEnd - phaseStart,
          timestamp: phaseEnd,
        });
      };
    },
  };
}

type NormalizedAttachment = {
  displayName: string;
  mimeType?: string;
  url?: string;
  dataUrl?: string;
  base64?: string;
  isImage: boolean;
  fetchedDataUrl?: string | null;
};

const IMAGE_FILE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".heic",
  ".heif",
  ".tiff",
  ".svg",
];

function pickString(
  value: unknown,
  fallback?: string
): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  if (fallback && fallback.trim()) {
    return fallback.trim();
  }
  return undefined;
}

function looksLikeBase64(value: string): boolean {
  if (!value) return false;
  const normalized = value.trim();
  if (!normalized) return false;
  if (normalized.startsWith("data:")) {
    return true;
  }
  // Basic heuristic that avoids matching plain text URLs.
  return /^[A-Za-z0-9+/=\s]+$/.test(normalized) && normalized.length > 20;
}

function guessIsImage(
  mimeType?: string,
  fileName?: string,
  attachmentUrl?: string
): boolean {
  if (mimeType) {
    const normalizedMime = mimeType.trim().toLowerCase();
    if (!normalizedMime) {
      // fall through to file/url heuristics
    } else if (
      normalizedMime === "image" ||
      normalizedMime.startsWith("image/")
    ) {
      return true;
    }
  }

  const hasImageExtension = (value?: string): boolean => {
    if (!value) {
      return false;
    }
    const lower = value.toLowerCase();
    const sanitized = lower.split(/[?#]/)[0];
    return IMAGE_FILE_EXTENSIONS.some((ext) => sanitized.endsWith(ext));
  };

  if (hasImageExtension(fileName)) {
    return true;
  }

  if (!fileName && hasImageExtension(attachmentUrl)) {
    return true;
  }

  return false;
}

function normalizeAttachment(raw: unknown): NormalizedAttachment | undefined {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }

  const candidate = raw as Record<string, unknown>;
  const fileName =
    pickString(candidate.file_name) ??
    pickString(candidate.filename) ??
    pickString(candidate.name) ??
    pickString(candidate.title);
  const mimeType =
    pickString(candidate.file_type) ??
    pickString(candidate.content_type) ??
    pickString(candidate.mime_type) ??
    pickString(candidate.mimeType) ??
    pickString(candidate.fileType);

  const urlCandidates = [
    candidate.data_url,
    candidate.download_url,
    candidate.file_url,
    candidate.url,
    candidate.origin_url,
    candidate.resource_url,
    candidate.view_url,
    candidate.thumb_url,
    candidate.secure_url,
    candidate.link,
  ];
  let url: string | undefined;
  let dataUrl: string | undefined;
  for (const candidateUrl of urlCandidates) {
    const normalized = pickString(candidateUrl);
    if (!normalized) continue;
    if (normalized.startsWith("data:")) {
      dataUrl = normalized;
      break;
    }
    if (!url) {
      url = normalized;
    }
  }

  const base64Candidates = [
    candidate.base64,
    candidate.base64_data,
    candidate.base64Content,
    candidate.data,
    candidate.payload,
    candidate.content,
  ];
  let base64: string | undefined;
  for (const value of base64Candidates) {
    const normalized = pickString(value);
    if (!normalized) continue;
    if (looksLikeBase64(normalized)) {
      if (normalized.startsWith("data:")) {
        dataUrl = normalized;
        base64 = undefined;
        break;
      }
      base64 = normalized.replace(/\s+/g, "");
      if (!dataUrl && mimeType) {
        dataUrl = `data:${mimeType};base64,${base64}`;
      }
    }
  }

  const inferredImage = guessIsImage(mimeType, fileName, url ?? dataUrl);

  if (!url && !dataUrl && base64 && inferredImage) {
    dataUrl = `data:image/*;base64,${base64}`;
  }

  if (!url && !dataUrl && !base64) {
    return undefined;
  }

  const displayName =
    fileName ?? (inferredImage ? "Image attachment" : "File attachment");

  return {
    displayName,
    mimeType,
    url,
    dataUrl,
    base64,
    isImage: inferredImage,
  };
}

function extractMessageAttachments(message: unknown): NormalizedAttachment[] {
  if (!message || typeof message !== "object") {
    return [];
  }

  const list: unknown[] = [];
  const root = message as Record<string, unknown>;
  const direct = root.attachments;
  if (Array.isArray(direct)) {
    list.push(...direct);
  }

  const contentAttributes = root.content_attributes;
  if (contentAttributes && typeof contentAttributes === "object") {
    const attrs = contentAttributes as Record<string, unknown>;
    const attributeLists = [
      attrs.attachments,
      attrs.files,
      attrs.media,
      attrs.images,
    ];
    for (const candidate of attributeLists) {
      if (Array.isArray(candidate)) {
        list.push(...candidate);
      }
    }
  }

  const normalized: NormalizedAttachment[] = [];
  for (const entry of list) {
    const parsed = normalizeAttachment(entry);
    if (parsed) {
      normalized.push(parsed);
    }
  }

  return normalized;
}

type NormalizedFormSubmissionValue = {
  name: string;
  label: string;
  value: string;
  displayValue: string;
};

function humanizeFormFieldName(name: string): string {
  if (!name) {
    return "Field";
  }

  const withSpaces = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!withSpaces) {
    return "Field";
  }

  return withSpaces
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeSubmittedFieldValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((entry) => normalizeSubmittedFieldValue(entry))
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    return parts.join(", ");
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidateKeys = [
      "value",
      "label",
      "title",
      "text",
      "name",
      "content",
      "display",
    ];
    for (const key of candidateKeys) {
      if (key in record) {
        const normalized = normalizeSubmittedFieldValue(record[key]);
        if (normalized.trim()) {
          return normalized.trim();
        }
      }
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function normalizeFormSubmittedValues(
  values: unknown
): NormalizedFormSubmissionValue[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const normalizedEntries = new Map<string, NormalizedFormSubmissionValue>();

  for (const rawEntry of values) {
    if (!rawEntry || typeof rawEntry !== "object") {
      continue;
    }

    const entry = rawEntry as Record<string, unknown>;
    const rawName =
      pickString(entry.name) ??
      pickString(entry.attribute_name) ??
      pickString(entry.key);
    const name = rawName?.trim();
    if (!name) {
      continue;
    }

    const rawLabel =
      pickString(entry.label) ?? pickString(entry.title) ?? pickString(entry.display_name);
    const label = rawLabel?.trim() || humanizeFormFieldName(name);
    const rawValue =
      entry.value ?? entry.answer ?? entry.text ?? entry.content ?? entry.selected;
    const value = normalizeSubmittedFieldValue(rawValue).trim();
    const displayValue = value || "(empty)";

    normalizedEntries.set(name, { name, label, value, displayValue });
  }

  return Array.from(normalizedEntries.values());
}

function buildFormSubmissionSummary(
  values: NormalizedFormSubmissionValue[]
): string {
  if (!values.length) {
    return "Form submission received.";
  }

  const parts = values.map(
    (entry) => `${entry.label} – ${entry.displayValue}`
  );

  return `Form submission: ${parts.join("; ")}`;
}

function buildFormSubmissionDetailText(
  values: NormalizedFormSubmissionValue[]
): string {
  if (!values.length) {
    return "Form submission received.";
  }

  const lines = values.map(
    (entry) => `- ${entry.label}: ${entry.displayValue}`
  );

  return `Complaint form submission received with the following details:\n${lines.join("\n")}`;
}

function buildAttachmentNote(
  attachments: NormalizedAttachment[]
): string | undefined {
  if (!attachments.length) {
    return undefined;
  }

  const noteLines = attachments.map((attachment, index) => {
    const parts: string[] = [];
    if (attachment.mimeType) {
      parts.push(attachment.mimeType);
    }
    if (attachment.url) {
      parts.push(attachment.url);
    } else if (attachment.dataUrl) {
      parts.push("embedded data URI");
    } else if (attachment.base64) {
      parts.push("base64 content provided");
    }
    const suffix = parts.length ? ` (${parts.join(" | ")})` : "";
    const label = attachment.displayName || `Attachment ${index + 1}`;
    return `Attachment: ${label}${suffix}`;
  });

  return noteLines.join("\n");
}

function isVisionCapableModel(modelName?: string): boolean {
  if (!modelName) {
    return false;
  }
  const normalized = modelName.trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  const visionKeywords = [
    "gpt-4o",
    "gpt-4.1",
    "o1",
    "o3",
    "omni",
    "vision",
  ];
  return visionKeywords.some((keyword) => normalized.includes(keyword));
}

const BUSY_AGENT_MESSAGE =
  "All human agents are currently busy. Please wait for the next available agent.";
const OFFLINE_AGENT_MESSAGE =
  "No human agents are currently available. Please try again later.";

function getAgentUnavailableMessage(
  summary: AgentAvailabilitySummary
): string {
  if (summary.online > 0 || summary.busy > 0) {
    return BUSY_AGENT_MESSAGE;
  }
  return OFFLINE_AGENT_MESSAGE;
}

function extractResponseMessageText(message: any): string {
  if (!message) {
    return "";
  }
  const { content } = message as { content?: unknown };
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        if (typeof (item as any)?.text === "string") return (item as any).text;
        return "";
      })
      .join(" ")
      .trim();
  }
  return "";
}

function truncateForLog(value: string | undefined, maxLength = 160): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength)}…`;
}

function summarizeMessagesForLog(
  entries: ResponseMessage[],
  maxEntries = 5
): Array<{ role: string; text?: string; hasImages?: boolean }> {
  return entries.slice(0, maxEntries).map((entry) => {
    const textPreview = truncateForLog(extractResponseMessageText(entry));
    const hasImages = Array.isArray((entry as any)?.content)
      ? (entry as any).content.some(
          (item: unknown) =>
            item && typeof item === "object" && (item as any).type === "input_image"
        )
      : undefined;
    return {
      role: entry.role,
      text: textPreview,
      hasImages,
    };
  });
}

function formatQuoteTimestamp(date?: Date): string {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "unknown-date";
  }
  return date.toISOString().slice(0, 10);
}

function buildQuoteDeveloperPrompt(
  candidates: QuoteCandidate[]
): string | undefined {
  if (!Array.isArray(candidates) || !candidates.length) {
    return undefined;
  }
  const limited = candidates.slice(0, MAX_DEVELOPER_QUOTE_LINES);
  const lines = limited.map((entry) => {
    const snippet = entry.snippet.trim();
    const prefix = `${entry.sender}#${entry.messageId}`;
    const timestamp = formatQuoteTimestamp(entry.createdAt);
    return `${prefix} · ${timestamp} · ${snippet}`;
  });
  return `Quote candidates available for set_reply_reference (newest first):\n${lines.join("\n")}`;
}

function normalizeHistoryTurnFromMessage(message: any): HistoryTurn | undefined {
  if (!message) {
    return undefined;
  }

  const rawContent = (message as any)?.content;
  if (rawContent === undefined || rawContent === null) {
    return undefined;
  }

  const content =
    typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);

  const senderRaw =
    (message as any)?.sender?.type ??
    (message as any)?.sender_type ??
    (message as any)?.sender?.role ??
    (message as any)?.sender_role ??
    (message as any)?.sender?.name ??
    (message as any)?.senderName ??
    undefined;

  const senderLower =
    typeof senderRaw === "string" ? senderRaw.toLowerCase() : undefined;
  const messageType = (message as any)?.message_type;

  let role: HistoryTurn["role"] = "user";
  if (senderLower && senderLower.includes("bot")) {
    role = "assistant";
  } else if (typeof messageType === "string") {
    role = messageType.toLowerCase() === "outgoing" ? "assistant" : "user";
  } else if (typeof messageType === "number") {
    role = messageType === 1 ? "assistant" : "user";
  }

  return { role, content };
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

function extractReferencedMessageId(message: any): number | undefined {
  const attributes = message?.content_attributes;
  if (!attributes || typeof attributes !== "object") {
    return undefined;
  }

  const candidateKeys = [
    "in_reply_to",
    "in_reply_to_id",
    "in_reply_to_message_id",
    "in_reply_to_source_id",
    "reply_to_id",
    "reply_to_message_id",
    "replied_to_message_id",
    "quoted_message",
    "quoted_message_id",
    "referenced_message_id",
    "reference_message_id",
  ];

  for (const key of candidateKeys) {
    const value = (attributes as Record<string, unknown>)[key];
    const direct = parseMessageId(value);
    if (direct !== undefined) {
      return direct;
    }
    if (value && typeof value === "object") {
      const nested =
        parseMessageId((value as Record<string, unknown>).id) ??
        parseMessageId((value as Record<string, unknown>).message_id) ??
        parseMessageId((value as Record<string, unknown>).messageId) ??
        parseMessageId((value as Record<string, unknown>).messageID);
      if (nested !== undefined) {
        return nested;
      }
    }
  }

  for (const value of Object.values(attributes as Record<string, unknown>)) {
    if (value && typeof value === "object") {
      const nested =
        parseMessageId((value as Record<string, unknown>).id) ??
        parseMessageId((value as Record<string, unknown>).message_id) ??
        parseMessageId((value as Record<string, unknown>).messageId) ??
        parseMessageId((value as Record<string, unknown>).messageID);
      if (nested !== undefined) {
        return nested;
      }
    }
  }

  return undefined;
}

async function getReferencedHistoryTurn(
  conversationKey: string,
  messageId: number
): Promise<HistoryTurn | undefined> {
  if (!Number.isFinite(messageId)) {
    return undefined;
  }

  let stored:
    | { sender?: string | null; content?: unknown }
    | undefined;

  try {
    const redisClient = redis as unknown as {
      lrange?: (
        key: string,
        start: number,
        stop: number
      ) => Promise<string[] | null | undefined>;
    };
    if (typeof redisClient?.lrange === "function") {
      const entries = await redisClient.lrange(conversationKey, 0, -1);
      if (Array.isArray(entries)) {
        for (let i = entries.length - 1; i >= 0; i -= 1) {
          const entry = entries[i];
          if (!entry) {
            continue;
          }
          try {
            const parsed = JSON.parse(entry);
            if (Number(parsed?.messageId) === messageId) {
              stored = { sender: parsed?.sender, content: parsed?.content };
              break;
            }
          } catch {
            // ignore malformed entries
          }
        }
      }
    }
  } catch (err) {
    console.error("referenced message redis fetch error", err);
  }

  if (!stored) {
    try {
      const record = await prisma.conversationMessage.findUnique({
        where: { conversationKey_messageId: { conversationKey, messageId } },
      });
      if (record) {
        stored = { sender: record.sender, content: record.content };
      }
    } catch (err) {
      console.error("referenced message prisma fetch error", err);
    }
  }

  if (!stored?.content) {
    return undefined;
  }

  const role = stored.sender === "bot" ? "assistant" : "user";
  const content =
    typeof stored.content === "string"
      ? stored.content
      : JSON.stringify(stored.content);
  return { role, content };
}

function sanitizeWebhookPayload(
  payload: ChatwootWebhookPayload
): ChatwootWebhookPayload {
  try {
    return JSON.parse(JSON.stringify(payload)) as ChatwootWebhookPayload;
  } catch (error) {
    console.error("chatwoot webhook payload sanitize error", error);
    return payload;
  }
}

function extractChatwootJobMetadata(
  incoming: ChatwootWebhookPayload
): { accountId?: number | string; conversationId?: number | string } {
  try {
    const metadataPayload = "data" in incoming ? incoming.data : incoming;
    const metadataMessage = (metadataPayload as any).message ?? metadataPayload;
    const rawConversationId =
      (metadataMessage as any).conversation_id ??
      (metadataMessage as any).conversation?.id ??
      (metadataPayload as any).id;
    const rawAccountId =
      (metadataMessage as any).account_id ??
      (metadataMessage as any).account?.id ??
      (metadataPayload as any).account?.id;
    const conversationId = parseMessageId(rawConversationId) ?? rawConversationId;
    const accountId = parseMessageId(rawAccountId) ?? rawAccountId;
    return { accountId, conversationId };
  } catch {
    return { accountId: undefined, conversationId: undefined };
  }
}

async function processChatwootWebhookJob(
  incoming: ChatwootWebhookPayload,
  options: { jobId?: number | string } = {}
): Promise<NextResponse> {
  const timer = createChatwootJobPhaseTimer(options.jobId);
  let payload: ChatwootWebhookPayload | (ChatwootWebhookPayload & { data?: any }) | undefined;
  let message: any;
  let conversation: Conversation | undefined;
  let conversationId!: number;
  let accountId!: number;
  let inboxId: number | undefined;
  let conversationKey: string | undefined;
  let content: any;
  let messageId: any;
  let sender = "";
  let attachments: NormalizedAttachment[] = [];
  let hasTextContent = false;
  let hasAttachmentContent = false;
  let configuredModelCandidate: string | undefined;
  let providerModelName = MODEL;
  let visionCapableModel = false;
  let attachmentNote: string | undefined;
  let imageOnlyMessage = false;
  let userInput = "";
  let normalizedMessageId: number | undefined;
  let referencedMessageId: number | undefined;
  let imageInsights: GatherImageInsightsResult | undefined;
  let normalizedReferencedReplyToId: number | undefined;
  let normalizedInboundReplyToId: number | undefined;
  let normalizedDefaultReplyToId: number | undefined;
  let referencedTurn: HistoryTurn | undefined;
  let enrichedContent: string | undefined;
  let storedContent = "";
  let fullHistory: ResponseMessage[] | undefined;
  let promptHistory: ResponseMessage[] = [];
  let mode = "auto";
  let defaultReplyOverride: { inReplyTo?: number | null; private?: boolean } | undefined;
  let buildReplyOptions: (
    overrides?: { inReplyTo?: number | null; private?: boolean },
    preferredReplyToId?: number
  ) => { private?: boolean; inReplyTo?: number | undefined };
  let fallbackSent = false;
  let sendFallback: () => Promise<void> = async () => {};
  let logAssistantResponse: (response: unknown, fallbackContent: string) => Promise<void>;
  let isFormSubmission = false;
  let formSubmissionConfirmationSent = false;
  let formSubmissionSummary: string | undefined;
  let formSubmissionPromptAddition: ResponseMessage | undefined;
  let formSubmissionAttributes: Record<string, string> | undefined;
  let normalizedFormSubmissionValues: NormalizedFormSubmissionValue[] = [];
  const logWithMetadata = (label: string, details: Record<string, unknown>) => {
    console.log(label, {
      jobId: options.jobId ?? null,
      accountId,
      conversationId,
      messageId: normalizedMessageId ?? messageId ?? null,
      ...details,
    });
  };
  try {
    const endPayloadNormalization = timer.startPhase("payload-normalization");
    try {
      payload = "data" in incoming ? incoming.data : incoming;
      message = (payload as any).message ?? payload;
      const eventType = incoming.event;
      if (eventType === "message_updated") {
        const contentType =
          pickString((message as any)?.content_type) ??
          pickString((message as any)?.contentType);
        const submittedValues = (message as any)?.content_attributes?.submitted_values;
        if (
          (contentType ?? "").toLowerCase() !== "form" ||
          !Array.isArray(submittedValues)
        ) {
          return NextResponse.json({ status: "ignored" });
        }
        normalizedFormSubmissionValues = normalizeFormSubmittedValues(submittedValues);
        if (!normalizedFormSubmissionValues.length) {
          return NextResponse.json({ status: "ignored" });
        }
        isFormSubmission = true;
        formSubmissionSummary = buildFormSubmissionSummary(normalizedFormSubmissionValues);
        formSubmissionAttributes = Object.fromEntries(
          normalizedFormSubmissionValues.map((entry) => [entry.name, entry.value])
        );
        formSubmissionPromptAddition = toResponseMessage(
          "system",
          buildFormSubmissionDetailText(normalizedFormSubmissionValues)
        );
        (message as any).content = formSubmissionSummary;
      } else if (eventType !== "message_created") {
        return NextResponse.json({ status: "ignored" });
      }
      const parsedConversationId =
        parseMessageId((message as any).conversation_id) ??
        parseMessageId((message as any).conversation?.id) ??
        parseMessageId((payload as any).id);
      const parsedAccountId =
        parseMessageId((message as any).account_id) ??
        parseMessageId((message as any).account?.id) ??
        parseMessageId((payload as any).account?.id);
      if (parsedConversationId === undefined || parsedAccountId === undefined) {
        console.warn("chatwoot webhook missing ids", {
          accountId: parsedAccountId,
          conversationId: parsedConversationId,
        });
        return NextResponse.json({ status: "ignored" });
      }
      conversationId = parsedConversationId;
      accountId = parsedAccountId;
      conversation =
        (message as any)?.conversation ??
        (payload as any).conversation ??
        (incoming.event.startsWith("conversation_") ? (payload as any) : undefined);
      inboxId =
        parseMessageId((message as any).inbox_id) ??
        parseMessageId(conversation?.inbox_id);
      conversationKey = getConversationKey(accountId, conversationId, inboxId);
      content = message.content;
      messageId = message.id;
      sender =
        (message as any)?.sender?.type ??
        (message as any)?.sender_type ??
        (message as any)?.sender?.name ??
        "";

      if (isFormSubmission && typeof message?.content !== "string") {
        message.content = formSubmissionSummary ?? "";
      }

      attachments = extractMessageAttachments(message);
      hasTextContent =
        typeof content === "string"
          ? content.trim().length > 0
          : content !== undefined && content !== null;
      hasAttachmentContent = attachments.length > 0;

      if (isFormSubmission && !hasTextContent && formSubmissionSummary) {
        content = formSubmissionSummary;
        hasTextContent = true;
        userInput = formSubmissionSummary;
      }

      configuredModelCandidate =
        typeof process.env.CHATWOOT_WEBHOOK_MODEL === "string"
          ? process.env.CHATWOOT_WEBHOOK_MODEL
          : typeof process.env.OPENAI_MODEL === "string"
            ? process.env.OPENAI_MODEL
            : undefined;
      providerModelName =
        configuredModelCandidate && configuredModelCandidate.trim()
          ? configuredModelCandidate.trim()
          : MODEL;
      visionCapableModel = isVisionCapableModel(providerModelName);
      attachmentNote = buildAttachmentNote(attachments);
      imageOnlyMessage =
        !hasTextContent &&
        hasAttachmentContent &&
        attachments.every((attachment) => attachment.isImage);

      if (typeof content === "string") {
        userInput = content;
      } else if (content && typeof content === "object") {
        userInput = JSON.stringify(content);
      } else if (content !== undefined && content !== null) {
        userInput = String(content);
      } else {
        userInput = "";
      }

      normalizedMessageId = parseMessageId(messageId);
      if (typeof normalizedMessageId === "number" && Number.isFinite(normalizedMessageId)) {
        messageId = normalizedMessageId;
      }

      if (
        isFormSubmission &&
        typeof conversationKey === "string" &&
        typeof normalizedMessageId === "number" &&
        Number.isFinite(normalizedMessageId)
      ) {
        try {
          const existingFormMessage = await prisma.conversationMessage.findUnique({
            where: {
              conversationKey_messageId: {
                conversationKey,
                messageId: normalizedMessageId,
              },
            },
          });
          if (existingFormMessage?.content === formSubmissionSummary) {
            return NextResponse.json({ status: "ignored" });
          }
        } catch (err) {
          console.error("chatwoot form submission dedupe error", err);
        }
      }

      if (
        isFormSubmission &&
        formSubmissionAttributes &&
        accountId !== undefined &&
        conversationId !== undefined
      ) {
        const existingAttributes =
          conversation &&
          typeof conversation === "object" &&
          conversation !== null &&
          typeof (conversation as any).custom_attributes === "object" &&
          (conversation as any).custom_attributes !== null
            ? ((conversation as any).custom_attributes as Record<string, unknown>)
            : {};
        const mergedAttributes: Record<string, unknown> = {
          ...existingAttributes,
          ...formSubmissionAttributes,
        };
        try {
          await updateConversationCustomAttributes(
            accountId,
            conversationId,
            mergedAttributes
          );
          if (conversation) {
            (conversation as any).custom_attributes = mergedAttributes;
          } else {
            conversation = { id: conversationId, custom_attributes: mergedAttributes } as Conversation;
          }
          try {
            if (!formSubmissionConfirmationSent) {
              await sendBotMessage(
                accountId,
                conversationId,
                COMPLAINT_FORM_SUBMISSION_CONFIRMATION_TEXT
              );
              formSubmissionConfirmationSent = true;
            }
          } catch (err) {
            console.error("chatwoot send complaint confirmation error", err);
          }
          try {
            const existingLabelsResponse = await getConversationLabels(
              accountId,
              conversationId
            );
            const existingLabels = Array.isArray(
              (existingLabelsResponse as any)?.payload
            )
              ? (existingLabelsResponse as any).payload.filter(
                  (label: unknown): label is string =>
                    typeof label === "string" && label.trim().length > 0
                )
              : [];
            const mergedLabels = Array.from(
              new Set([...existingLabels, CONVO_LABELS.complaint])
            );
            await setConversationLabels(accountId, conversationId, mergedLabels);
          } catch (err) {
            console.error("chatwoot complaint label update error", err);
          }
        } catch (err) {
          console.error("chatwoot update conversation attributes error", err);
        }
      }
    } finally {
      endPayloadNormalization();
    }

  const endAttachmentInsight = timer.startPhase("attachment-insight");
    try {
      if (attachments.some((attachment) => attachment.isImage)) {
        try {
          const kbProvider =
            process.env.CHATWOOT_IMAGE_SEARCH_PROVIDER?.trim() ||
            process.env.CHATWOOT_WEBHOOK_PROVIDER?.trim();
          const kbLimitRaw = process.env.CHATWOOT_IMAGE_KB_LIMIT?.trim();
          const kbLimit = kbLimitRaw ? Number(kbLimitRaw) : undefined;
          const imageModel = process.env.CHATWOOT_IMAGE_MODEL?.trim();
          const imageAttachments = attachments.filter((attachment) => attachment.isImage);
          imageInsights = await gatherImageInsights({
            attachments: imageAttachments,
            userText: userInput,
            knowledgeBaseProvider: kbProvider,
            maxKnowledgeBaseResults: Number.isFinite(kbLimit) ? kbLimit : undefined,
            imageModel,
            imageOnly: imageOnlyMessage,
          });
          const imageAttachmentCount = imageAttachments.length;
          logWithMetadata(
            "chatwoot image insight result",
            {
              hasInsights: Boolean(imageInsights),
              description: truncateForLog(imageInsights?.description),
              queries: Array.isArray(imageInsights?.queries)
                ? imageInsights.queries.slice(0, 6).map((entry) => truncateForLog(entry, 80))
                : undefined,
              hasUserSupplement: Boolean(imageInsights?.userPromptSupplement),
              hasDeveloperNote: Boolean(imageInsights?.developerNote),
              insightStatus: imageInsights ? "ok" : "missing",
              imageAttachmentCount,
              imageOnlyMessage,
              followUpCount: imageInsights?.followUpQuestions?.length ?? 0,
            }
          );
          if (!imageInsights) {
            logWithMetadata(
              "chatwoot image insight missing",
              {
                reason: "no_insight_payload",
                imageAttachmentCount,
                imageOnlyMessage,
              }
            );
          }
          if (imageInsights?.description && !userInput.trim()) {
            userInput = imageInsights.description;
          }
          if (imageInsights?.queries?.length) {
            logWithMetadata(
              "chatwoot image insight queries",
              {
                queries: imageInsights.queries
                  .slice(0, 6)
                  .map((entry) => truncateForLog(entry, 80)),
              }
            );
          }
        } catch (err) {
          console.error("image insights pipeline error", err);
        }
      }
    } finally {
      endAttachmentInsight();
    }
    const jobResultPromise = (async () => {
      const endHistoryRetrieval = timer.startPhase("history-retrieval");
      try {
        referencedMessageId = extractReferencedMessageId(message);
        normalizedReferencedReplyToId =
          typeof referencedMessageId === "number" &&
          Number.isFinite(referencedMessageId)
            ? referencedMessageId
            : undefined;
        normalizedInboundReplyToId =
          typeof normalizedMessageId === "number" &&
          Number.isFinite(normalizedMessageId)
            ? normalizedMessageId
            : undefined;
        normalizedDefaultReplyToId =
          normalizedReferencedReplyToId ?? normalizedInboundReplyToId;
  
        if (
          accountId !== undefined &&
          conversationId !== undefined &&
          typeof referencedMessageId === "number" &&
          referencedMessageId !== normalizedMessageId
        ) {
          referencedTurn = await getReferencedHistoryTurn(
            conversationKey,
            referencedMessageId
          );
          if (!referencedTurn) {
            try {
              const remoteMessagesResponse = await getConversationMessages(
                accountId,
                conversationId
              );
              const candidateLists = [
                (remoteMessagesResponse as any)?.payload,
                (remoteMessagesResponse as any)?.data,
                remoteMessagesResponse,
              ];
              let remoteMessages: any[] = [];
              for (const candidate of candidateLists) {
                if (Array.isArray(candidate)) {
                  remoteMessages = candidate;
                  break;
                }
              }
              const referencedMessage = remoteMessages.find((m: any) => {
                const id = parseMessageId(m?.id);
                const sourceId = parseMessageId((m as any)?.source_id);
                const idString =
                  typeof (m as any)?.id === "string" ? (m as any).id.trim() : undefined;
                const sourceIdString =
                  typeof (m as any)?.source_id === "string"
                    ? (m as any).source_id.trim()
                    : undefined;
                const referencedMessageIdString = String(referencedMessageId);
                return (
                  (typeof id === "number" && id === referencedMessageId) ||
                  (typeof sourceId === "number" && sourceId === referencedMessageId) ||
                  (idString !== undefined && idString === referencedMessageIdString) ||
                  (sourceIdString !== undefined &&
                    sourceIdString === referencedMessageIdString)
                );
              });
              referencedTurn = normalizeHistoryTurnFromMessage(referencedMessage);
            } catch (err) {
              console.error("referenced message remote fetch error", err);
            }
          }
          if (!referencedTurn) {
            console.warn("referenced message not found", {
              accountId,
              conversationId,
              referencedMessageId,
            });
          }
        }
  
        enrichedContent = referencedTurn
          ? `Customer referenced: "${referencedTurn.content}"\n\n${userInput}`
          : undefined;
  
        if (attachmentNote) {
          userInput = userInput ? `${userInput}\n\n${attachmentNote}` : attachmentNote;
          if (enrichedContent) {
            enrichedContent = `${enrichedContent}\n\n${attachmentNote}`;
          }
          logWithMetadata(
            "chatwoot enrichment attachment_note",
            {
              attachmentPreview: truncateForLog(attachmentNote),
              enrichedPreview: truncateForLog(enrichedContent ?? userInput),
            }
          );
        }

        if (imageInsights?.userPromptSupplement) {
          const supplement = imageInsights.userPromptSupplement;
          if (enrichedContent) {
            if (!enrichedContent.includes(supplement)) {
              enrichedContent = `${enrichedContent}\n\n${supplement}`;
            }
          } else {
            enrichedContent = userInput
              ? `${userInput}\n\n${supplement}`
              : supplement;
          }
          logWithMetadata(
            "chatwoot enrichment supplement",
            {
              supplementPreview: truncateForLog(supplement),
              enrichedPreview: truncateForLog(enrichedContent ?? userInput),
            }
          );
        }

        if (imageInsights?.followUpQuestions?.length) {
          const followUpBlock = [
            "Suggested follow-up questions:",
            ...imageInsights.followUpQuestions
              .slice(0, 3)
              .map((question, index) => `${index + 1}. ${question}`),
          ].join("\n");

          if (enrichedContent) {
            if (!enrichedContent.includes(followUpBlock)) {
              enrichedContent = `${enrichedContent}\n\n${followUpBlock}`;
            }
          } else {
            enrichedContent = userInput
              ? `${userInput}\n\n${followUpBlock}`
              : followUpBlock;
          }

          logWithMetadata("chatwoot enrichment follow_ups", {
            followUpPreview: truncateForLog(followUpBlock),
            enrichedPreview: truncateForLog(enrichedContent ?? userInput),
          });
        }

        storedContent = enrichedContent ?? userInput;
        logWithMetadata(
          "chatwoot enrichment stored_content",
          {
            source: enrichedContent ? "enriched" : "user_input",
            storedPreview: truncateForLog(storedContent),
          }
        );
  
        if (
          messageId !== undefined &&
          conversationId !== undefined &&
          inboxId !== undefined
        ) {
          try {
            const createdAtRaw = (message as any)?.created_at;
            const createdAt = createdAtRaw
              ? new Date(
                  typeof createdAtRaw === "number"
                    ? createdAtRaw * 1000
                    : createdAtRaw
                )
              : undefined;
            await prisma.conversationMessage.upsert({
              where: {
                conversationKey_messageId: {
                  conversationKey,
                  messageId,
                },
              },
              update: {},
              create: {
                messageId,
                conversationId,
                inboxId,
                conversationKey,
                sender,
                content: storedContent,
                createdAt,
              },
            });
            try {
                if (
                  typeof (redis as any)?.exists === "function" &&
                  typeof (redis as any)?.rpush === "function" &&
                  typeof (redis as any)?.pipeline === "function"
                ) {
                  const key = conversationKey;
                  const keyExists = await redis.exists(key);
                  if (!keyExists) {
                    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    const recent = await prisma.conversationMessage.findMany({
                      where: {
                        conversationKey,
                        createdAt: { gte: since },
                      },
                      orderBy: { messageId: "asc" },
                    });
                    if (recent.length) {
                      const pipeline = redis.pipeline();
                      for (const m of recent) {
                        pipeline.rpush(key, JSON.stringify(m));
                      }
                      pipeline.expire(key, 86400);
                      await pipeline.exec();
                    }
                  } else {
                    const pipeline = redis.pipeline();
                    pipeline.rpush(
                      key,
                      JSON.stringify({
                        messageId,
                        conversationId,
                        inboxId,
                        conversationKey,
                        sender,
                        content: storedContent,
                        createdAt,
                      })
                    );
                    pipeline.expire(key, 86400);
                    await pipeline.exec();
                  }
                }
              } catch (err) {
                console.error("conversation redis log error", err);
              }
            } catch (err) {
              console.error("conversation message log error", err);
            }
          }
        if (
          message.message_type === 2 &&
          typeof content === "string" &&
          (content.startsWith("Conversation was marked resolved") ||
            content.startsWith("Conversation was marked as pending"))
        ) {
          console.info("resolution message", { messageId, conversationId, content });
          let labels = Array.isArray((conversation as any)?.label_list)
            ? (conversation as any).label_list
            : undefined;
          if (!Array.isArray(labels)) {
            try {
              const current = await getConversationLabels(accountId, conversationId);
              labels = Array.isArray((current as any)?.payload)
                ? (current as any).payload
                : undefined;
            } catch (err) {
              console.error("resolution labels fetch error", err);
            }
          }
          const hasAssigned =
            Array.isArray(labels) && labels.includes(CONVO_LABELS.assigned);
          if (!hasAssigned) {
            console.info("resolution message skipping release", {
              conversationId,
              labels,
            });
            return NextResponse.json({ status: "handled" });
          }
          try {
            await releaseAgent(accountId, conversationId, conversation);
            clearReleaseAttempts(conversationId);
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Agent release failed";
            const { shouldRetry } = await recordReleaseFailure(
              conversationId,
              err
            );
            if (shouldRetry) {
              return NextResponse.json({ error: message }, { status: 500 });
            }
            return NextResponse.json(
              { status: "unreleased", error: message },
              { status: 200 }
            );
          }
          return NextResponse.json({ status: "handled" });
        }
        if (
          message?.message_type !== 0 &&
          message?.message_type !== "incoming"
        ) {
          return NextResponse.json({ status: "ignored" });
        }
        console.info("handoff", { accountId, conversationId, inboxId, content });
        if (
          inboxId === undefined ||
          (!hasTextContent && !hasAttachmentContent)
        ) {
          console.error("chatwoot webhook missing ids", {
            accountId,
            conversationId,
            inboxId,
            hasContent: hasTextContent,
            hasAttachments: hasAttachmentContent,
          });
          return NextResponse.json({ status: "ignored" });
        }
  
        mode = INBOX_MODE[inboxId] ?? "auto";

        defaultReplyOverride =
          normalizedDefaultReplyToId !== undefined
            ? { inReplyTo: normalizedDefaultReplyToId }
            : undefined;

        buildReplyOptions = (
          overrides?: { inReplyTo?: number | null; private?: boolean },
          preferredReplyToId: number | undefined = normalizedReferencedReplyToId
        ) => {
          const options: { private?: boolean; inReplyTo?: number } = {};
  
          const fallbackInReplyToId =
            typeof preferredReplyToId === "number" &&
            Number.isFinite(preferredReplyToId)
              ? preferredReplyToId
              : normalizedInboundReplyToId;
  
          const hasOverrides = overrides !== undefined;
          const hasPrivateProp =
            hasOverrides &&
            Object.prototype.hasOwnProperty.call(
              overrides as Record<string, unknown>,
              "private"
            );
          const privateOverride =
            hasPrivateProp && typeof overrides?.private === "boolean"
              ? overrides.private
              : undefined;
          options.private =
            privateOverride !== undefined ? privateOverride : mode !== "auto";
  
          const hasInReplyProp =
            hasOverrides &&
            Object.prototype.hasOwnProperty.call(
              overrides as Record<string, unknown>,
              "inReplyTo"
            );
          const overrideInReply = overrides?.inReplyTo;
  
          if (hasInReplyProp) {
            if (overrideInReply === null) {
              return options;
            }
  
            if (
              typeof overrideInReply === "number" &&
              Number.isFinite(overrideInReply)
            ) {
              options.inReplyTo = overrideInReply;
              return options;
            }
  
            if (
              overrideInReply === undefined &&
              fallbackInReplyToId !== undefined
            ) {
              options.inReplyTo = fallbackInReplyToId;
              return options;
            }
          }
  
          if (
            hasOverrides &&
            !hasInReplyProp &&
            fallbackInReplyToId !== undefined
          ) {
            options.inReplyTo = fallbackInReplyToId;
          } else if (!hasOverrides && fallbackInReplyToId !== undefined) {
            options.inReplyTo = fallbackInReplyToId;
          }
  
          return options;
        };
  
        logAssistantResponse = async (
          response: unknown,
          fallbackContent: string
        ) => {
          const defaultInboxId =
            typeof inboxId === "number" && Number.isFinite(inboxId)
              ? inboxId
              : undefined;

          await storeBotMessage({
            accountId,
            conversationId,
            payload: response,
            fallbackContent,
            conversationKey: conversationKey ?? undefined,
            defaultInboxId,
          });
        };
  
        // Reuse conversation data from the payload when possible.
        // Only fetch from Chatwoot if we are missing critical fields like `status`.
        let status = conversation?.status;
        if (!status) {
          try {
            const convo = await getConversation(accountId, conversationId);
            status = convo?.status;
          } catch (err) {
            console.error("fetch conversation error", err);
            try {
              // Retry once more before falling back
              const retry = await getConversation(accountId, conversationId);
              status = retry?.status;
            } catch (retryErr) {
              console.error("retry fetch conversation error", retryErr);
              await notifyMessageIssue(
                accountId,
                conversationId,
                buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
              );
              return NextResponse.json(
                { status: "conversation_fetch_failed" },
                { status: 200 }
              );
            }
          }
        }
  
        if (status === "open") {
          return NextResponse.json({ status: "ignored" });
        }
  
        if (status !== "pending" && status !== "resolved") {
          return NextResponse.json({ status: "ignored" });
        }
  
        const existingRequest = await prisma.handoffRequest.findUnique({
          where: { conversationKey },
        });
        if (
          handoffStrategy.value === "confirm" &&
          existingRequest?.status === "awaiting_confirmation"
        ) {
          const confirmPattern = /\b(yes|y|sure|confirm|ok)\b/i;
          if (confirmPattern.test(content)) {
            try {
                const { agent } = await getNextAgent(accountId);
                if (agent) {
                  const role =
                    agent.role === "administrator" ? "administrator" : "agent";
                  const success = await handOff(
                    accountId,
                    conversationId,
                    agent.id,
                    role
                  );
                  if (!success) {
                    return NextResponse.json({ status: "handoff_failed" });
                  }
                  await setActiveConversation(
                    agent.id,
                    conversationId,
                    agent.availability_status
                  );
                  console.info("handoff", "active set", agent.id);
                console.info("handoff", {
                  step: "update-request",
                  conversationId,
                  agentId: agent.id,
                });
                try {
                  await updateRequest(conversationKey, {
                    status: "assigned",
                    agentId: agent.id,
                  });
                  console.info("handoff", "request updated");
                } catch (err) {
                  console.error("updateRequest error", err);
                  try {
                    await notifyHandoffIssue(
                      accountId,
                      conversationId,
                      buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
                    );
                  } catch (err2) {
                    console.error("fallback notifyHandoffIssue error", err2);
                  }
                  return NextResponse.json({ status: "fallback" });
                }
                console.info("handoff", {
                  step: "send-message",
                  accountId,
                  conversationId,
                });
                const botResponse = await sendBotMessage(
                  accountId,
                  conversationId,
                  "A human agent will join shortly.",
                  buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
                );
                await logAssistantResponse(
                  botResponse,
                  "A human agent will join shortly."
                );
                console.info("handoff", "message sent");
                  const labels = await mergeStatusLabelForConversation({
                    accountId,
                    conversationId,
                    conversation,
                    statusLabel: CONVO_LABELS.assigned,
                    logContext: "confirmation-assigned",
                  });
                  console.info("handoff", {
                    step: "set-labels",
                    accountId,
                    conversationId,
                  });
                  try {
                    await setConversationLabels(accountId, conversationId, labels);
                    console.info("handoff", "labels set", labels);
                  } catch (err) {
                    console.error("handoff set labels error", err);
                  }
                  return NextResponse.json({ status: "handoff_confirmed" });
                }
              } catch (err) {
                console.error("handoff confirmation error", err);
              }
          } else {
            console.info("handoff", { step: "update-request", conversationId });
            try {
              await updateRequest(conversationKey, {
                status: "expired",
                agentId: null,
              });
              console.info("handoff", "request updated");
            } catch (err) {
              console.error("updateRequest error", err);
              try {
                await notifyHandoffIssue(
                  accountId,
                  conversationId,
                  buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
                );
              } catch (err2) {
                console.error("fallback notifyHandoffIssue error", err2);
              }
              return NextResponse.json({ status: "fallback" });
            }
            const labels = await mergeStatusLabelForConversation({
              accountId,
              conversationId,
              conversation,
              statusLabel: CONVO_LABELS.expired,
              logContext: "confirmation-expired",
            });
            console.info("handoff", { step: "set-labels", accountId, conversationId });
            try {
              await setConversationLabels(accountId, conversationId, labels);
              console.info("handoff", "labels set", labels);
            } catch (err) {
              console.error("handoff set labels error", err);
            }
          }
        }
  
        const triggerPattern = /\b(human|agent|representative)\b/i;
        if (triggerPattern.test(content)) {
          console.info("handoff", {
            step: "get-conversation",
            accountId,
            conversationId,
          });
          // Prefer conversation details from the webhook payload
          let currentConversation = conversation;
          if (!currentConversation || !currentConversation.id) {
            try {
              currentConversation = await getConversation(accountId, conversationId);
              console.info("handoff", "conversation fetched", currentConversation);
            } catch (err) {
              console.error("handoff", "conversation fetch error", err);
              await notifyMessageIssue(
                accountId,
                conversationId,
                buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
              );
              return NextResponse.json(
                { status: "conversation_fetch_failed" },
                { status: 200 }
              );
            }
          }
          if (!currentConversation) {
            console.error("handoff", "conversation not found");
            return NextResponse.json(
              { error: "Conversation not found" },
              { status: 404 }
            );
          }
  
          try {
            const { agent, availabilitySummary } = await getNextAgent(accountId);
            if (agent) {
              console.info("handoff", {
                step: "enqueue",
                conversationId,
                agentId: agent.id,
              });
              try {
                if (typeof inboxId !== "number") {
                  throw new Error("Missing inboxId for handoff request");
                }
                await enqueueRequest(
                  accountId,
                  conversationId,
                  "assigned",
                  agent.id,
                  inboxId
                );
                console.info("handoff", "request enqueued", agent.id);
              } catch (err) {
                console.error("enqueueRequest error", err);
                try {
                  await notifyHandoffIssue(
                    accountId,
                    conversationId,
                    buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
                  );
                } catch (err2) {
                  console.error("fallback notifyHandoffIssue error", err2);
                }
                return NextResponse.json({ status: "fallback" });
              }
                const role =
                  agent.role === "administrator" ? "administrator" : "agent";
                const success = await handOff(
                  accountId,
                  conversationId,
                  agent.id,
                  role
                );
                if (!success) {
                  try {
                    await updateRequest(conversationKey, {
                      status: "pending",
                      agentId: null,
                    });
                  } catch (err) {
                    console.error("updateRequest error", err);
                    try {
                      await notifyHandoffIssue(
                        accountId,
                        conversationId,
                        buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
                      );
                    } catch (err2) {
                      console.error("fallback notifyHandoffIssue error", err2);
                    }
                    return NextResponse.json({ status: "fallback" });
                  }
                  return NextResponse.json({ status: "handoff_failed" });
                }
                await setActiveConversation(
                  agent.id,
                  conversationId,
                  agent.availability_status
                );
                console.info("handoff", "active set", agent.id);
              console.info("handoff", {
                step: "send-message",
                accountId,
                conversationId,
              });
              const confirmationResponse = await sendBotMessage(
                accountId,
                conversationId,
                "A human agent will join shortly.",
                buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
              );
              await logAssistantResponse(
                confirmationResponse,
                "A human agent will join shortly."
              );
              console.info("handoff", "message sent");
                const labels = await mergeStatusLabelForConversation({
                  accountId,
                  conversationId,
                  conversation: currentConversation,
                  statusLabel: CONVO_LABELS.assigned,
                  logContext: "immediate-assigned",
                });
                console.info("handoff", {
                  step: "set-labels",
                  accountId,
                  conversationId,
                });
                try {
                  await setConversationLabels(accountId, conversationId, labels);
                  console.info("handoff", "labels set", labels);
                } catch (err) {
                  console.error("handoff set labels error", err);
                }
            } else {
              const summary = availabilitySummary ?? {
                online: 0,
                busy: 0,
                offline: 0,
              };
              const activeAgentCount = (summary.online ?? 0) + (summary.busy ?? 0);
              const unavailableMessage = getAgentUnavailableMessage(summary);

              if (activeAgentCount === 0) {
                console.info("handoff", {
                  step: "send-offline-message",
                  accountId,
                  conversationId,
                });
                const botResponse = await sendBotMessage(
                  accountId,
                  conversationId,
                  unavailableMessage,
                  buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
                );
                await logAssistantResponse(botResponse, unavailableMessage);
                console.info("handoff", "offline message sent");
              } else {
                console.info("handoff", { step: "enqueue", conversationId });
                let queueUpdates: QueuePositionUpdate[] = [];
                try {
                  if (typeof inboxId !== "number") {
                    throw new Error("Missing inboxId for handoff request");
                  }
                  await enqueueRequest(
                    accountId,
                    conversationId,
                    undefined,
                    undefined,
                    inboxId
                  );
                  console.info("handoff", "request enqueued");
                } catch (err) {
                  console.error("enqueueRequest error", err);
                  try {
                    await notifyHandoffIssue(
                      accountId,
                      conversationId,
                      buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
                    );
                  } catch (err2) {
                    console.error("fallback notifyHandoffIssue error", err2);
                  }
                  return NextResponse.json({ status: "fallback" });
                }
                try {
                  queueUpdates = await updateQueuePositions({ accountId });
                } catch (err) {
                  console.error("updateQueuePositions error", err);
                }
                  const labels = await mergeStatusLabelForConversation({
                    accountId,
                    conversationId,
                    conversation: currentConversation,
                    statusLabel: CONVO_LABELS.waiting,
                    logContext: "queue-waiting",
                  });
                  console.info("handoff", {
                    step: "set-labels",
                    accountId,
                    conversationId,
                  });
                  try {
                    await setConversationLabels(accountId, conversationId, labels);
                    console.info("handoff", "labels set", labels);
                  } catch (err) {
                    console.error("handoff set labels error", err);
                  }
                  console.info("handoff", {
                    step: "send-message",
                    accountId,
                    conversationId,
                  });
                let queueMessage = unavailableMessage;
                const pendingUpdate = queueUpdates.find(
                  (update) => update.conversationId === conversationId
                );
                if (pendingUpdate) {
                  queueMessage = formatQueuePositionMessage(
                    unavailableMessage,
                    pendingUpdate.position
                  );
                }
                const botResponse = await sendBotMessage(
                  accountId,
                  conversationId,
                  queueMessage,
                  buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
                );
                await logAssistantResponse(botResponse, queueMessage);
                console.info("handoff", "message sent");
              }
            }
          } catch (err) {
            console.error("agent escalation error", err);
          }
          return NextResponse.json({ status: "handoff" });
        }
  
        fallbackSent = false;
        sendFallback = async () => {
          if (fallbackSent) return;
          fallbackSent = true;
          try {
            await notifyMessageIssue(
              accountId,
              conversationId,
              buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
            );
          } catch (err) {
            console.error("fallback notifyMessageIssue error", err);
          }
        };
  
        fullHistory = [];
        try {
          fullHistory = await getConversationHistory(
            conversationKey,
            SYNOPSIS_HISTORY_LIMIT
          );
        } catch (err) {
          console.error("conversation history error", err);
          await sendFallback();
          return NextResponse.json({ status: "fallback" });
        }
  
        if (enrichedContent && Array.isArray(fullHistory)) {
          let updatedHistory = [...fullHistory];
          const hasEnrichedTurn = updatedHistory.some(
            (turn: any) =>
              turn?.role === "user" &&
              Array.isArray(turn?.content) &&
              turn.content.some((c: any) => c?.text === enrichedContent)
          );
          if (!hasEnrichedTurn) {
            let replaced = false;
            for (let i = updatedHistory.length - 1; i >= 0; i -= 1) {
              const turn = updatedHistory[i];
              if (
                turn?.role === "user" &&
                Array.isArray(turn?.content) &&
                turn.content.some((c: any) => c?.text === userInput)
              ) {
                updatedHistory[i] = toResponseMessage("user", enrichedContent);
                replaced = true;
                break;
              }
            }
            if (!replaced) {
              updatedHistory = [
                ...updatedHistory,
                toResponseMessage("user", enrichedContent),
              ];
            }
          }
          fullHistory = updatedHistory as ResponseMessage[];
        }

        if (isFormSubmission && formSubmissionSummary && Array.isArray(fullHistory)) {
          const hasSummaryInHistory = fullHistory.some(
            (entry) =>
              entry?.role === "user" &&
              extractResponseMessageText(entry) === formSubmissionSummary
          );
          if (!hasSummaryInHistory) {
            fullHistory = [
              ...fullHistory,
              toResponseMessage("user", formSubmissionSummary),
            ];
          }
        }

        promptHistory = Array.isArray(fullHistory)
          ? fullHistory.slice(-PROMPT_HISTORY_LIMIT)
          : [];

        if (isFormSubmission && formSubmissionSummary) {
          const hasSummaryEntry = promptHistory.some(
            (entry) =>
              entry?.role === "user" &&
              extractResponseMessageText(entry) === formSubmissionSummary
          );
          if (!hasSummaryEntry) {
            promptHistory = [
              ...promptHistory,
              toResponseMessage("user", formSubmissionSummary),
            ];
          }
        }

        if (formSubmissionPromptAddition) {
          promptHistory = [...promptHistory, formSubmissionPromptAddition];
        }

        if (promptHistory.length > PROMPT_HISTORY_LIMIT) {
          promptHistory = promptHistory.slice(-PROMPT_HISTORY_LIMIT);
        }

        if (visionCapableModel && attachments.length) {
          let targetIndex = -1;
          for (let i = promptHistory.length - 1; i >= 0; i -= 1) {
            if (promptHistory[i]?.role === "user") {
              targetIndex = i;
              break;
            }
          }
          if (targetIndex === -1) {
            promptHistory = [
              ...promptHistory,
              toResponseMessage("user", enrichedContent ?? userInput ?? ""),
            ];
            targetIndex = promptHistory.length - 1;
          }
          if (targetIndex >= 0) {
            const target = promptHistory[targetIndex];
            const additions: ResponseContentItem[] = [];
            for (const attachment of attachments) {
              if (!attachment.isImage) {
                continue;
              }
  
              let resource = attachment.dataUrl ?? attachment.url;
  
              if (
                visionCapableModel &&
                !attachment.dataUrl &&
                attachment.url &&
                attachment.fetchedDataUrl === undefined
              ) {
                attachment.fetchedDataUrl =
                  (await fetchAttachmentImage(attachment.url, attachment.mimeType)) ??
                  null;
              }
  
              if (attachment.fetchedDataUrl) {
                resource = attachment.fetchedDataUrl;
              }
  
              if (!resource) {
                continue;
              }
              additions.push({
                type: "input_image",
                image_url: resource,
                detail: "auto",
              });
            }
            if (additions.length) {
              const existing = Array.isArray(target.content)
                ? target.content
                : [];
              target.content = [...existing, ...additions];
            }
          }
        }
      } finally {
        endHistoryRetrieval();
      }

      const endGuardrailEvaluation = timer.startPhase("guardrail-evaluation");
      try {
        try {
          const guardrailUserInput = enrichedContent ?? userInput;
          const developerEntriesForLog = promptHistory
            .filter((entry) => entry.role === "developer")
            .slice(0, 3);
          const recentHistoryEntriesForLog = promptHistory
            .filter((entry) => entry.role !== "developer")
            .slice(-3);
          logWithMetadata(
            "chatwoot guardrail context",
            {
              guardrailUserInput: truncateForLog(guardrailUserInput),
              developerEntries: summarizeMessagesForLog(
                developerEntriesForLog,
                developerEntriesForLog.length
              ),
              recentHistory: summarizeMessagesForLog(
                recentHistoryEntriesForLog,
                recentHistoryEntriesForLog.length
              ),
            }
          );
          let relevancePromise:
            | Promise<{
                tripwireTriggered: boolean;
                outputInfo?: unknown;
              }>
            | undefined;
          if (imageOnlyMessage) {
            console.log(
              "Skipping relevance guardrail for image-only attachment message",
              {
                accountId,
                conversationId,
                messageId: normalizedMessageId ?? messageId ?? null,
                attachmentCount: attachments.length,
              }
            );
            relevancePromise = Promise.resolve({
              tripwireTriggered: false,
              outputInfo: { skipped: "image-only-attachments" },
            });
          } else {
            const baseHistoryTurns: HistoryTurn[] = promptHistory
              .filter((m: { role: string }) => m.role !== "developer")
              .map((m: ResponseMessage) => ({
                role: m.role,
                content: extractResponseMessageText(m),
              }));
            const historyTurns = referencedTurn
              ? [referencedTurn, ...baseHistoryTurns]
              : baseHistoryTurns;
            let recentTurns = historyTurns.slice(-6);
            if (referencedTurn) {
              const { role: referencedRole, content: referencedContent } = referencedTurn;
              const hasReferencedTurn = recentTurns.some(
                (turn) =>
                  turn.role === referencedRole && turn.content === referencedContent
              );
              if (!hasReferencedTurn) {
                recentTurns =
                  recentTurns.length >= 6
                    ? [...recentTurns.slice(1), referencedTurn]
                    : [...recentTurns, referencedTurn];
              }
            }
            const relevanceInput = JSON.stringify([
              ...recentTurns,
              { role: "user", content: guardrailUserInput },
            ]);
            relevancePromise = runRelevanceGuardrail({
              input: relevanceInput,
            });
          }

          const [relevance, jailbreak] = await Promise.all([
            relevancePromise ??
              Promise.resolve<{
                tripwireTriggered: boolean;
                outputInfo?: unknown;
              }>({ tripwireTriggered: false }),
            runJailbreakGuardrail({ input: guardrailUserInput }),
          ]);
  
          if (jailbreak.tripwireTriggered) {
            console.log("Guardrail triggered via Chatwoot: jailbreak", {
              guardrailUserInput,
              jailbreakOutput: jailbreak.outputInfo,
              relevanceOutput: relevance?.outputInfo,
              relevanceSkipped: imageOnlyMessage,
            });
            const guardrailResponse = await sendBotMessage(
              accountId,
              conversationId,
              RELEVANCE_REJECTION_MESSAGE,
              buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
            );
            await logAssistantResponse(guardrailResponse, RELEVANCE_REJECTION_MESSAGE);
            return NextResponse.json({ status: "guardrail" });
          }
  
          if (relevance?.tripwireTriggered) {
            const lastAssistantMessage = Array.isArray(fullHistory)
              ? [...fullHistory].reverse().find((entry) => entry?.role === "assistant")
              : undefined;
            const previousAssistantText = extractResponseMessageText(
              lastAssistantMessage
            );
            const clarificationRequestedPreviously =
              previousAssistantText === RELEVANCE_FOLLOW_UP_MESSAGE;
            const outgoingMessage = clarificationRequestedPreviously
              ? RELEVANCE_REJECTION_MESSAGE
              : RELEVANCE_FOLLOW_UP_MESSAGE;
            console.log(
              clarificationRequestedPreviously
                ? "Guardrail rejection after clarification via Chatwoot"
                : "Guardrail follow-up requested via Chatwoot",
              {
                guardrailUserInput,
                relevanceOutput: relevance.outputInfo,
                conversationId,
              }
            );
            const guardrailResponse = await sendBotMessage(
              accountId,
              conversationId,
              outgoingMessage,
              buildReplyOptions(defaultReplyOverride, normalizedReferencedReplyToId)
            );
            await logAssistantResponse(guardrailResponse, outgoingMessage);
            return NextResponse.json({ status: "guardrail" });
          }
        } catch (err) {
          console.error("guardrail check error", err);
          await sendFallback();
          return NextResponse.json({ status: "fallback" });
        }
      } finally {
        endGuardrailEvaluation();
      }
  
        let quoteCandidates: QuoteCandidate[] = [];
        try {
          quoteCandidates = await getQuoteCandidates(conversationKey, {
            conversation,
            message: message as any,
            userLimit: QUOTE_TRANSCRIPT_USER_LIMIT,
            assistantLimit: QUOTE_TRANSCRIPT_ASSISTANT_LIMIT,
            maxCandidates: MAX_DEVELOPER_QUOTE_LINES,
          });
        } catch (err) {
          console.error("quote candidates error", err);
        }
        const developerMessages: ResponseMessage[] = [];
        if (imageInsights?.developerNote) {
          developerMessages.push(
            toResponseMessage("developer", imageInsights.developerNote)
          );
        }
        const developerPrompt = buildQuoteDeveloperPrompt(quoteCandidates);
        if (developerPrompt) {
          developerMessages.push(toResponseMessage("developer", developerPrompt));
        }
        if (developerMessages.length) {
          promptHistory = [...developerMessages, ...promptHistory];
        }
  
        let conversationSynopsis: string | undefined;
        try {
          const synopsisMessageId =
            normalizedMessageId ??
            (typeof messageId === "number" || typeof messageId === "string"
              ? messageId
              : undefined);
          conversationSynopsis = await getConversationSynopsis(conversationKey, {
            latestMessageId: synopsisMessageId,
            history: fullHistory,
          });
        } catch (err) {
          console.error("conversation synopsis error", err);
        }
  
        let replyText = "";
        const streamSummary: {
          lastEventType?: string;
          toolNames: Set<string>;
          outputTextDeltaCount: number;
          eventCounts: Record<string, number>;
        } = {
          toolNames: new Set<string>(),
          outputTextDeltaCount: 0,
          eventCounts: Object.create(null),
        };
        let pendingReplyReferenceId: string | undefined;
        let pendingReplyReferenceArgs = "";
        let replyReferenceOverride:
          | { inReplyTo?: number | null; private?: boolean }
          | undefined;
        const providerName = process.env.CHATWOOT_WEBHOOK_PROVIDER
          ? process.env.CHATWOOT_WEBHOOK_PROVIDER.trim().toLowerCase()
          : undefined;
  
        const endProviderExecution = timer.startPhase("provider-execution");
        try {
          try {
            const providerDeveloperEntries = promptHistory
              .filter((entry) => entry.role === "developer")
              .slice(0, 5);
            const providerHistoryPreview = promptHistory.slice(-5);
            logWithMetadata("chatwoot provider context pretrim", {
              developerEntries: summarizeMessagesForLog(
                providerDeveloperEntries,
                providerDeveloperEntries.length
              ),
              historyPreview: summarizeMessagesForLog(
                providerHistoryPreview,
                providerHistoryPreview.length
              ),
              historyCount: promptHistory.length,
            });
            const systemMessage = toResponseMessage("system", CHATWOOT_SYSTEM_PROMPT);
          const synopsisMessages = conversationSynopsis
            ? [toResponseMessage("developer", conversationSynopsis)]
            : [];
          const buildProviderMessages = (historyEntries: ResponseMessage[]) => [
            systemMessage,
            ...synopsisMessages,
            ...historyEntries,
          ];
  
          let trimmedHistory = [...promptHistory];
          let providerMessages = buildProviderMessages(trimmedHistory);
          const providerTokenLimit = getProviderTokenLimit(providerName);
          let tokenEstimate = estimateMessageTokens(
            providerMessages,
            providerModelName as TiktokenModel
          );
  
          const stickyDeveloperEntry =
            trimmedHistory.length && trimmedHistory[0]?.role === "developer"
              ? trimmedHistory[0]
              : undefined;
  
          while (trimmedHistory.length && tokenEstimate > providerTokenLimit) {
            if (stickyDeveloperEntry) {
              if (trimmedHistory.length <= 1) {
                break;
              }
              trimmedHistory = [
                stickyDeveloperEntry,
                ...trimmedHistory.slice(2),
              ];
            } else {
              trimmedHistory = trimmedHistory.slice(1);
            }
            providerMessages = buildProviderMessages(trimmedHistory);
            tokenEstimate = estimateMessageTokens(
              providerMessages,
              providerModelName as TiktokenModel
            );
          }

          promptHistory = trimmedHistory;
          const finalDeveloperEntries = promptHistory
            .filter((entry) => entry.role === "developer")
            .slice(0, 5);
          const finalHistoryPreview = promptHistory.slice(-5);
          logWithMetadata("chatwoot provider context final", {
            developerEntries: summarizeMessagesForLog(
              finalDeveloperEntries,
              finalDeveloperEntries.length
            ),
            historyPreview: summarizeMessagesForLog(
              finalHistoryPreview,
              finalHistoryPreview.length
            ),
            historyCount: promptHistory.length,
          });

          const hasInvalidImageUrl = providerMessages.some((entry) =>
            Array.isArray((entry as any)?.content) &&
            (entry as any).content.some((item: any) => {
              if (!item || typeof item !== "object") {
                return false;
              }
              if (item.type === "input_image" || item.type === "output_image") {
                return typeof item.image_url !== "string";
              }
              return false;
            })
          );
  
          if (hasInvalidImageUrl) {
            console.error("chatwoot webhook", "invalid image_url payload");
            await sendFallback();
            return NextResponse.json({ status: "fallback" });
          }
  
          let provider;
          try {
            provider = getProvider(providerName);
          } catch (err) {
            console.error("getProvider error", err);
            await sendFallback();
            return NextResponse.json({ status: "fallback" });
          }
  
          const inputTokens = Math.max(0, Math.ceil(tokenEstimate));
          const baseOutputEstimate = Math.max(
            256,
            Math.ceil((inputTokens || 1) * 0.5)
          );
          const estimatedOutputTokens = Number.isFinite(providerTokenLimit)
            ? Math.min(
                Math.max(providerTokenLimit - inputTokens, 0),
                baseOutputEstimate
              )
            : baseOutputEstimate;
  
          const normalizeCallId = (value: unknown): string | undefined => {
            if (typeof value === "string") {
              const trimmed = value.trim();
              return trimmed ? trimmed : undefined;
            }
            if (typeof value === "number" && Number.isFinite(value)) {
              return String(value);
            }
            return undefined;
          };

          type FunctionCallState = {
            name?: string;
            callId?: string;
            args: string;
            responseId?: string;
          };

          const functionCallStates = new Map<string, FunctionCallState>();
          let latestResponseId: string | undefined;
          let manualToolResponseText: string | undefined;
          let toolExecutorHandledReply = false;
          let abortProviderStreaming = false;

          const updateLatestResponseId = (payload: unknown) => {
            if (!payload || typeof payload !== "object") {
              return;
            }
            const candidate = payload as Record<string, unknown>;
            const candidates = [
              candidate.response_id,
              (candidate.response as any)?.id,
              candidate.id,
              (candidate.item as any)?.response_id,
              (candidate.item as any)?.response?.id,
            ];
            for (const entry of candidates) {
              const normalized = normalizeCallId(entry);
              if (normalized) {
                latestResponseId = normalized;
                break;
              }
            }
          };

          const rememberFunctionCall = (item: any): string | undefined => {
            const normalizedId = normalizeCallId(
              item?.id ?? item?.call_id ?? item?.tool_call_id ?? item?.item_id
            );
            if (!normalizedId) {
              return undefined;
            }
            const existing = functionCallStates.get(normalizedId);
            if (existing) {
              if (typeof item?.arguments === "string") {
                existing.args = item.arguments;
              }
              if (!existing.name && (item?.name ?? item?.function?.name)) {
                existing.name = item?.name ?? item?.function?.name;
              }
              if (!existing.callId) {
                existing.callId = normalizeCallId(
                  item?.call_id ?? item?.tool_call_id ?? item?.id
                );
              }
              if (!existing.responseId) {
                existing.responseId =
                  normalizeCallId(item?.response_id) ?? latestResponseId;
              }
              return normalizedId;
            }
            functionCallStates.set(normalizedId, {
              name: item?.name ?? item?.function?.name,
              callId: normalizeCallId(
                item?.call_id ?? item?.tool_call_id ?? item?.id
              ),
              args:
                typeof item?.arguments === "string" ? item.arguments : "",
              responseId:
                normalizeCallId(item?.response_id) ?? latestResponseId,
            });
            return normalizedId;
          };

          const processProviderEvents = async (
            generator: AsyncGenerator<ProviderEvent>
          ): Promise<void> => {
            for await (const { event, data } of generator) {
              if (abortProviderStreaming) {
                break;
              }

              if (typeof event === "string") {
                streamSummary.lastEventType = event;
                streamSummary.eventCounts[event] =
                  (streamSummary.eventCounts[event] ?? 0) + 1;
              }

              updateLatestResponseId(data);

              if (
                event === "response.output_text.delta" &&
                typeof (data as any)?.delta === "string"
              ) {
                replyText += (data as any).delta;
                streamSummary.outputTextDeltaCount += 1;
                continue;
              }

              if (event === "response.output_item.added") {
                const item = (data as any)?.item;
                const itemName = item?.name ?? item?.function?.name;
                if (typeof itemName === "string") {
                  streamSummary.toolNames.add(itemName);
                }
                if (item?.type === "function_call") {
                  rememberFunctionCall(item);
                  if (itemName === "set_reply_reference") {
                    pendingReplyReferenceId = normalizeCallId(
                      item?.call_id ??
                        item?.id ??
                        item?.tool_call_id ??
                        item?.item_id ??
                        item?.callId
                    );
                    pendingReplyReferenceArgs =
                      typeof item?.arguments === "string"
                        ? item.arguments
                        : "";
                  }
                }
                continue;
              }

              if (event === "response.function_call_arguments.delta") {
                const normalizedId = normalizeCallId(
                  (data as any)?.item_id ??
                    (data as any)?.id ??
                    (data as any)?.call_id ??
                    (data as any)?.tool_call_id
                );
                const delta =
                  typeof (data as any)?.delta === "string"
                    ? (data as any).delta
                    : undefined;
                if (
                  pendingReplyReferenceId &&
                  normalizedId === pendingReplyReferenceId &&
                  delta
                ) {
                  pendingReplyReferenceArgs += delta;
                }
                if (normalizedId && delta && functionCallStates.has(normalizedId)) {
                  functionCallStates.get(normalizedId)!.args += delta;
                }
                continue;
              }

              if (event === "response.function_call_arguments.done") {
                const normalizedId = normalizeCallId(
                  (data as any)?.item_id ??
                    (data as any)?.id ??
                    (data as any)?.call_id ??
                    (data as any)?.tool_call_id
                );
                if (
                  pendingReplyReferenceId &&
                  normalizedId === pendingReplyReferenceId
                ) {
                  let finalArgs = "";
                  if (typeof (data as any)?.arguments === "string") {
                    finalArgs = (data as any).arguments;
                  }
                  if (!finalArgs) {
                    finalArgs = pendingReplyReferenceArgs;
                  }
                  if (finalArgs) {
                    try {
                      const parsedArgs = parse(finalArgs) as any;
                      const parsedUseQuotes =
                        typeof parsedArgs?.use_quotes === "boolean"
                          ? parsedArgs.use_quotes
                          : typeof parsedArgs?.useQuotes === "boolean"
                            ? parsedArgs.useQuotes
                            : undefined;
                      const parsedMessageId = parseMessageId(
                        parsedArgs?.message_id ??
                          parsedArgs?.messageId ??
                          parsedArgs?.messageID
                      );
                      const parsedPrivate =
                        typeof parsedArgs?.private === "boolean"
                          ? parsedArgs.private
                          : typeof parsedArgs?.is_private === "boolean"
                            ? parsedArgs.is_private
                            : typeof parsedArgs?.send_private === "boolean"
                              ? parsedArgs.send_private
                              : undefined;

                      const nextOverride: {
                        inReplyTo?: number | null;
                        private?: boolean;
                      } = {};
                      let hasOverride = false;

                      if (parsedUseQuotes === false) {
                        nextOverride.inReplyTo = null;
                        hasOverride = true;
                      } else if (typeof parsedMessageId === "number") {
                        nextOverride.inReplyTo = parsedMessageId;
                        hasOverride = true;
                      } else if (parsedUseQuotes === true) {
                        nextOverride.inReplyTo = undefined;
                        hasOverride = true;
                      }

                      if (typeof parsedPrivate === "boolean") {
                        nextOverride.private = parsedPrivate;
                        hasOverride = true;
                      }

                      if (hasOverride) {
                        replyReferenceOverride = nextOverride;
                      }
                    } catch (err) {
                      console.warn("set_reply_reference parse error", err);
                    }
                  }
                  pendingReplyReferenceId = undefined;
                  pendingReplyReferenceArgs = "";
                }
                if (normalizedId && functionCallStates.has(normalizedId)) {
                  const state = functionCallStates.get(normalizedId)!;
                  if (typeof (data as any)?.arguments === "string") {
                    state.args = (data as any).arguments;
                  }
                  const responseIdCandidate =
                    normalizeCallId((data as any)?.response_id) ??
                    latestResponseId;
                  if (responseIdCandidate) {
                    state.responseId = responseIdCandidate;
                  }
                }
                continue;
              }

              if (event === "response.output_item.done") {
                const item = (data as any)?.item;
                if (item?.type === "function_call") {
                  const normalizedId = rememberFunctionCall(item);
                  const state = normalizedId
                    ? functionCallStates.get(normalizedId)
                    : undefined;
                  const itemName =
                    item?.name ?? item?.function?.name ?? state?.name;
                  if (itemName === "set_reply_reference") {
                    if (normalizedId) {
                      functionCallStates.delete(normalizedId);
                    }
                    continue;
                  }
                  if (itemName && state) {
                    const argsSource =
                      (typeof item?.arguments === "string" &&
                        item.arguments.trim()) ||
                      state.args ||
                      "";
                    let parsedArgs: Record<string, unknown> = {};
                    if (argsSource) {
                      try {
                        parsedArgs = parse(argsSource) as Record<string, unknown>;
                      } catch (error) {
                        console.warn(
                          "chatwoot webhook tool argument parse error",
                          { tool: itemName, error }
                        );
                        parsedArgs = {};
                      }
                    }
                    const executor = chatwootToolExecutors[itemName];
                    if (executor) {
                      let toolResult: unknown;
                      let toolHandledManualResponse = false;
                      try {
                        const toolContext: ChatwootToolExecutionContext = {
                          accountId,
                          conversationId,
                          conversation,
                          message,
                        };
                        toolResult = await executor(toolContext, parsedArgs);
                        toolHandledManualResponse = Boolean(
                          toolContext.manualResponseHandled
                        );
                        if (toolHandledManualResponse) {
                          toolExecutorHandledReply = true;
                        }
                      } catch (error) {
                        console.error("chatwoot tool execution error", {
                          tool: itemName,
                          error,
                        });
                        toolResult = {
                          error: true,
                          message:
                            error instanceof Error
                              ? error.message
                              : "Tool execution failed",
                        };
                      }
                      let serializedOutput: string;
                      try {
                        serializedOutput =
                          typeof toolResult === "string"
                            ? toolResult
                            : JSON.stringify(toolResult ?? { status: "ok" });
                      } catch (error) {
                        console.error(
                          "chatwoot tool output serialization error",
                          error
                        );
                        serializedOutput = JSON.stringify({ status: "ok" });
                      }
                      const toolCallId =
                        state.callId ??
                        normalizeCallId(
                          item?.call_id ??
                            item?.tool_call_id ??
                            item?.id ??
                            normalizedId
                        );
                      const responseIdForTool =
                        state.responseId ?? latestResponseId;
                      if (
                        providerName === "openai" &&
                        responseIdForTool &&
                        toolCallId
                      ) {
                        await processProviderEvents(
                          submitOpenAIToolOutputs(responseIdForTool, [
                            {
                              tool_call_id: toolCallId,
                              output: serializedOutput,
                            },
                          ])
                        );
                      } else {
                        if (
                          !manualToolResponseText &&
                          !toolHandledManualResponse &&
                          (!isFormSubmission || !formSubmissionConfirmationSent)
                        ) {
                          manualToolResponseText = isFormSubmission
                            ? COMPLAINT_FORM_SUBMISSION_CONFIRMATION_TEXT
                            : COMPLAINT_FORM_REMINDER_TEXT;
                        }
                        abortProviderStreaming = true;
                        if (normalizedId) {
                          functionCallStates.delete(normalizedId);
                        }
                        return;
                      }
                    } else {
                      console.warn("chatwoot webhook unknown function call", {
                        tool: itemName,
                      });
                    }
                  }
                  if (normalizedId) {
                    functionCallStates.delete(normalizedId);
                  }
                }
                continue;
              }
            }
          };

          await processProviderEvents(
            provider(providerMessages, tools, {
              model: providerModelName,
              limiterTokens: {
                input: inputTokens,
                output: estimatedOutputTokens,
              },
            })
          );

          if (!replyText && manualToolResponseText) {
            replyText = manualToolResponseText;
          }
          if (!replyText && toolExecutorHandledReply) {
            return NextResponse.json({
              status: "tool-handled",
              accountId,
              conversationId,
              inboxId,
              content,
              mode,
            });
          }
          } catch (err) {
            if (err instanceof ProviderRetryError) {
              const retryLog = {
                provider: providerName,
                attempts: err.attempts,
                retriesExhausted: err.retriesExhausted,
                status: err.status,
              };
              if (err.retriesExhausted) {
                console.error(
                  "tool execution retries exhausted",
                  retryLog,
                  err.cause ?? err
                );
                await sendFallback();
                return NextResponse.json({ status: "fallback" });
              }
              console.error("tool execution provider error", retryLog, err.cause ?? err);
              markErrorToSkipFallback(err);
              throw err;
            }
            console.error("tool execution error", err);
            throw err;
          }
        } finally {
          endProviderExecution();
        }

        const trimmedReplyText = replyText.trim();
        if (!trimmedReplyText) {
          const logSummary = {
            provider: providerName ?? providerModelName ?? "unknown",
            replyLength: replyText.length,
            streamSummary: {
              lastEventType: streamSummary.lastEventType ?? null,
              outputTextDeltaCount: streamSummary.outputTextDeltaCount,
              eventCounts: streamSummary.eventCounts,
              toolNames: Array.from(streamSummary.toolNames),
            },
          };
          console.warn("chatwoot webhook empty replyText", logSummary);
          await sendFallback();
          return NextResponse.json({ status: "fallback", reason: "empty-reply" });
        }
        replyText = trimmedReplyText;

        const quoteHistoryTurns: HistoryTurn[] = Array.isArray(promptHistory)
          ? promptHistory
              .filter((m: { role: string }) => m.role !== "developer")
              .map((m: ResponseMessage) => ({
                role: m.role,
                content: extractResponseMessageText(m),
              }))
          : [];
  
        let finalReplyReference = replyReferenceOverride;
        const hasQuoteOverride =
          finalReplyReference !== undefined &&
          Object.prototype.hasOwnProperty.call(
            finalReplyReference as Record<string, unknown>,
            "inReplyTo"
          );
        if (!hasQuoteOverride) {
          const shouldQuote = shouldQuoteInboundMessage({
            messageText: userInput,
            referencedMessageId,
            referencedMessageContent: referencedTurn?.content,
            history: quoteHistoryTurns,
          });
          if (shouldQuote) {
            const fallbackQuoteId = (() => {
              const overrideInReply = defaultReplyOverride?.inReplyTo;
              if (
                typeof overrideInReply === "number" &&
                Number.isFinite(overrideInReply)
              ) {
                return overrideInReply;
              }
              if (
                typeof normalizedDefaultReplyToId === "number" &&
                Number.isFinite(normalizedDefaultReplyToId)
              ) {
                return normalizedDefaultReplyToId;
              }
              return undefined;
            })();
            const preferredQuoteId =
              typeof referencedMessageId === "number" &&
              Number.isFinite(referencedMessageId)
                ? referencedMessageId
                : fallbackQuoteId;
            if (typeof preferredQuoteId === "number") {
              finalReplyReference = {
                ...(finalReplyReference ?? {}),
                inReplyTo: preferredQuoteId,
              };
            }
          }
        }
  
        const endPostback = timer.startPhase("chatwoot-postback");
        try {
          try {
            const finalResponse = await sendBotMessage(
              accountId,
              conversationId,
              replyText,
              buildReplyOptions(finalReplyReference, normalizedReferencedReplyToId)
            );
            await logAssistantResponse(finalResponse, replyText);
          } catch (err) {
            console.error("sendBotMessage error", err);
            await sendFallback();
            return NextResponse.json({ status: "fallback" });
          }
        } finally {
          endPostback();
        }
  
        return NextResponse.json({
          accountId,
          conversationId,
          inboxId,
          content,
          mode,
        });
    })();

    try {
      return await jobResultPromise;
    } catch (error) {
      if (isChatwootQueueEnabled() && !shouldSkipFallbackForError(error)) {
        await sendFallback();
      }
      throw error;
    }

    } catch (error) {
      console.error("Chatwoot webhook error", error);
      if (isChatwootQueueEnabled()) {
        throw error;
      }
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

setChatwootQueueFailureReporter(
  ({
    jobId,
    metadata,
    attempts,
    maxAttempts,
    error,
    queueLength,
    activeWorkers,
    waitMs,
    runtimeMs,
    delayMs,
  }) => {
    console.error("chatwoot webhook job unrecoverable failure", {
      jobId,
      metadata,
      attempts,
      maxAttempts,
      error,
      queueLength,
      activeWorkers,
      waitMs,
      runtimeMs,
      delayMs,
    });
  }
);

setChatwootJobRunner(async (metadata) => {
  if (!metadata?.payload) {
    console.error("chatwoot webhook job missing payload metadata", metadata);
    return;
  }
  const sanitized = sanitizeWebhookPayload(metadata.payload);
  await processChatwootWebhookJob(sanitized, {
    jobId: metadata.jobId,
  });
});

export async function POST(request: Request) {
  let incoming: ChatwootWebhookPayload;
  try {
    incoming = (await request.json()) as ChatwootWebhookPayload;
  } catch (error) {
    console.error("chatwoot webhook json parse error", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sanitizedIncoming = sanitizeWebhookPayload(incoming);
  const { accountId: metadataAccountId, conversationId: metadataConversationId } =
    extractChatwootJobMetadata(sanitizedIncoming);
  const jobMetadata: {
    accountId?: number | string;
    conversationId?: number | string;
    payload: ChatwootWebhookPayload;
    jobId?: number;
  } = {
    accountId: metadataAccountId,
    conversationId: metadataConversationId,
    payload: sanitizedIncoming,
  };
  const processJob = () =>
    processChatwootWebhookJob(sanitizedIncoming, { jobId: jobMetadata.jobId });

  if (!isChatwootQueueEnabled()) {
    jobMetadata.jobId = jobMetadata.jobId ?? Date.now();
    return processJob();
  }

  const { id: jobId } = enqueueChatwootJob(processJob, jobMetadata);
  jobMetadata.jobId = jobId;
  return NextResponse.json({ status: "accepted" }, { status: 202 });
}
