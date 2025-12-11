import OpenAI from "openai";
import { MODEL } from "@/config/constants";
import type { ProviderOptions } from "./index";
import { deriveLimiterTokens, scheduleProviderCall } from "./limiter";
import { logger } from "../logger";
import { retryWithBackoff } from "./retry";

/** Convert tools to the format expected by the Responses API. */
function flattenTools(tools: any[]): any[] {
  if (!Array.isArray(tools)) return tools;
  return tools.map((tool) => {
    if (tool?.type === "function" && tool.function) {
      const { name, description, parameters, strict } = tool.function;
      const flattened: any = { type: "function", name, parameters };
      if (description) flattened.description = description;
      if (strict !== undefined) flattened.strict = strict;
      return flattened;
    }
    return tool;
  });
}


export interface ProviderEvent {
  event: string;
  data: any;
}

export async function* openaiProvider(
  messages: any[],
  tools: any,
  opts?: ProviderOptions
): AsyncGenerator<ProviderEvent> {
  const openai = new OpenAI();
  const modelName = opts?.model || MODEL;
  const limiterTokens = opts?.limiterTokens ?? deriveLimiterTokens(messages, modelName);
  const { result: events, attempts } = await retryWithBackoff(
    async () =>
      scheduleProviderCall("openai", limiterTokens, async () =>
        openai.responses.create({
          model: modelName,
          input: messages,
          tools: flattenTools(tools),
          stream: true,
          include: ["file_search_call.results"],
          parallel_tool_calls: false,
        })
      ),
    {
      provider: "openai",
      onRetry: ({ attempt, delayMs, status }) => {
        logger.retry({
          provider: "openai",
          attempt,
          delayMs,
          status,
          model: modelName,
        });
      },
    }
  );

  if (attempts > 1) {
    logger.retryRecovered({
      provider: "openai",
      attempts,
      model: modelName,
    });
  }

  for await (const event of events) {
    yield { event: event.type, data: event } as ProviderEvent;
  }
}

export async function* submitOpenAIToolOutputs(
  responseId: string,
  toolOutputs: { tool_call_id: string; output: string }[]
): AsyncGenerator<ProviderEvent> {
  if (!responseId) {
    throw new Error("submitOpenAIToolOutputs requires a response id");
  }
  if (!Array.isArray(toolOutputs) || toolOutputs.length === 0) {
    throw new Error("submitOpenAIToolOutputs requires at least one tool output");
  }

  const openai = new OpenAI();
  const { result: events, attempts } = await retryWithBackoff(
    async () =>
      scheduleProviderCall("openai", undefined, async () => {
        const responsesClient = openai.responses as any;
        return responsesClient.submitToolOutputs({
          response_id: responseId,
          tool_outputs: toolOutputs,
          stream: true,
        });
      }),
    {
      provider: "openai",
      onRetry: ({ attempt, delayMs, status }) => {
        logger.retry({
          provider: "openai",
          attempt,
          delayMs,
          status,
        });
      },
    }
  );

  if (attempts > 1) {
    logger.retryRecovered({
      provider: "openai",
      attempts,
    });
  }

  for await (const event of events) {
    yield { event: event.type, data: event } as ProviderEvent;
  }
}
