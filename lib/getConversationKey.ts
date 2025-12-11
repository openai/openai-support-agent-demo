export function getConversationKey(
  accountId: number,
  conversationId: number,
  inboxId?: number
) {
  const parts = ["chatwoot", accountId.toString()];
  if (inboxId !== undefined) {
    parts.push(inboxId.toString());
  }
  parts.push(conversationId.toString());
  return parts.join(":");
}
