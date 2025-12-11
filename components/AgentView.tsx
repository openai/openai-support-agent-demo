"use client";
import React from "react";
import useConversationStore from "@/stores/useConversationStore";
import { Item } from "@/lib/assistant";
import ContextPanel from "./ContextPanel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Info } from "lucide-react";
import Chat from "./Chat";
import { Switch } from "./ui/switch";
import HandoffStrategyToggle from "./HandoffStrategyToggle";

export default function AgentView() {
  const {
    chatMessages,
    addConversationItem,
    addChatMessage,
    addPendingMessage,
    autoReply,
    setAutoReply,
    modelProvider,
    setModelProvider,
    ollamaModel,
    setOllamaModel,
  } = useConversationStore();

  const [availableModels, setAvailableModels] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("/api/ollama/models");
        const data = await res.json();
        const names = Array.isArray(data?.models)
          ? data.models.map((m: any) => m.name)
          : [];
        setAvailableModels(names);
      } catch (err) {
        console.error("Failed to fetch models", err);
      }
    };
    if (modelProvider === "ollama" || modelProvider === "ollama-openai") {
      fetchModels();
    }
  }, [modelProvider]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const agentItem: Item = {
      type: "message",
      role: "agent",
      content: [{ type: "input_text", text: message.trim() }],
    };
    const agentMessage: any = {
      role: "assistant",
      content: message.trim(),
    };

    addConversationItem(agentMessage);
    addChatMessage(agentItem);
    addPendingMessage(agentMessage);
  };

  return (
    <div className="relative flex flex-1 min-h-0 bg-white rounded-lg p-4 gap-4">
      <div className="absolute top-4 left-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Auto reply</span>
          <Switch
            checked={autoReply}
            onCheckedChange={setAutoReply}
            mode="custom"
          />
        </div>
        <select
          className="text-xs border rounded p-1"
          value={modelProvider}
          onChange={(e) => setModelProvider(e.target.value)}
        >
          <option value="openai">OpenAI</option>
          <option value="ollama">Ollama</option>
          <option value="ollama-openai">Ollama (OpenAI compat)</option>
        </select>
        {(modelProvider === "ollama" || modelProvider === "ollama-openai") && (
          <select
            className="text-xs border rounded p-1"
            value={ollamaModel}
            onChange={(e) => setOllamaModel(e.target.value)}
          >
            {availableModels.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
        <HandoffStrategyToggle />
      </div>
      <div className="w-full md:w-3/5">
        <Chat
          items={chatMessages}
          view="agent"
          onSendMessage={handleSendMessage}
        />
      </div>

      <div className="hidden md:block md:w-2/5">
        <ContextPanel className="h-full" />
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <button
            className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-md border bg-white px-2 py-1 text-xs font-medium text-muted-foreground shadow-sm transition hover:border-primary hover:text-primary md:hidden"
            aria-label="Open context panel"
          >
            <Info className="h-4 w-4" />
            Customer details
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-sm">Case Context</DrawerTitle>
          </DrawerHeader>
          <div className="px-2 pb-10 flex flex-col h-[75vh]">
            <ContextPanel className="flex-1 overflow-y-auto h-[50vh]" />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
