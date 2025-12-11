import OpenAI from "openai";
import { parse as partialJsonParse } from "partial-json";
import { fetchAttachmentImage } from "@/lib/chatwoot/fetchAttachmentImage";
import {
  searchKnowledgeBase,
  type SearchKnowledgeBaseArgs,
} from "@/lib/knowledgeBase/searchKnowledgeBase";
import { normalizeQueryLengths } from "@/lib/utils/normalizeQueryLengths";

export type ImageInsightsClient = Pick<OpenAI, "responses">;

export interface ChatwootImageAttachment {
  displayName: string;
  mimeType?: string;
  url?: string;
  dataUrl?: string;
  base64?: string;
  fetchedDataUrl?: string | null;
}

export interface GatherImageInsightsOptions {
  attachments: ChatwootImageAttachment[];
  userText?: string;
  knowledgeBaseProvider?: string;
  maxKnowledgeBaseResults?: number;
  imageModel?: string;
  imageOnly?: boolean;
  /**
   * Optional OpenAI client override. Primarily used by tests to provide a
   * deterministic mock without touching the shared instance.
   */
  openAIClient?: ImageInsightsClient;
}

export interface ImageKnowledgeBaseMatch {
  title?: string;
  url?: string;
  snippet: string;
  score?: number;
  filepath?: string;
}

export interface GatherImageInsightsResult {
  userPromptSupplement?: string;
  developerNote?: string;
  description?: string;
  queries?: string[];
  knowledgeBaseMatches?: ImageKnowledgeBaseMatch[];
  followUpQuestions?: string[];
}

let sharedOpenAIClient: ImageInsightsClient | undefined;

/**
 * The image insights flow shares a single OpenAI client for the lifetime of
 * this module. The OpenAI SDK is stateless, so reusing the instance across
 * requests is thread-safe while avoiding the overhead of repeatedly
 * constructing new clients.
 */
function getSharedOpenAIClient(): ImageInsightsClient {
  if (!sharedOpenAIClient) {
    sharedOpenAIClient = new OpenAI();
  }
  return sharedOpenAIClient;
}

/**
 * Replace the shared OpenAI client. Prefer using
 * {@link withImageInsightsClientStub} in tests so the previous client is
 * automatically restored. This direct setter should only be used for legacy
 * harnesses that cannot adopt the helper.
 */
export function setImageInsightsClientForTesting(
  client: ImageInsightsClient | undefined
): void {
  sharedOpenAIClient = client;
}

export async function withImageInsightsClientStub<T>(
  client: ImageInsightsClient,
  run: () => Promise<T> | T
): Promise<T> {
  const previousClient = sharedOpenAIClient;
  sharedOpenAIClient = client;
  try {
    return await run();
  } finally {
    sharedOpenAIClient = previousClient;
  }
}

const DEFAULT_IMAGE_MODEL =
  process.env.CHATWOOT_IMAGE_MODEL?.trim() || "gpt-4.1-mini";
const DEFAULT_KB_LIMIT = Number(
  process.env.CHATWOOT_IMAGE_KB_LIMIT?.trim() || 3
);
const QUERY_CHAR_LIMIT = Infinity;

function dedupeStrings(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = value?.trim();
    if (!normalized) continue;
    if (!seen.has(normalized)) {
      seen.add(normalized);
    }
  }
  return Array.from(seen);
}

async function resolveImageResource(
  attachment: ChatwootImageAttachment
): Promise<string | undefined> {
  if (!attachment) return undefined;
  if (attachment.dataUrl) {
    return attachment.dataUrl;
  }
  if (typeof attachment.fetchedDataUrl === "string") {
    return attachment.fetchedDataUrl;
  }
  if (attachment.url) {
    try {
      const dataUrl = await fetchAttachmentImage(
        attachment.url,
        attachment.mimeType
      );
      attachment.fetchedDataUrl = dataUrl ?? null;
      if (dataUrl) {
        return dataUrl;
      }
    } catch (error) {
      console.error("image insight fetch error", error);
      attachment.fetchedDataUrl = null;
    }
    return attachment.url;
  }
  if (attachment.base64) {
    const prefix = attachment.mimeType?.startsWith("image/")
      ? attachment.mimeType
      : "image/*";
    const dataUrl = `data:${prefix};base64,${attachment.base64}`;
    attachment.dataUrl = dataUrl;
    return dataUrl;
  }
  return undefined;
}

function buildUserSupplement(
  description?: string,
  attributes?: string[],
  matches?: ImageKnowledgeBaseMatch[]
): string | undefined {
  const sections: string[] = [];
  if (description) {
    sections.push(`Image summary: ${description}`);
  }
  if (attributes?.length) {
    sections.push(`Notable attributes: ${attributes.slice(0, 6).join(", ")}`);
  }
  if (matches && matches.length) {
    const matchText = matches
      .slice(0, 2)
      .map((match) => match.title || match.snippet.slice(0, 80))
      .join("; ");
    if (matchText) {
      sections.push(`Closest catalog matches: ${matchText}`);
    }
  }
  if (!sections.length) {
    return undefined;
  }
  return sections.join("\n");
}

function truncate(text: string, limit = 320): string {
  if (!text || text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 1)}…`;
}

function buildDeveloperNote(params: {
  description?: string;
  probableProducts?: string[];
  attributes?: string[];
  queries?: string[];
  matches?: ImageKnowledgeBaseMatch[];
  userText?: string;
  imageOnly?: boolean;
  followUpQuestions?: string[];
}): string | undefined {
  const {
    description,
    probableProducts,
    attributes,
    queries,
    matches,
    userText,
    imageOnly,
    followUpQuestions,
  } = params;

  const lines: string[] = [];
  lines.push("Image analysis context:");
  if (description) {
    lines.push(`- Summary: ${description}`);
  }
  if (probableProducts?.length) {
    lines.push(`- Product guesses: ${probableProducts.slice(0, 4).join(", ")}`);
  }
  if (attributes?.length) {
    lines.push(`- Attributes: ${attributes.slice(0, 8).join(", ")}`);
  }
  if (queries?.length) {
    lines.push(`- Suggested queries: ${queries.slice(0, 6).join(", ")}`);
  }
  if (followUpQuestions?.length) {
    lines.push(
      `- Suggested follow-up questions: ${followUpQuestions
        .slice(0, 3)
        .join(" | ")}`
    );
  }
  if (typeof userText === "string" && userText.trim()) {
    lines.push(`- Customer text: ${truncate(userText.trim(), 160)}`);
  } else if (imageOnly) {
    lines.push("- Customer provided no descriptive text with the image(s).");
  }

  if (matches && matches.length) {
    lines.push("Relevant knowledge base matches (most similar first):");
    matches.slice(0, 3).forEach((match, index) => {
      const title = match.title || match.filepath || `Result ${index + 1}`;
      const detailParts = [truncate(match.snippet, 240)];
      if (match.url) {
        detailParts.push(`URL: ${match.url}`);
      }
      if (typeof match.score === "number") {
        detailParts.push(`score=${match.score.toFixed(3)}`);
      }
      lines.push(`  ${index + 1}. ${title}`);
      lines.push(`     ${detailParts.join(" | ")}`);
    });
    lines.push(
      "Use these matches to recommend the closest product or share alternatives."
    );
  } else {
    lines.push(
      "No confident catalog match identified yet; consider asking for more details or escalating."
    );
  }

  return lines.join("\n");
}

function normalizeMatches(
  raw: unknown,
  limit: number
): ImageKnowledgeBaseMatch[] {
  if (!Array.isArray(raw) || !raw.length) {
    return [];
  }

  const matches: ImageKnowledgeBaseMatch[] = [];
  for (const entry of raw.slice(0, limit)) {
    if (typeof entry === "string") {
      matches.push({ snippet: entry });
      continue;
    }
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const obj = entry as Record<string, any>;
    const attributes = obj.attributes ?? {};
    const match: ImageKnowledgeBaseMatch = {
      title:
        typeof attributes.title === "string"
          ? attributes.title
          : typeof obj.title === "string"
          ? obj.title
          : undefined,
      url:
        typeof attributes.url === "string"
          ? attributes.url
          : typeof obj.url === "string"
          ? obj.url
          : undefined,
      snippet:
        typeof obj.text === "string"
          ? obj.text
          : typeof obj.snippet === "string"
          ? obj.snippet
          : typeof attributes.summary === "string"
          ? attributes.summary
          : typeof attributes.text === "string"
          ? attributes.text
          : "",
      score:
        typeof obj.score === "number"
          ? obj.score
          : typeof attributes.score === "number"
          ? attributes.score
          : undefined,
      filepath:
        typeof attributes.filepath === "string" ? attributes.filepath : undefined,
    };
    if (match.snippet) {
      matches.push(match);
    }
  }
  return matches;
}

function stripMarkdownCodeFence(text: string): string {
  const trimmed = text.trim();
  const fencePattern = /^```(?:[a-z0-9_-]+)?\s*\r?\n([\s\S]*?)\r?\n?```$/i;
  const match = trimmed.match(fencePattern);
  if (!match) {
    return trimmed;
  }
  return match[1];
}

function safeParseJson(text: unknown): any {
  if (typeof text !== "string") {
    return undefined;
  }

  const attempts: string[] = [];
  const trimmed = text.trim();
  if (trimmed) {
    attempts.push(trimmed);
    const defenced = stripMarkdownCodeFence(trimmed).trim();
    if (defenced && defenced !== trimmed) {
      attempts.push(defenced);
    }
  }

  let firstError: Error | undefined;
  let secondaryError: Error | undefined;

  for (const candidate of attempts) {
    if (!candidate) {
      continue;
    }
    try {
      return JSON.parse(candidate);
    } catch (jsonError) {
      if (!firstError) {
        firstError = jsonError as Error;
      }
      try {
        return partialJsonParse(candidate);
      } catch (partialError) {
        if (!secondaryError) {
          secondaryError = partialError as Error;
        }
      }
    }
  }

  if (firstError || secondaryError) {
    console.error("image insight json parse error", {
      message: firstError?.message,
      secondaryMessage: secondaryError?.message,
    });
  }

  return undefined;
}

export const __testSafeParseJson = safeParseJson;

function extractJsonContent(response: any): any {
  if (!response) {
    return undefined;
  }
  const outputs: any[] = Array.isArray(response.output) ? response.output : [];
  for (const output of outputs) {
    const contentItems: any[] = Array.isArray(output?.content)
      ? output.content
      : [];
    for (const content of contentItems) {
      if (content && typeof content === "object") {
        if ("json" in content && content.json) {
          return content.json;
        }
        if (typeof content.text === "string") {
          const parsed = safeParseJson(content.text);
          if (parsed && typeof parsed === "object") {
            return parsed;
          }
        }
      }
    }
  }
  const parsedOutputText = safeParseJson(response?.output_text);
  if (parsedOutputText && typeof parsedOutputText === "object") {
    return parsedOutputText;
  }
  return undefined;
}

export async function gatherImageInsights({
  attachments,
  userText,
  knowledgeBaseProvider,
  maxKnowledgeBaseResults,
  imageModel,
  imageOnly,
  openAIClient,
}: GatherImageInsightsOptions): Promise<GatherImageInsightsResult | undefined> {
  const images = attachments.filter((attachment) => attachment && attachment);
  if (!images.length) {
    return undefined;
  }

  const resolvedImages: {
    type: "input_image";
    image_url: string;
    detail: "low" | "high" | "auto";
  }[] = [];
  for (const attachment of images) {
    try {
      const resource = await resolveImageResource(attachment);
      if (resource) {
        resolvedImages.push({
          type: "input_image",
          image_url: resource,
          detail: "auto",
        });
      }
    } catch (error) {
      console.error("image insight resource error", error);
    }
  }

  if (!resolvedImages.length) {
    return undefined;
  }

  const finalImageModel = imageModel?.trim() || DEFAULT_IMAGE_MODEL;

  let parsedJson: any;
  try {
    const openai = openAIClient ?? getSharedOpenAIClient();
    const instructionLines = [
      "Analyze the attached product image(s) and identify what the customer might be looking for.",
      "Respond strictly in JSON with the following fields:",
      "- description: concise summary of the item in the photo.",
      "- probable_products: array of plausible catalog product names or categories.",
      "- attributes: array of distinguishing attributes such as brand hints, colors, materials, sizes, or context.",
      "- search_queries: array of 3-6 short keyword queries that should surface similar products from a knowledge base.",
      "- follow_up_questions: optional array with clarifying questions if needed.",
    ];
    const userMessageParts: string[] = [];
    if (userText?.trim()) {
      userMessageParts.push(`Customer message: ${userText.trim()}`);
    }
    userMessageParts.push(
      "Return valid JSON only. Do not include explanations outside the JSON payload."
    );

    const response = await openai.responses.create({
      model: finalImageModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: instructionLines.join("\n"),
            },
          ],
        },
        {
          role: "user",
          content: [
            { type: "input_text", text: userMessageParts.join("\n\n") },
            ...resolvedImages,
          ],
        },
      ],
      max_output_tokens: 700,
    });

    parsedJson = extractJsonContent(response);
  } catch (error) {
    console.error("image insight analysis error", error);
    return undefined;
  }

  if (!parsedJson || typeof parsedJson !== "object") {
    return undefined;
  }

  const description =
    typeof parsedJson.description === "string"
      ? parsedJson.description.trim()
      : undefined;
  const probableProducts = Array.isArray(parsedJson.probable_products)
    ? parsedJson.probable_products
        .map((value: unknown) =>
          typeof value === "string" ? value.trim() : undefined
        )
        .filter((value: string | undefined): value is string => !!value)
    : [];
  const attributes = Array.isArray(parsedJson.attributes)
    ? parsedJson.attributes
        .map((value: unknown) =>
          typeof value === "string" ? value.trim() : undefined
        )
        .filter((value: string | undefined): value is string => !!value)
    : [];
  const searchQueries = Array.isArray(parsedJson.search_queries)
    ? parsedJson.search_queries
        .map((value: unknown) =>
          typeof value === "string" ? value.trim() : undefined
        )
        .filter((value: string | undefined): value is string => !!value)
    : [];
  const followUpQuestions = Array.isArray(parsedJson.follow_up_questions)
    ? parsedJson.follow_up_questions
        .map((value: unknown) =>
          typeof value === "string" ? value.trim() : undefined
        )
        .filter((value: string | undefined): value is string => !!value)
    : [];

  const limitedQueries = normalizeQueryLengths(
    [
      ...searchQueries,
      description,
      ...probableProducts,
    ],
    QUERY_CHAR_LIMIT
  );

  const uniqueQueries = dedupeStrings(limitedQueries);

  const kbLimit = Number.isFinite(maxKnowledgeBaseResults)
    ? Number(maxKnowledgeBaseResults)
    : DEFAULT_KB_LIMIT;

  let knowledgeBaseMatches: ImageKnowledgeBaseMatch[] = [];
  if (uniqueQueries.length) {
    const [primary, ...rest] = uniqueQueries;
    try {
      const args: SearchKnowledgeBaseArgs = {
        query: primary,
        queries: rest,
        provider: knowledgeBaseProvider,
        limit: kbLimit,
      };
      const result = await searchKnowledgeBase(args);
      knowledgeBaseMatches = normalizeMatches(result.results, kbLimit);
    } catch (error) {
      console.error("image insight knowledge base error", error);
    }
  }

  const developerNote = buildDeveloperNote({
    description,
    probableProducts,
    attributes,
    queries: uniqueQueries,
    matches: knowledgeBaseMatches,
    userText,
    imageOnly,
    followUpQuestions,
  });

  const userPromptSupplement = buildUserSupplement(
    description,
    attributes,
    knowledgeBaseMatches
  );

  return {
    userPromptSupplement,
    developerNote,
    description,
    queries: uniqueQueries,
    knowledgeBaseMatches,
    followUpQuestions,
  };
}
