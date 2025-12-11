import OpenAI from "openai";
import crypto from "crypto";
import redis from "@/lib/redis";

/**
 * Summarize arbitrary text to roughly the given number of tokens.
 *
 * Summaries are cached in Redis with a 24 hour TTL ("EX" 86400) to avoid
 * recomputation of identical inputs.
 *
 * To keep hashing and summarization cheap, we only operate on the first
 * 100k characters of the input. Anything beyond that point is ignored both when
 * generating the cache key and when creating the summary.
 */
export async function summarizeText(text: string, maxTokens = 200): Promise<string> {
  const MAX_INPUT_CHARS = 100_000; // process only this many characters
  // Cache summaries for 24 hours to keep them relatively fresh.
  const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h
  const truncated = text.slice(0, MAX_INPUT_CHARS);

  const hash = crypto.createHash("sha256").update(truncated).digest("hex");
  const key = `summary:${hash}`;
  try {
    const cached = await redis.get(key);
    if (cached) return cached as string;
  } catch (err) {
    console.error("Redis get error:", err);
  }

  try {
    const openai = new OpenAI();
    const prompt = `Summarize the following text in about ${maxTokens} tokens:`;
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: `${prompt}\n\n${truncated}` }],
        },
      ],
      max_output_tokens: maxTokens,
    });

    const summary = response.output_text ?? "";
    try {
      await redis.set(key, summary, "EX", CACHE_TTL_SECONDS);
    } catch (err) {
      console.error("Redis set error:", err);
    }
    return summary;
  } catch (err) {
    console.error("summarizeText error:", err);
    return truncated;
  }
}
