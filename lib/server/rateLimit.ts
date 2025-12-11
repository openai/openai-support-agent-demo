const windowMs = 60_000;
const maxPerWindow = 10;
const buckets: Map<string, number[]> = new Map();

export function rateLimit(key: string) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const existing = buckets.get(key) ?? [];
  const filtered = existing.filter((ts) => ts > windowStart);
  filtered.push(now);
  buckets.set(key, filtered);
  if (filtered.length > maxPerWindow) {
    return false;
  }
  return true;
}
