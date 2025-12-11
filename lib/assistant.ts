import { DEVELOPER_PROMPT, MODEL } from "@/config/constants";
import { parse } from "partial-json";
import { handleTool } from "@/lib/tools/tools-handling";
import useConversationStore from "@/stores/useConversationStore";
import { tools, ollamaTools } from "@/lib/tools/tools";
import { Annotation } from "@/components/Annotations";
import { functionsMap, create_ticket, start_chat_session } from "@/config/functions";
import useDataStore from "@/stores/useDataStore";
import { agentTools } from "@/config/tools-list";
import {
  estimateMessageTokens,
  TOKEN_THRESHOLD,
  type TiktokenModel,
} from "@/lib/utils/tokenCounter";

// generateId uses browser crypto if available, otherwise Math.random
export function generateId() {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

export function parseToolCallJson(text: string): { name: string; parameters?: any } | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) {
    return null;
  }
  try {
    const obj = JSON.parse(trimmed);
    if (obj && typeof obj.name === "string") {
      return { name: obj.name, parameters: obj.parameters };
    }
  } catch {
    // ignore JSON.parse errors
  }
  return null;
}

export interface ContentItem {
  type: "input_text" | "output_text" | "refusal" | "output_audio" | "output_image";
  annotations?: Annotation[];
  text?: string;
  image_url?: string;
}

// Message items for storing conversation history matching API shape
export interface MessageItem {
  type: "message";
  role: "user" | "assistant" | "system";
  id?: string;
  content: ContentItem[];
}

// Chat messages to display in chat
export interface ChatMessage {
  type: "message";
  role: "user" | "agent";
  id?: string;
  content: ContentItem[];
}

// Custom items to display in chat
export interface ToolCallItem {
  type: "tool_call";
  tool_type: "file_search_call" | "web_search_call" | "function_call";
  status: "in_progress" | "completed" | "failed" | "searching";
  id: string;
  name?: string | null;
  call_id?: string;
  arguments?: string;
  parsedArguments?: any;
  output?: string | null;
}

export type Item = ChatMessage | ToolCallItem;

async function trimMessagesToTokenLimit(
  allMessages: any[],
  limit: number,
  summary: string | null,
  systemCount: number,
  modelName?: TiktokenModel
) {
  const trimmed = [...allMessages];
  let tokenEstimate = estimateMessageTokens(trimmed, modelName);

  const removed: any[] = [];

  while (tokenEstimate > limit && trimmed.length > systemCount + 1) {
    removed.push(trimmed[systemCount]);
    trimmed.splice(systemCount, 1);
    tokenEstimate = estimateMessageTokens(trimmed, modelName);
  }

  if (removed.length > 0 && !summary) {
    const removedText = removed
      .map((m) =>
        Array.isArray(m.content)
          ? m.content.map((c: any) => c.text ?? "").join(" ")
          : m.content ?? ""
      )
      .join(" ");

    const MAX_REMOVED_CHARS = 100_000;
    // Limit text sent for summarization to avoid excessively large payloads.
    const truncated = removedText.slice(0, MAX_REMOVED_CHARS);

    // Ask the server to summarize instead of importing server modules in the browser.
    const resp = await fetch("/api/summarize-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: truncated }),
    });
    const { summary: cachedSummary } = await resp.json();

    trimmed.unshift({
      role: "system",
      content: [
        {
          type: "input_text",
          text: `Previous conversation summary: ${cachedSummary}`,
        },
      ],
    });

    systemCount++;
    tokenEstimate = estimateMessageTokens(trimmed, modelName);

    while (tokenEstimate > limit && trimmed.length > systemCount + 1) {
      trimmed.splice(systemCount, 1);
      tokenEstimate = estimateMessageTokens(trimmed, modelName);
    }
  }

  return trimmed;
}

export const handleTurn = async (
  messages: any[],
  onMessage: (data: any) => void,
  provider = "openai",
  toolsArg = tools,
  model?: string
) => {
  try {
    const { contactType, contactId, summary, sessionId, longSummary } =
      useDataStore.getState();
    const session_id = sessionId;
    const systemMessages: any[] = [];
    if (longSummary) {
      systemMessages.push({
        role: "system",
        content: [
          {
            type: "input_text",
            text: `Customer summary: ${longSummary}`,
          },
        ],
      });
    }
    if (summary) {
      systemMessages.push({
        role: "system",
        content: [
          {
            type: "input_text",
            text: `Previous conversation summary: ${summary}`,
          },
        ],
      });
    }
    if (contactType === "ticket" && contactId) {
      systemMessages.push({
        role: "system",
        content: [
          {
            type: "input_text",
            text: `Customer refused to share an email and uses ticket ${contactId}.`,
          },
        ],
      });
    }
    const messagesWithTicket =
      systemMessages.length > 0 ? [...systemMessages, ...messages] : messages;

    const limitedMessages = await trimMessagesToTokenLimit(
      messagesWithTicket,
      TOKEN_THRESHOLD,
      summary,
      systemMessages.length,
      model as TiktokenModel | undefined
    );

    // Get response from the API (app/api/turn_response/route.ts).
    // This endpoint streams the assistant's reply and persists the turn
    // using saveSessionMessages on the server.
    const response = await fetch("/api/turn_response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: limitedMessages,
        tools: toolsArg,
        provider,
        model,
        session_id,
        identifier: contactId,
      }),
    });

    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      if (data.guardrail) {
        onMessage({ event: "error", data: { message: data.message } });
        return;
      }
      if (!response.ok) {
        console.warn(`Error: ${response.status} - ${response.statusText}`);
        const message =
          data.message ||
          data.error ||
          "The assistant encountered an error. Please try again.";
        onMessage({ event: "error", data: { message } });
        return;
      }
    } else if (!response.ok) {
      console.warn(`Error: ${response.status} - ${response.statusText}`);
      const message = "The assistant encountered an error. Please try again.";
      onMessage({ event: "error", data: { message } });
      return;
    }

    // Reader for streaming data
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      buffer += chunkValue;

      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6);
          if (dataStr === "[DONE]") {
            done = true;
            break;
          }
          const data = JSON.parse(dataStr);
          onMessage(data);
        }
      }
    }

    // Handle any remaining data in buffer
    if (buffer && buffer.startsWith("data: ")) {
      const dataStr = buffer.slice(6);
      if (dataStr !== "[DONE]") {
        const data = JSON.parse(dataStr);
        onMessage(data);
      }
    }
  } catch (error) {
    console.warn("Error handling turn:", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "An unexpected error occurred. Please try again.";
    onMessage({ event: "error", data: { message } });
  }
};

export { estimateMessageTokens };

export const processMessages = async () => {
  const {
    chatMessages,
    conversationItems,
    recommendedActions,
    setChatMessages,
    setConversationItems,
    setRecommendedActions,
    setSuggestedMessage,
    setAgentTyping,
    setSuggestedMessageDone,
    addConversationItem,
    addChatMessage,
    removeRecommendedAction,
    autoReply,
    modelProvider,
    ollamaModel,
  } = useConversationStore.getState();

  const tokenModel =
    (modelProvider === "ollama" || modelProvider === "ollama-openai"
      ? ollamaModel
      : MODEL) as TiktokenModel;

  // Show typing indicator immediately when processing starts
  setAgentTyping(true);

  const {
    setRelevantArticlesLoading,
    setFAQExtracts,
    setRelevantArticlesError,
    emailRefused,
    setEmailRefused,
    contactType,
    contactId,
  } = useDataStore.getState();

  const lastUserMessage = [...conversationItems]
    .reverse()
    .find((m) => (m as any).role === "user");
  const lastUserText = typeof lastUserMessage?.content === "string" ? lastUserMessage.content : "";
  const ticketMatch = lastUserText.match(/#\d+\/\d{4}-\d{2}-\d{2}/);
  if (!contactType && !contactId && ticketMatch) {
    await start_chat_session({ ticket_id: ticketMatch[0] });
  }
  const emailRefusalRegex = new RegExp(
    [
      "don['’]?t feel comfortable giving (?:you )?my e[-\\s]?mail(?: address)?",
      "i don['’]?t want to",
      "i can['’]?t provide (?:that info(?:rmation)?|my e[-\\s]?mail(?: address)?)",
      "no[,\\s]*i won['’]?t",
    ].join("|"),
    "i",
  );
  if (
    !contactType &&
    !contactId &&
    !emailRefused &&
    emailRefusalRegex.test(lastUserText)
  ) {
    setEmailRefused(true);
    await create_ticket();
  }

  let toolSet: any[] =
    modelProvider === "ollama"
      ? [...ollamaTools]
      : modelProvider === "ollama-openai"
      ? [...ollamaTools]
      : [...tools];

  if (modelProvider === "openai") {
    toolSet = toolSet.filter(
      (t: any) =>
        t.type !== "function" || (t.function?.name ?? t.name) !== "search_knowledge_base"
    );
  }

  let activeTools: any[] = [...toolSet];

  const lastUserIndex = [...conversationItems]
    .map((m, i) => [m, i] as const)
    .reverse()
    .find(([m]) => (m as any).role === "user")?.[1];

  let searchAlready = false;
  if (lastUserIndex !== undefined) {
    searchAlready = conversationItems
      .slice(lastUserIndex + 1)
      .some((m: any) => m.type === "file_search_call");
  }

  if (searchAlready) {
    activeTools = activeTools.filter(
      (t: any) => t.type !== "function" || (t.function?.name ?? t.name) !== "search_knowledge_base"
    );
  }

  const allConversationItems = [
    // Adding developer prompt as first item in the conversation
    {
      role: "developer",
      content: DEVELOPER_PROMPT,
    },
    ...conversationItems,
  ];

  let assistantMessageContent = "";
  let functionArguments = "";

  await handleTurn(
    allConversationItems,
    async ({ event, data }) => {
    switch (event) {
      case "response.output_text.delta":
      case "response.output_text.annotation.added": {
        const { delta, item_id, annotation } = data;
        setAgentTyping(true);

        let partial = "";
        if (typeof delta === "string") {
          partial = delta;
        }
        assistantMessageContent += partial;

        if (!autoReply) {
          const message = {
            type: "message",
            role: "agent",
            id: item_id,
            content: [
              {
                type: "output_text",
                text: assistantMessageContent,
                annotations: annotation ? [annotation] : undefined,
              },
            ],
          } as ChatMessage;
          if (annotation) {
            message.content[0].annotations = [
              ...(message.content[0].annotations ?? []),
              annotation,
            ];
          }
          setSuggestedMessage(message);
        }
        break;
      }

      case "response.output_text.done": {
        const parsed = parseToolCallJson(assistantMessageContent);

        if (autoReply) {
          addConversationItem({
            role: "assistant",
            content: assistantMessageContent,
          });
          addChatMessage({
            type: "message",
            role: "agent",
            content: [{ type: "output_text", text: assistantMessageContent }],
          });
          setSuggestedMessage(null);
          setSuggestedMessageDone(false);
          setAgentTyping(false);
        } else {
          if (parsed) {
            const id = generateId();
            const argStr = parsed.parameters
              ? JSON.stringify(parsed.parameters)
              : "";
            const toolCall: ToolCallItem = {
              type: "tool_call",
              tool_type: "function_call",
              status: "in_progress",
              id,
              name: parsed.name,
              arguments: argStr,
              parsedArguments: parsed.parameters ?? {},
              output: null,
            };
            chatMessages.push(toolCall);
            conversationItems.push({
              type: "function_call",
              role: "assistant",
              id,
              name: parsed.name,
              arguments: argStr,
            });
            setChatMessages([...chatMessages]);
            setConversationItems([...conversationItems]);
            setSuggestedMessage(null);
            setSuggestedMessageDone(true);
          } else {
            const { suggestedMessage } = useConversationStore.getState();
            if (!suggestedMessage && assistantMessageContent.trim()) {
              const message: ChatMessage = {
                type: "message",
                role: "agent",
                content: [
                  { type: "output_text", text: assistantMessageContent },
                ],
              };
              setSuggestedMessage(message);
            }
            setSuggestedMessageDone(true);
          }

          if (!parsed) {
            setAgentTyping(false);
          }
        }
        break;
      }

      case "response.output_item.added": {
        const { item } = data || {};
        // New item coming in
        if (!item || !item.type) {
          break;
        }

        // Handle differently depending on the item type
        switch (item.type) {
          case "function_call": {
            functionArguments += item.arguments || "";
            chatMessages.push({
              type: "tool_call",
              tool_type: "function_call",
              status: "in_progress",
              id: item.id,
              name: item.name, // function name,e.g. "get_weather"
              call_id: item.call_id,
              arguments: item.arguments || "",
              parsedArguments: {},
              output: null,
            });
            setChatMessages([...chatMessages]);
            break;
          }
          case "web_search_call": {
            chatMessages.push({
              type: "tool_call",
              tool_type: "web_search_call",
              status: item.status || "in_progress",
              id: item.id,
            });
            setChatMessages([...chatMessages]);
            break;
          }
          case "file_search_call": {
            setRelevantArticlesLoading(true);
            setRelevantArticlesError(null);
            chatMessages.push({
              type: "tool_call",
              tool_type: "file_search_call",
              status: item.status || "in_progress",
              id: item.id,
            });
            setChatMessages([...chatMessages]);
            break;
          }
        }
        break;
      }

      case "response.function_call_arguments.delta": {
        // Streaming arguments delta to show in the chat
        functionArguments += data.delta || "";
        let parsedFunctionArguments = {};
        if (functionArguments.length > 0) {
          parsedFunctionArguments = parse(functionArguments);
        }

        const toolCallMessage = chatMessages.find((m) => m.id === data.item_id);
        if (toolCallMessage && toolCallMessage.type === "tool_call") {
          toolCallMessage.arguments = functionArguments;
          try {
            toolCallMessage.parsedArguments = parsedFunctionArguments;
          } catch {
            // partial JSON can fail parse; ignore
          }
          setChatMessages([...chatMessages]);
        }
        break;
      }

      case "response.function_call_arguments.done": {
        // This has the full final arguments string
        const { item_id, arguments: finalArgs } = data;

        functionArguments = finalArgs;

        // Mark the tool_call as "completed" and parse the final JSON
        const toolCallMessage = chatMessages.find((m) => m.id === item_id);
        if (toolCallMessage && toolCallMessage.type === "tool_call") {
          toolCallMessage.arguments = finalArgs;
          toolCallMessage.parsedArguments = parse(finalArgs);
          toolCallMessage.status = "completed";
          setChatMessages([...chatMessages]);

          if (
            toolCallMessage.name &&
            agentTools.includes(toolCallMessage.name) &&
            !autoReply
          ) {
            setRecommendedActions([
              ...recommendedActions.filter(
                (action) => action.name !== toolCallMessage.name
              ),
              {
                name: toolCallMessage.name as keyof typeof functionsMap,
                parameters: toolCallMessage.parsedArguments,
              },
            ]);
          }
        }
        break;
      }

      case "response.web_search_call.completed": {
        const { item_id, output } = data;
        const toolCallMessage = chatMessages.find((m) => m.id === item_id);
        if (toolCallMessage && toolCallMessage.type === "tool_call") {
          toolCallMessage.output = output;
          toolCallMessage.status = "completed";
          setChatMessages([...chatMessages]);
        }
        break;
      }

      case "response.file_search_call.results": {
        const provider = useConversationStore.getState().modelProvider;

        setFAQExtracts(data.results, provider);
        setRelevantArticlesLoading(false);
        setRelevantArticlesError(null);
        break;
      }

      case "response.file_search_call.completed": {
        const { item_id } = data;
        console.log("file search call completed", data);
        const toolCallMessage = chatMessages.find((m) => m.id === item_id);
        if (toolCallMessage && toolCallMessage.type === "tool_call") {
          toolCallMessage.status = "completed";
          setChatMessages([...chatMessages]);
        }
        break;
      }

      case "response.output_item.done": {
        // After output item is done, adding tool call ID
        const { item } = data || {};

        const text = Array.isArray(item.content)
          ? item.content
              .map((c: any) => (typeof c === "string" ? c : c.text || ""))
              .join(" ")
          : String(item.content ?? "");

        if (
          item?.type === "message" &&
          item.role === "assistant" &&
          !text.trim()
        ) {
          // ignore empty assistant messages
          break;
        }

        conversationItems.push({
          ...item,
          // results: undefined,
        });

        if (item.type === "function_call") {
          const toolCallMessage = chatMessages.find((m) => m.id === item.id);
          if (toolCallMessage && toolCallMessage.type === "tool_call") {
            // Handle tool call
            const execMode =
              autoReply &&
              toolCallMessage.name &&
              agentTools.includes(toolCallMessage.name)
                ? "execute"
                : "suggestion";

            // Show typing indicator while executing the tool
            setAgentTyping(true);
            const toolResult = await handleTool(
              toolCallMessage.name as keyof typeof functionsMap,
              toolCallMessage.parsedArguments,
              execMode,
              modelProvider
            );
            toolCallMessage.call_id = item.call_id;
            toolCallMessage.output = JSON.stringify(toolResult);
            setChatMessages([...chatMessages]);
            conversationItems.push({
              type: "function_call_output",
              call_id: toolCallMessage.call_id,
              status: "completed",
              output: JSON.stringify(toolResult),
            });

            if (execMode === "execute" && toolCallMessage.name) {
              removeRecommendedAction(toolCallMessage.name);
            }

            // Persist conversation items before creating a new turn
            setConversationItems([...conversationItems]);

            // Create another turn after tool output has been added
            await processMessages();
          }
        }

        if (item.type === "file_search_call") {
          const provider = useConversationStore.getState().modelProvider;
          setFAQExtracts(item.results, provider);
          setRelevantArticlesLoading(false);
          setRelevantArticlesError(null);
        }

        setConversationItems([...conversationItems]);

        break;
      }

      case "error": {
        const { message } = data;
        addConversationItem({ role: "assistant", content: message });
        addChatMessage({
          type: "message",
          role: "agent",
          content: [{ type: "output_text", text: message }],
        });
        setRelevantArticlesError(message);
        setRelevantArticlesLoading(false);
        setSuggestedMessage(null);
        setSuggestedMessageDone(false);
        setAgentTyping(false);
        break;
      }

      // Handle other events as needed
    }
  },
  modelProvider,
  activeTools as any,
  tokenModel);
};
