import { ProviderEvent } from "./openai";
import ollama from "ollama";
import { randomUUID } from "crypto";
import type { ProviderOptions } from "./index";
import { fileSearch } from "@/lib/tools/fileSearch";
import { webSearch } from "@/lib/tools/webSearch";
import { logger } from "../logger";
import { deriveLimiterTokens, scheduleProviderCall } from "./limiter";
import { ProviderRetryError, retryWithBackoff } from "./retry";

const defaultModel = process.env.OLLAMA_MODEL || "llama3.2";
// Context window size for Ollama requests. Set via OLLAMA_NUM_CTX.
const num_ctx = parseInt(process.env.OLLAMA_NUM_CTX || "16384", 10);
const host = process.env.OLLAMA_HOST;

if (host) {
  try {
    (ollama as any).defaults = { ...(ollama as any).defaults, host };
  } catch {
    try {
      (ollama as any).config.host = host;
    } catch {
      // ignore if unable to set host
    }
  }
}

export function convertMessages(messages: any[]) {
  return (messages || [])
    .map((m: any) => {
      if (m.role) {
        return {
          role: m.role === "developer" ? "system" : m.role,
          content: Array.isArray(m.content)
            ? m.content
                .map((c: any) => (typeof c === "string" ? c : c.text || ""))
                .join(" ")
            : String(m.content ?? ""),
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
}

export function serializeToolCallArgs(args: any): string {
  if (typeof args === "string") return args;
  return JSON.stringify(args ?? {});
}

export async function* ollamaProvider(
  messages: any[],
  tools: any,
  options?: ProviderOptions
): AsyncGenerator<ProviderEvent> {
  const model = options?.model || defaultModel;
  const limiterTokens =
    options?.limiterTokens ?? deriveLimiterTokens(messages, model);
  const converted = convertMessages(messages);
  let finalText = "";

  let stream: any;
  const payload = {
    model,
    messages: converted,
    tools,
    stream: true,
    options: { num_ctx },
  } as any;

  try {
    const retried = await retryWithBackoff(
      async () =>
        scheduleProviderCall("ollama", limiterTokens, async () => {
          console.log("ollama.chat payload", payload);
          return ollama.chat(payload);
        }),
      {
        provider: "ollama",
        onRetry: ({ attempt, delayMs, status }) => {
          logger.retry({
            provider: "ollama",
            attempt,
            delayMs,
            status,
            model,
          });
        },
      }
    );
    stream = retried.result;
    if (retried.attempts > 1) {
      logger.retryRecovered({
        provider: "ollama",
        attempts: retried.attempts,
        model,
      });
    }
  } catch (error) {
    if (error instanceof ProviderRetryError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : String(error);
    console.error(
      "ollama.chat failed",
      message,
      error,
      "finalText length",
      0
    );
    yield {
      event: "error",
      data: { message },
    } as ProviderEvent;
    return;
  }

  const calls = new Map<string, { type: string; name?: string; args: string }>();

  try {
    for await (const chunk of stream) {
      console.log(
        "Stream chunk:",
        JSON.stringify(chunk).slice(0, 80),
        "tool calls detected:",
        (chunk.message?.tool_calls || []).length > 0
      );
      const content = chunk.message?.content ?? "";
      if (content) {
        finalText += content;
        yield { event: "response.output_text.delta", data: { delta: content } } as ProviderEvent;
      }

      const toolCalls = chunk.message?.tool_calls || [];
      for (const call of toolCalls) {
      const id = (call as any).id ?? randomUUID();
      let state = calls.get(id);
      if (!state) {
        const type = (call as any).type || "function";
        state = { type, name: call.function?.name, args: "" };
        calls.set(id, state);
        const itemType =
          type === "file_search"
            ? "file_search_call"
            : type === "web_search"
            ? "web_search_call"
            : "function_call";
        yield {
          event: "response.output_item.added",
          data: { item: { type: itemType, id, name: state.name, call_id: id, arguments: "" } },
        } as ProviderEvent;
      }

      if (call.function?.arguments) {
        const delta = serializeToolCallArgs(call.function.arguments);
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

    if (chunk.done) {
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
              provider: "ollama",
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
          yield {
            event:
              state.type === "file_search"
                ? "response.file_search_call.completed"
                : "response.web_search_call.completed",
            data: { item_id: id, output: results },
          } as ProviderEvent;
        }
      }

      if (finalText.trim()) {
        yield { event: "response.output_text.done", data: {} } as ProviderEvent;
        yield {
          event: "response.output_item.done",
          data: {
            item: { type: "message", role: "assistant", content: finalText },
          },
        } as ProviderEvent;
      } else if (calls.size === 0) {
        const msg = "Ollama returned no content";
        console.error("No content returned", "finalText length", finalText.length);
        yield { event: "error", data: { message: msg } } as ProviderEvent;
      } else {
        yield { event: "response.output_text.done", data: {} } as ProviderEvent;
      }
    }
  }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    console.error("ollama.chat stream error", message, error);
    yield { event: "error", data: { message } } as ProviderEvent;
  }
}

