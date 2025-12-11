import { setTimeout as delay } from 'timers/promises';

const releaseAttempts = new Map<number, number>();

const MAX_ATTEMPTS = parseInt(process.env.RELEASE_MAX_ATTEMPTS || '5', 10);
const BASE_DELAY_MS = parseInt(process.env.RELEASE_RETRY_BASE_MS || '1000', 10);

export async function recordReleaseFailure(
  conversationId: number,
  err: unknown
): Promise<{ shouldRetry: boolean }>
{
  const attempt = (releaseAttempts.get(conversationId) ?? 0) + 1;
  releaseAttempts.set(conversationId, attempt);
  const delayMs = BASE_DELAY_MS * 2 ** (attempt - 1);
  if (attempt >= MAX_ATTEMPTS) {
    console.error('release retry limit reached', {
      conversationId,
      attempts: attempt,
      error: err,
    });
    releaseAttempts.delete(conversationId);
    return { shouldRetry: false };
  }
  // Exponential backoff before signalling retry
  await delay(delayMs);
  return { shouldRetry: true };
}

export function clearReleaseAttempts(conversationId: number) {
  releaseAttempts.delete(conversationId);
}
