export interface WebSearchParams {
  query: string;
  max_results?: number;
}

export async function webSearch({ query, max_results = 5 }: WebSearchParams) {
  try {
    const res = await fetch(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
    );
    if (!res.ok) {
      return { error: await res.text() };
    }
    const data = await res.json();
    const topics = (data.RelatedTopics || []) as any[];
    const results = topics.slice(0, max_results).map((t: any) => ({
      title: t.Text || '',
      url: t.FirstURL,
      snippet: t.Text || '',
    }));
    return { results };
  } catch (error) {
    console.error('Error searching web:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to search web',
    };
  }
}