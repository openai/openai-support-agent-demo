export function normalizeQueryLengths(
  inputs: Array<string | undefined | null>,
  limit = Infinity
): string[] {
  const results: string[] = [];

  for (const input of inputs) {
    const trimmed = input?.trim();
    if (!trimmed) continue;

    if (trimmed.length <= limit) {
      results.push(trimmed);
      continue;
    }

    let remaining = trimmed;
    while (remaining.length > limit) {
      const next = remaining.slice(0, limit);
      const lastSpace = next.lastIndexOf(" ");

      let segment: string;
      if (lastSpace > 0) {
        segment = next.slice(0, lastSpace).trim();
        remaining = remaining.slice(lastSpace + 1);
      } else {
        segment = next.trim();
        remaining = remaining.slice(next.length);
      }

      if (segment.length) {
        results.push(segment);
      }

      remaining = remaining.trim();
      if (!remaining) break;
    }

    if (remaining.length) {
      results.push(remaining);
    }
  }

  return results;
}
