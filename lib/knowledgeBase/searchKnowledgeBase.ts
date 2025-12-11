import { DEFAULT_SEARCH_LIMIT } from "@/config/constants";
import { fileSearch } from "@/lib/tools/fileSearch";
import { localVectorStore } from "@/lib/localVectorStore";
import { generateSearchQueries } from "@/lib/generateSearchQueries";
import { normalizeQueryLengths } from "@/lib/utils/normalizeQueryLengths";

const OLLAMA_SEARCH_THRESHOLD = Number(
  process.env.OLLAMA_SEARCH_THRESHOLD ?? 0.3
);

export interface SearchKnowledgeBaseArgs {
  query?: string;
  queries?: string[];
  provider?: string;
  limit?: number | string;
  threshold?: number | string;
  topKOnly?: boolean;
}

export interface SearchKnowledgeBaseResult {
  results?: any[] | string[];
  error?: string;
}

const QUERY_CHAR_LIMIT = Infinity;

export async function searchKnowledgeBase({
  query,
  queries,
  provider,
  limit,
  threshold,
  topKOnly,
}: SearchKnowledgeBaseArgs): Promise<SearchKnowledgeBaseResult> {
  try {
    const baseParts = [
      ...(query ? [query] : []),
      ...(
        Array.isArray(queries) && queries.length > 0
          ? queries
          : query
            ? generateSearchQueries(query)
            : []
      ),
    ];

    const normalizedParts = normalizeQueryLengths(baseParts, QUERY_CHAR_LIMIT);
    const searchParts = Array.from(
      new Set(normalizedParts.map((part) => part.trim()))
    ).filter((part) => part.length > 0);

    if (!searchParts.length) {
      return { results: [] };
    }

    const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;
    const thresholdNum =
      typeof threshold === "string" ? parseFloat(threshold) : threshold;

    const maxResults = limitNum ?? DEFAULT_SEARCH_LIMIT;
    let collected: any[] = [];

    try {
      const arrays = await Promise.all(
        searchParts.map(async (q) => {
          if (provider?.includes("ollama")) {
            return await localVectorStore.search(q, {
              limit: maxResults,
              threshold: thresholdNum ?? OLLAMA_SEARCH_THRESHOLD,
              topKOnly,
            });
          }

          const res = await fileSearch({
            query: q,
            provider,
            limit: maxResults,
            threshold: thresholdNum,
            topKOnly,
          });
          if (res.error) throw new Error(res.error);
          return res.results ?? [];
        })
      );

      for (const arr of arrays) {
        collected = collected.concat(arr);
      }
    } catch (error) {
      console.error("Knowledge base search failed", error);
      return {
        error:
          error instanceof Error ? error.message : "Failed to search files",
      };
    }

    const seen = new Set<string>();
    const deduped = collected.filter((r) => {
      const key = `${r.text}|${r.attributes?.filepath ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const qWords = query
      ? new Set(query.toLowerCase().split(/\W+/).filter(Boolean))
      : null;
    const textScore = (t: string) => {
      if (!qWords) return 0;
      const words = new Set(t.toLowerCase().split(/\W+/).filter(Boolean));
      let overlap = 0;
      for (const w of qWords) if (words.has(w)) overlap++;
      return overlap / (qWords.size || 1);
    };

    const ranked = deduped
      .map((r) => ({
        item: r,
        rank: ((typeof r.score === "number" ? r.score : 0) + textScore(r.text)) / 2,
      }))
      .sort((a, b) => b.rank - a.rank)
      .slice(0, maxResults)
      .map((r) => r.item);

    const results = provider?.includes("ollama")
      ? ranked.map((r) => r.text)
      : ranked;

    return { results };
  } catch (error) {
    console.error("Error searching knowledge base", error);
    return {
      error: error instanceof Error ? error.message : "Failed to search files",
    };
  }
}
