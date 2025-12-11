export function extractIds(payload: any): { accountId?: number; conversationId?: number } {
  const conversationId =
    payload?.conversation?.id ??
    payload?.conversation_id ??
    payload?.id ??
    payload?.message?.conversation?.id ??
    payload?.message?.conversation_id;

  const accountId =
    payload?.conversation?.account_id ??
    payload?.conversation?.account?.id ??
    payload?.account?.id ??
    payload?.account_id ??
    payload?.message?.conversation?.account_id ??
    payload?.message?.conversation?.account?.id ??
    payload?.message?.account?.id ??
    payload?.message?.account_id;

  return { accountId, conversationId };
}
