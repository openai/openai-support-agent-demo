import type {
  ChatwootFormContentAttributes,
  ChatwootFormField,
} from "@/lib/chatwoot/forms";

const CHATWOOT_URL = (process.env.CHATWOOT_URL || "").replace(/\/$/, "");
const CHATWOOT_BOT_TOKEN = process.env.CHATWOOT_BOT_TOKEN || "";

if (!CHATWOOT_URL) {
  console.warn(
    "CHATWOOT_URL is not set. Chatwoot integration will be disabled."
  );
}
if (!CHATWOOT_BOT_TOKEN) {
  console.warn(
    "CHATWOOT_BOT_TOKEN is not set. Bot messaging and labeling will not work."
  );
}

async function chatwootBotFetch(path: string, init: RequestInit = {}) {
  const url = `${CHATWOOT_URL}${path}`;
  const headers = {
    api_access_token: CHATWOOT_BOT_TOKEN,
    ...(init.headers || {}),
  } as Record<string, string>;
  const { method = "GET", body } = init;
  console.info("[chatwoot]", method, url, body);
  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    console.error("[chatwoot]", res.status, text);
    throw new Error(`Chatwoot request failed: ${res.status}`);
  }
  return JSON.parse(text || "{}");
}

export type SendBotMessageOptions = {
  inReplyTo?: number;
  private?: boolean;
};

function normalizeFormFieldString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export interface SendBotFormMessagePayload {
  title?: string;
  items: ChatwootFormField[];
}

export async function sendBotMessage(
  accountId: number,
  conversationId: number,
  content: string,
  options: SendBotMessageOptions = {}
) {
  const { inReplyTo, private: isPrivate } = options;
  const payload: Record<string, unknown> = {
    content,
    message_type: "outgoing",
  };

  if (typeof isPrivate === "boolean") {
    payload.private = isPrivate;
  }

  if (typeof inReplyTo === "number" && Number.isFinite(inReplyTo)) {
    payload.content_attributes = { in_reply_to: inReplyTo };
  }

  return chatwootBotFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

export async function sendBotFormMessage(
  accountId: number,
  conversationId: number,
  form: SendBotFormMessagePayload,
  options: SendBotMessageOptions = {}
) {
  if (!form || typeof form !== "object") {
    throw new Error("Chatwoot form payload is required");
  }

  if (!Array.isArray(form.items) || form.items.length === 0) {
    throw new Error("Chatwoot form payload must include at least one item");
  }

  const normalizedItems = form.items.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Chatwoot form item at index ${index} is invalid`);
    }

    const name = normalizeFormFieldString((item as ChatwootFormField).name);
    const label = normalizeFormFieldString((item as ChatwootFormField).label);
    const type = normalizeFormFieldString((item as ChatwootFormField).type);

    if (!name) {
      throw new Error(`Chatwoot form item at index ${index} is missing a name`);
    }
    if (!label) {
      throw new Error(`Chatwoot form item at index ${index} is missing a label`);
    }
    if (!type) {
      throw new Error(`Chatwoot form item at index ${index} is missing a type`);
    }

    const normalized: ChatwootFormField = {
      name,
      label,
      type,
    };

    const placeholder = normalizeFormFieldString(
      (item as ChatwootFormField).placeholder
    );
    if (placeholder) {
      normalized.placeholder = placeholder;
    }

    const defaultValue = normalizeFormFieldString(
      (item as ChatwootFormField).default
    );
    if (defaultValue !== undefined) {
      normalized.default = defaultValue;
    }

    if (Array.isArray((item as ChatwootFormField).options)) {
      const optionsList = (item as ChatwootFormField).options?.map(
        (option, optionIndex) => {
          if (!option || typeof option !== "object") {
            throw new Error(
              `Chatwoot form item "${name}" has an invalid option at index ${optionIndex}`
            );
          }
          const optionLabel = normalizeFormFieldString(option.label);
          const optionValue = normalizeFormFieldString(option.value);
          if (!optionLabel || !optionValue) {
            throw new Error(
              `Chatwoot form item "${name}" has an option missing label or value at index ${optionIndex}`
            );
          }
          return { label: optionLabel, value: optionValue };
        }
      );
      if (optionsList && optionsList.length > 0) {
        normalized.options = optionsList;
      }
    }

    return normalized;
  });

  const { inReplyTo, private: isPrivate } = options;

  const contentAttributes: ChatwootFormContentAttributes = {
    items: normalizedItems,
  };

  const normalizedTitle = normalizeFormFieldString(form.title);
  if (normalizedTitle) {
    contentAttributes.title = normalizedTitle;
  }

  if (typeof inReplyTo === "number" && Number.isFinite(inReplyTo)) {
    contentAttributes.in_reply_to = inReplyTo;
  }

  const payload: Record<string, unknown> = {
    content: "form",
    content_type: "form",
    message_type: "outgoing",
    content_attributes: contentAttributes,
  };

  if (typeof isPrivate === "boolean") {
    payload.private = isPrivate;
  }

  return chatwootBotFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

export async function assignConversation(
  accountId: number,
  conversationId: number,
  assigneeId: number
) {
  return chatwootBotFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/assignments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignee_id: assigneeId })
    }
  );
}

export async function toggleConversationStatus(
  accountId: number,
  conversationId: number,
  status: "open" | "resolved"
) {
  return chatwootBotFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/toggle_status`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }
  );
}

const chatwootBot = {
  sendBotMessage,
  assignConversation,
  toggleConversationStatus,
};
export default chatwootBot;
