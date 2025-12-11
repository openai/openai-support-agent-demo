export function generateSearchQueries(query: string): string[] {
  const parts = query
    .split(/(?:[.,?!;]|\band\b|\bor\b)/gi)
    .map((p) => p.trim())
    .filter((p) => p);

  const unique: string[] = [];
  for (const p of parts) {
    if (!unique.includes(p)) {
      unique.push(p);
    }
    if (unique.length >= 5) break;
  }

  return unique.length > 0 ? unique : [query.trim()].filter(Boolean);
}