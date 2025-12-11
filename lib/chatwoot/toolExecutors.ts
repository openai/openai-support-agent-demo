import { sendBotFormMessage, sendBotMessage } from "@/lib/chatwootBot";
import {
  buildComplaintFormContent,
  type ChatwootComplaintFormDefaults,
} from "@/lib/chatwoot/forms";
import { COMPLAINT_FORM_REMINDER_TEXT } from "@/lib/chatwoot/messages";
import { submitChatwootComplaint } from "@/lib/chatwoot/complaintSubmission";
import {
  searchKnowledgeBase,
  type SearchKnowledgeBaseArgs,
  type SearchKnowledgeBaseResult,
} from "@/lib/knowledgeBase/searchKnowledgeBase";

export interface ChatwootToolExecutionContext {
  accountId: number;
  conversationId: number;
  conversation?: unknown;
  message?: unknown;
  manualResponseHandled?: boolean;
}

export type ChatwootToolExecutor = (
  context: ChatwootToolExecutionContext,
  args: Record<string, unknown>
) => Promise<unknown>;

export interface SendComplaintFormArgs {
  title?: string;
  defaults?: ChatwootComplaintFormDefaults;
}

type SearchKnowledgeBaseToolArgs = Partial<
  Record<keyof SearchKnowledgeBaseArgs, unknown>
>;

export async function send_complaint_form(
  context: ChatwootToolExecutionContext,
  rawArgs: Record<string, unknown>
) {
  const { accountId, conversationId } = context;
  if (
    typeof accountId !== "number" ||
    Number.isNaN(accountId) ||
    typeof conversationId !== "number" ||
    Number.isNaN(conversationId)
  ) {
    throw new Error("send_complaint_form requires valid account and conversation identifiers");
  }

  const args = (rawArgs || {}) as SendComplaintFormArgs;
  const defaults = (args.defaults || {}) as ChatwootComplaintFormDefaults;
  const title = typeof args.title === "string" ? args.title : undefined;

  const formContent = buildComplaintFormContent(defaults, { title });

  const inboundMessage =
    context && typeof context.message === "object" && context.message !== null
      ? (context.message as Record<string, unknown>)
      : undefined;
  const isFormUpdate =
    typeof inboundMessage?.content_type === "string" &&
    inboundMessage.content_type.toLowerCase() === "form";

  if (!isFormUpdate) {
    await sendBotMessage(
      accountId,
      conversationId,
      COMPLAINT_FORM_REMINDER_TEXT
    );
    context.manualResponseHandled = true;
  } else {
    delete context.manualResponseHandled;
  }
  await sendBotFormMessage(accountId, conversationId, formContent);

  return {
    status: "sent",
    form: {
      title: formContent.title,
      fieldCount: formContent.items.length,
    },
  };
}

export async function create_complaint(
  context: ChatwootToolExecutionContext,
  rawArgs: Record<string, unknown>
) {
  const { accountId, conversationId } = context;
  if (
    typeof accountId !== "number" ||
    Number.isNaN(accountId) ||
    typeof conversationId !== "number" ||
    Number.isNaN(conversationId)
  ) {
    throw new Error(
      "create_complaint requires valid account and conversation identifiers"
    );
  }

  return submitChatwootComplaint(rawArgs, {
    accountId,
    conversationId,
  });
}

function normalizeOptionalBoolean(value: unknown): boolean | undefined {
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
  return undefined;
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
  return undefined;
}

function normalizeOptionalStringArray(
  value: unknown
): string[] | undefined {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : undefined;
  if (!source) {
    return undefined;
  }
  const normalized = source
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  return normalized.length > 0 ? normalized : undefined;
}

export async function search_knowledge_base(
  _context: ChatwootToolExecutionContext,
  rawArgs: Record<string, unknown>
): Promise<SearchKnowledgeBaseResult> {
  const args = (rawArgs || {}) as SearchKnowledgeBaseToolArgs;

  const searchArgs: SearchKnowledgeBaseArgs = {
    query: normalizeOptionalString(args.query),
    queries: normalizeOptionalStringArray(args.queries),
    provider: normalizeOptionalString(args.provider),
    limit: normalizeOptionalNumber(args.limit),
    threshold: normalizeOptionalNumber(args.threshold),
    topKOnly: normalizeOptionalBoolean(args.topKOnly),
  };

  return searchKnowledgeBase(searchArgs);
}

export const chatwootToolExecutors: Record<string, ChatwootToolExecutor> = {
  send_complaint_form: async (context, args) =>
    send_complaint_form(context, args),
  create_complaint: async (context, args) =>
    create_complaint(context, args),
  search_knowledge_base: async (context, args) =>
    search_knowledge_base(context, args),
};
