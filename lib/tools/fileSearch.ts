import { VECTOR_STORE_ID, DEFAULT_SEARCH_LIMIT } from "@/config/constants";
import { localVectorStore } from "@/lib/localVectorStore";

const OLLAMA_SEARCH_THRESHOLD = Number(
  process.env.OLLAMA_SEARCH_THRESHOLD ?? 0.3,
);

/**
 * Parameters for searching files locally or via the OpenAI Vector Store.
 *
 * `limit` controls the maximum number of results returned (defaults to 10).
 * `threshold` sets the minimum cosine similarity when `topKOnly` is false.
 * When `topKOnly` is true, only the top `limit` matches are returned.
 */
export interface FileSearchParams {
  query: string;
  provider?: string;
  limit?: number;
  threshold?: number;
  topKOnly?: boolean;
}

export async function fileSearch({
  query,
  provider,
  limit,
  threshold,
  topKOnly,
}: FileSearchParams) {
  const searchLimit = limit ?? DEFAULT_SEARCH_LIMIT;
  if (provider?.includes("ollama")) {
    try {
      const results = await localVectorStore.search(query, {
        limit: searchLimit,
        threshold: threshold ?? OLLAMA_SEARCH_THRESHOLD,
        topKOnly,
      });
      return { results };
    } catch (error) {
      console.error("Local file search failed", error);
      return {
        error: error instanceof Error ? error.message : "Failed to search files",
      };
    }
  }
  try {
    const endpoint = `https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}/search`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Beta": "assistants=v2",
    };

    const performSearch = async (
      body: Record<string, unknown>,
      context: Record<string, unknown>
    ) => {
      console.info("OpenAI file search request", context);
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        console.info("OpenAI file search succeeded", context);
        return { data: await res.json() } as const;
      }

      const errorText = await res.text();
      console.warn("OpenAI file search failed", {
        ...context,
        status: res.status,
        error: errorText,
      });

      return { error: errorText, status: res.status } as const;
    };

    const initialBody: Record<string, unknown> = { query };
    const initialContext = {
      attempt: "initial",
      bodyKeys: Object.keys(initialBody),
    };
    const initialResult = await performSearch(initialBody, initialContext);

    if ("data" in initialResult) {
      return initialResult.data;
    }

    if (initialResult.status !== 400) {
      return { error: initialResult.error };
    }

    const errorMessage = initialResult.error.toLowerCase();
    let retryField: "limit" | "max_results" | undefined;
    if (errorMessage.includes("max_results")) {
      retryField = "max_results";
    } else if (errorMessage.includes("limit")) {
      retryField = "limit";
    }

    if (!retryField) {
      return { error: initialResult.error };
    }

    const retryBody: Record<string, unknown> = { query };
    retryBody[retryField] = searchLimit;

    const retryContext = {
      attempt: "retry",
      bodyKeys: Object.keys(retryBody),
      field: retryField,
    };

    const retryResult = await performSearch(retryBody, retryContext);

    if ("data" in retryResult) {
      return retryResult.data;
    }

    return { error: retryResult.error };
  } catch (error) {
    console.error("Error searching files:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to search files",
    };
  }
}

