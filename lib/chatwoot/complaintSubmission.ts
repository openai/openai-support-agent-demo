import {
  CHATWOOT_COMPLAINT_TYPES,
  CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS,
  type ChatwootComplaintType,
} from "@/config/chatwootAttributes";
import { updateConversationCustomAttributes } from "@/lib/chatwoot";

type ComplaintAttributeKey =
  (typeof CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS)[keyof typeof CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS];

export type CreateComplaintArgs = Partial<Record<ComplaintAttributeKey, unknown>>;

type ComplaintCustomAttributes = {
  [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.customerName]: string;
  [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.companyName]: string;
  [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.companyLocation]: string;
  [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.contact]: string;
  [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.complaintType]: ChatwootComplaintType;
  [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.issueDescription]: string;
};

interface ComplaintRequestPayload {
  account_id?: number;
  conversation_id?: number;
  custom_attributes: ComplaintCustomAttributes;
}

export interface SubmitChatwootComplaintOptions {
  accountId?: number;
  conversationId?: number;
}

function resolveInternalApiUrl(path: string): string {
  const attemptResolve = (base?: string | null) => {
    if (!base) {
      return undefined;
    }

    try {
      return new URL(path, base).toString();
    } catch (error) {
      console.warn(
        "[chatwoot]",
        "resolveInternalApiUrl",
        "failed to resolve URL",
        { base, error }
      );
      return undefined;
    }
  };

  const envResolved = attemptResolve(
    process.env.INTERNAL_API_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL
  );
  if (envResolved) {
    return envResolved;
  }

  const browserResolved = attemptResolve(
    typeof window !== "undefined" ? window.location?.origin : undefined
  );
  if (browserResolved) {
    return browserResolved;
  }

  const message =
    `resolveInternalApiUrl requires INTERNAL_API_BASE_URL or NEXT_PUBLIC_APP_URL to resolve ${path}`;
  console.error(
    "[chatwoot]",
    "resolveInternalApiUrl",
    "missing base URL",
    message
  );
  throw new Error(message);
}

function normalizeRequiredString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`create_complaint requires a string ${String(field)}`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`create_complaint requires a non-empty ${String(field)}`);
  }
  return trimmed;
}

function normalizeComplaintType(value: unknown): ChatwootComplaintType {
  const normalized = normalizeRequiredString(
    value,
    CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.complaintType
  );

  const matched = CHATWOOT_COMPLAINT_TYPES.find(
    (type) => type.toLowerCase() === normalized.toLowerCase()
  );

  if (!matched) {
    throw new Error(
      `create_complaint requires a valid ${CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.complaintType}`
    );
  }

  return matched;
}

async function postJsonWithLogging<T>(
  path: string,
  payload: ComplaintRequestPayload
): Promise<T> {
  let url: string;
  try {
    url = resolveInternalApiUrl(path);
  } catch (error) {
    console.error(
      "[chatwoot]",
      "create_complaint",
      "failed to resolve internal API URL",
      error
    );
    throw error;
  }
  console.info("[chatwoot]", "POST", url, JSON.stringify(payload));
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error(
      "[chatwoot]",
      "create_complaint",
      response.status,
      errorText
    );
    throw new Error(
      `create_complaint request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    console.warn(
      "[chatwoot]",
      "create_complaint",
      "response JSON parse failed",
      error
    );
    return {} as T;
  }
}

export async function submitChatwootComplaint(
  rawArgs: Record<string, unknown> | CreateComplaintArgs,
  options: SubmitChatwootComplaintOptions = {}
) {
  const args = (rawArgs || {}) as CreateComplaintArgs;

  const { accountId, conversationId } = options;
  const hasAccountId =
    typeof accountId === "number" && Number.isFinite(accountId);
  const hasConversationId =
    typeof conversationId === "number" && Number.isFinite(conversationId);

  const customAttributes: ComplaintCustomAttributes = {
    [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.customerName]: normalizeRequiredString(
      args[CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.customerName],
      CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.customerName
    ),
    [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.companyName]: normalizeRequiredString(
      args[CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.companyName],
      CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.companyName
    ),
    [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.companyLocation]: normalizeRequiredString(
      args[CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.companyLocation],
      CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.companyLocation
    ),
    [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.contact]: normalizeRequiredString(
      args[CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.contact],
      CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.contact
    ),
    [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.complaintType]: normalizeComplaintType(
      args[CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.complaintType]
    ),
    [CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.issueDescription]: normalizeRequiredString(
      args[CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.issueDescription],
      CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS.issueDescription
    ),
  };

  if (hasAccountId && hasConversationId) {
    const response = await updateConversationCustomAttributes(
      accountId as number,
      conversationId as number,
      customAttributes
    );

    return {
      status: "submitted",
      complaint: response,
    };
  }

  const payload: ComplaintRequestPayload = {
    custom_attributes: customAttributes,
  };

  if (hasAccountId) {
    payload.account_id = accountId as number;
  }
  if (hasConversationId) {
    payload.conversation_id = conversationId as number;
  }

  const response = await postJsonWithLogging<Record<string, unknown>>(
    "/api/complaints/create",
    payload
  );

  return {
    status: "submitted",
    complaint: response,
  };
}
