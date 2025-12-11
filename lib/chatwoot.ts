import type { AgentAvailability, AgentRecord } from "./agentRotation";

const AVAILABILITY_VALUES: readonly AgentAvailability[] = [
  "online",
  "busy",
  "offline",
] as const;

function getChatwootConfig() {
  const rawBaseUrl = process.env.CHATWOOT_URL || "";
  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  if (!baseUrl) {
    const error = new Error("CHATWOOT_URL is not configured; cannot issue Chatwoot request");
    console.error("[chatwoot] missing base URL", { rawBaseUrl });
    throw error;
  }

  const token = process.env.CHATWOOT_APP_TOKEN || "";
  const timeoutMs = Number(process.env.CHATWOOT_TIMEOUT_MS || 15000);

  return { baseUrl, token, timeoutMs };
}

async function chatwootFetch(
  path: string,
  init: RequestInit & { timeoutMs?: number; maxAttempts?: number } = {}
) {
  const { baseUrl, token, timeoutMs: defaultTimeout } = getChatwootConfig();
  const url = `${baseUrl}${path}`;
  const headers = {
    "api_access_token": token,
    ...(init.headers || {}),
  } as Record<string, string>;
  const {
    method = "GET",
    body,
    timeoutMs = defaultTimeout,
    maxAttempts = 3,
    ...rest
  } = init as RequestInit & { timeoutMs?: number; maxAttempts?: number };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.info("[chatwoot]", method, url, body);
      const res = await fetch(url, {
        ...rest,
        method,
        body,
        headers,
        signal: controller.signal,
      });
      const text = await res.text();

      if (!res.ok) {
        console.error("[chatwoot]", res.status, text);
        if (res.status >= 500 && attempt < maxAttempts) {
          const backoff = 500 * 2 ** (attempt - 1);
          console.warn(`[chatwoot] retrying in ${backoff}ms`);
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }
        throw new Error(`Chatwoot request failed: ${res.status} ${text}`);
      }

      return JSON.parse(text || "{}");
    } catch (err) {
      if (attempt >= maxAttempts) {
        const msg = err instanceof Error ? err.message : String(err);
        const finalErr = new Error(
          `Chatwoot request failed after ${attempt} attempts: ${method} ${url} - ${msg}`
        );
        (finalErr as any).cause = err;
        throw finalErr;
      }
      const backoff = 500 * 2 ** (attempt - 1);
      console.warn(`[chatwoot] attempt ${attempt} failed, retrying in ${backoff}ms`, err);
      await new Promise((r) => setTimeout(r, backoff));
    } finally {
      clearTimeout(timer);
    }
  }

  // Should be unreachable
  throw new Error(`Chatwoot request failed: ${method} ${url}`);
}

export async function getConversation(
  accountId: number,
  conversationId: number
) {
  return chatwootFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}`,
    { method: "GET" }
  );
}

export async function getConversationMessages(
  accountId: number,
  conversationId: number
) {
  return chatwootFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
    { method: "GET" }
  );
}

export async function updateConversation(
  accountId: number,
  conversationId: number,
  body: Record<string, any>
) {
  return chatwootFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
}

export async function updateConversationCustomAttributes(
  accountId: number,
  conversationId: number,
  customAttributes: Record<string, unknown>
) {
  return chatwootFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/custom_attributes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ custom_attributes: customAttributes }),
    }
  );
}

function extractAgents(value: unknown, seen = new Set<object>()): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (!value || typeof value !== "object") {
    return [];
  }
  if (seen.has(value as object)) {
    return [];
  }
  seen.add(value as object);
  const container = value as Record<string, unknown>;
  const candidateKeys = ["data", "payload", "agents", "result", "meta"];
  for (const key of candidateKeys) {
    if (key in container) {
      const nested = extractAgents(container[key], seen);
      if (nested.length > 0) {
        return nested;
      }
    }
  }
  return [];
}

function normalizeAgentRecord(raw: unknown): AgentRecord | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const rawId =
    record.id ?? record.agent_id ?? record.user_id ?? record.userId ?? null;

  const id =
    typeof rawId === "number"
      ? rawId
      : typeof rawId === "string" && rawId.trim().length > 0
        ? Number.parseInt(rawId, 10)
        : NaN;

  if (!Number.isFinite(id)) {
    console.warn("[chatwoot] skipping agent without numeric id", {
      rawId,
    });
    return null;
  }

  const availabilityRaw =
    record.availability_status ?? record.availability ?? record.status ?? null;

  let availability: AgentAvailability | null = null;
  if (typeof availabilityRaw === "string") {
    const normalized = availabilityRaw.toLowerCase();
    if ((AVAILABILITY_VALUES as readonly string[]).includes(normalized)) {
      availability = normalized as AgentAvailability;
    }
  }

  if (!availability) {
    console.warn("[chatwoot] defaulting agent availability", {
      agentId: id,
      availabilityRaw,
    });
    availability = "online";
  }

  return {
    ...(record as Record<string, any>),
    id,
    availability_status: availability,
  } as AgentRecord;
}

function normalizeAgentsResponse(value: unknown): AgentRecord[] {
  const agents = extractAgents(value);
  const normalized: AgentRecord[] = [];
  for (const agent of agents) {
    const result = normalizeAgentRecord(agent);
    if (result) {
      normalized.push(result);
    }
  }
  return normalized;
}

export async function listAgents(
  accountId: number,
  availability?: AgentAvailability
) : Promise<AgentRecord[]> {
  const query = availability ? `?availability_status=${availability}` : "";
  const response = await chatwootFetch(
    `/api/v1/accounts/${accountId}/agents${query}`,
    {
      method: "GET",
    }
  );
  return normalizeAgentsResponse(response);
}

export async function getAgent(
  accountId: number,
  agentId: number
): Promise<AgentRecord | null> {
  const coerceId = (value: unknown) =>
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : NaN;

  const findAgent = (records: AgentRecord[]) =>
    records.find((agent) => coerceId(agent.id) === agentId) ?? null;

  try {
    const agents = await listAgents(accountId);
    const match = findAgent(agents);
    if (match) {
      return match;
    }
  } catch (err) {
    console.error("[chatwoot] listAgents error", err);
    throw err;
  }

  for (const availability of AVAILABILITY_VALUES) {
    try {
      const agents = await listAgents(accountId, availability);
      const match = findAgent(agents);
      if (match) {
        return match;
      }
    } catch (err) {
      console.warn(
        "[chatwoot] listAgents availability lookup failed",
        availability,
        err
      );
    }
  }

  return null;
}

export async function setAgentAvailability(
  accountId: number,
  agentId: number,
  availability: "online" | "busy" | "offline"
) {
  const path = `/api/v1/accounts/${accountId}/agents/${agentId}`;
  try {
    return await chatwootFetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability }),
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("404")) {
      const { baseUrl } = getChatwootConfig();
      const url = `${baseUrl}${path}`;
      console.error("[chatwoot] setAgentAvailability 404", {
        url,
        body: { availability },
      });
      console.error(
        "[chatwoot] ensure Chatwoot version supports PATCH /api/v1/accounts/{accountId}/agents/{agentId}"
      );
    }
    throw err;
  }
}

export async function getConversationLabels(
  accountId: number,
  conversationId: number
) {
  return chatwootFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/labels`,
    { method: "GET" }
  );
}

export async function setConversationLabels(
  accountId: number,
  conversationId: number,
  labels: string[]
) {
  return chatwootFetch(
    `/api/v1/accounts/${accountId}/conversations/${conversationId}/labels`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labels }),
    }
  );
}

const chatwoot = {
  getConversation,
  getConversationMessages,
  updateConversation,
  listAgents,
  getAgent,
  setAgentAvailability,
  getConversationLabels,
  setConversationLabels,
};
export default chatwoot;

