import OpenAI from "openai";
import { randomUUID } from "crypto";
import type { ProviderOptions } from "./index";
import type { ProviderEvent } from "./openai";
import { fileSearch } from "@/lib/tools/fileSearch";
import { webSearch } from "@/lib/tools/webSearch";
import { serializeToolCallArgs } from "./ollama";
import { deriveLimiterTokens, scheduleProviderCall } from "./limiter";
import { logger } from "../logger";
import { ProviderRetryError, retryWithBackoff } from "./retry";

const defaultModel = process.env.OLLAMA_MODEL || "llama3.2";
// Context window size for Ollama requests. Set via OLLAMA_NUM_CTX.
const num_ctx = parseInt(process.env.OLLAMA_NUM_CTX || "16384", 10);

/**
 * Provider that uses the OpenAI client against Ollama's
 * OpenAI compatible endpoint.
 */
export async function* ollamaOpenAIProvider(
  messages: any[],
  tools: any,
  opts?: ProviderOptions
): AsyncGenerator<ProviderEvent> {
  const openai = new OpenAI({
    baseURL: process.env.OLLAMA_OPENAI_BASE_URL || "http://localhost:11434/v1",
    apiKey: process.env.OLLAMA_OPENAI_API_KEY || "ollama",
  });

  const model = opts?.model || defaultModel;
  const limiterTokens =
    opts?.limiterTokens ?? deriveLimiterTokens(messages, model);

  const converted = (messages || [])
    .map((m: any) => {
      if (m.role) {
        const content = Array.isArray(m.content)
          ? m.content
              .map((c: any) => (typeof c === "string" ? c : c.text || ""))
              .join(" ")
          : String(m.content ?? "");
        return {
          role: m.role === "developer" ? "system" : m.role,
          content,
        };
      }
      if (m.type === "function_call_output") {
        return {
          role: "tool",
          tool_call_id: m.call_id,
          content: m.output ?? "",
        };
      }
      return undefined;
    })
    .filter(Boolean);

  let finalText = "";
  const calls = new Map<string, { type: string; name?: string; args: string }>();

  try {
    const payload = {
      model,
      messages: converted as any,
      tools,
      stream: true,
      options: { num_ctx },
    } as any;
    const retried = await retryWithBackoff(
      async () =>
        scheduleProviderCall("ollama-openai", limiterTokens, async () => {
          console.log("ollamaOpenAI.chat payload", JSON.stringify(payload));
          return openai.chat.completions.create(payload);
        }),
      {
        provider: "ollama-openai",
        onRetry: ({ attempt, delayMs, status }) => {
          logger.retry({
            provider: "ollama-openai",
            attempt,
            delayMs,
            status,
            model,
          });
        },
      }
    );
    const stream = retried.result;
    if (retried.attempts > 1) {
      logger.retryRecovered({
        provider: "ollama-openai",
        attempts: retried.attempts,
        model,
      });
    }

    // Stream chunks from Ollama's OpenAI endpoint. Each chunk may contain
    // partial text and tool call deltas. We forward text deltas directly
    // and build up tool call state until the model signals `tool_calls` as
    // the finish_reason. At that point we execute the calls and emit the
    // appropriate events for each tool type.
    for await (const chunk of stream as any) {
      const choice = chunk.choices?.[0];
      const delta = choice?.delta || {};

      if (delta.content) {
        finalText += delta.content;
        yield {
          event: "response.output_text.delta",
          data: { delta: delta.content },
        } as ProviderEvent;
      }

      for (const call of delta.tool_calls || []) {
        const id = call.id || randomUUID();
        let state = calls.get(id);
        if (!state) {
          state = {
            type: call.type || "function",
            name: call.function?.name,
            args: "",
          };
          calls.set(id, state);
          const itemType =
            state.type === "file_search"
              ? "file_search_call"
              : state.type === "web_search"
              ? "web_search_call"
              : "function_call";
          yield {
            event: "response.output_item.added",
            data: {
              item: {
                type: itemType,
                id,
                name: state.name,
                call_id: id,
                arguments: "",
              },
            },
          } as ProviderEvent;
        }

        if (call.function?.arguments) {
          const delta = serializeToolCallArgs(call.function?.arguments);
          if (delta) {
            state.args += delta;
            if (state.type === "function") {
              yield {
                event: "response.function_call_arguments.delta",
                data: { item_id: id, delta },
              } as ProviderEvent;
            }
          }
        }

        if (call.file_search?.query) {
          state.args += call.file_search.query;
        }
        if (call.web_search?.query) {
          state.args += call.web_search.query;
        }
      }

      if (choice?.finish_reason) {
        if (choice.finish_reason === "tool_calls") {
          for (const [id, state] of calls.entries()) {
            if (state.type === "function") {
              yield {
                event: "response.function_call_arguments.done",
                data: { item_id: id, arguments: state.args },
              } as ProviderEvent;
              yield {
                event: "response.output_item.done",
                data: {
                  item: {
                    type: "function_call",
                    id,
                    name: state.name,
                    call_id: id,
                    arguments: state.args,
                  },
                },
              } as ProviderEvent;
            } else {
              // For built-in file and web search we execute the query and
              // stream back the results to mirror the Responses API flow.
              let params: any = {};
              try {
                params = JSON.parse(state.args);
              } catch {
                params = { query: state.args };
              }
              const query = params.query || "";
              const { limit, threshold, topKOnly } = params;
              let results: any = {};
              if (state.type === "file_search") {
                const res = await fileSearch({
                  query,
                  provider: "ollama-openai",
                  limit,
                  threshold,
                  topKOnly,
                });
                results = res.results;
                yield {
                  event: "response.file_search_call.results",
                  data: { item_id: id, results },
                } as ProviderEvent;
              } else {
                results = await webSearch({ query });
                yield {
                  event: "response.web_search_call.results",
                  data: { item_id: id, results },
                } as ProviderEvent;
              }
              yield {
                event: "response.output_item.done",
                data: { item: { type: `${state.type}_call`, id, results } },
              } as ProviderEvent;
              // Signal completion so the UI can update the tool call status
              yield {
                event:
                  state.type === "file_search"
                    ? "response.file_search_call.completed"
                    : "response.web_search_call.completed",
                data: { item_id: id, output: results },
              } as ProviderEvent;
            }
          }
          yield { event: "response.output_text.done", data: {} } as ProviderEvent;
        } else if (choice.finish_reason === "stop") {
          yield { event: "response.output_text.done", data: {} } as ProviderEvent;
          if (finalText.trim()) {
            yield {
              event: "response.output_item.done",
              data: {
                item: { type: "message", role: "assistant", content: finalText },
              },
            } as ProviderEvent;
          } else if (calls.size === 0) {
            yield {
              event: "error",
              data: { message: "Assistant returned no content" },
            } as ProviderEvent;
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof ProviderRetryError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : String(error);
    console.error("ollamaOpenAI.chat failed", message, error);
    yield { event: "error", data: { message } } as ProviderEvent;
  }
}
