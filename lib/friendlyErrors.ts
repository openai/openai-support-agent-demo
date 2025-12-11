import { sendBotMessage } from "@/lib/chatwootBot";
import type { SendBotMessageOptions } from "@/lib/chatwootBot";
import { storeBotMessage } from "@/lib/storeBotMessage";

// Text shown to users when the assistant cannot send a regular message
// response. Exported for tests to assert route-specific fallbacks.
export const MESSAGE_FALLBACK_TEXT =
  "⚠️ We hit a temporary snag. Please try again in a bit!";

// Text shown to users when the assistant cannot complete a handoff.
// Currently the message is the same as MESSAGE_FALLBACK_TEXT but is
// exported separately to allow route-specific assertions.
export const HANDOFF_FALLBACK_TEXT =
  "⚠️ We hit a temporary snag. Please try again in a bit!";

export async function notifyMessageIssue(
  accountId: number,
  conversationId: number,
  options?: SendBotMessageOptions
) {
  const response = await sendBotMessage(
    accountId,
    conversationId,
    MESSAGE_FALLBACK_TEXT,
    options
  );
  await logAssistantFallback(
    accountId,
    conversationId,
    MESSAGE_FALLBACK_TEXT,
    response
  );
  return response;
}

export async function notifyHandoffIssue(
  accountId: number,
  conversationId: number,
  options?: SendBotMessageOptions
) {
  const response = await sendBotMessage(
    accountId,
    conversationId,
    HANDOFF_FALLBACK_TEXT,
    options
  );
  await logAssistantFallback(
    accountId,
    conversationId,
    HANDOFF_FALLBACK_TEXT,
    response
  );
  return response;
}

async function logAssistantFallback(
  accountId: number,
  conversationId: number,
  fallbackContent: string,
  response: unknown
) {
  await storeBotMessage({
    accountId,
    conversationId,
    payload: response,
    fallbackContent,
  });
}

