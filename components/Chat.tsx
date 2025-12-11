"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ToolCall from "./ToolCall";
import Message from "./Message";
import Annotations from "./Annotations";
import type { Item, ChatMessage } from "@/lib/assistant";
import useConversationStore from "@/stores/useConversationStore";
import { SendIcon, PencilIcon } from "lucide-react";

interface ChatProps {
  items: Item[];
  view: "user" | "agent";
  onSendMessage: (message: string) => void;
}

function TypingIndicatorDot({
  delay,
  color,
}: {
  delay: string;
  color: string;
}) {
  return (
    <span
      className={`w-1 h-1 rounded-full animate-bounce ${color}`}
      style={{ animationDelay: delay }}
    />
  );
}

function TypingIndicator({ sender }: { sender: "user" | "agent" }) {
  const color = sender === "user" ? "bg-zinc-900" : "bg-zinc-900";
  return (
    <div
      className={`flex mb-5 ${sender === "user" ? "justify-start" : "justify-start"
        }`}
    >
      <div
        className={`flex gap-1 items-center rounded-[16px] px-4 py-3 ${sender === "user"
          ? "text-zinc-900 bg-[#ECECF1] mr-4 md:mr-24 rounded-bl-[4px]"
          : "text-zinc-900 bg-[#ECECF1] mr-4 md:mr-24 rounded-bl-[4px]"
          }`}
      >
        <TypingIndicatorDot delay="0s" color={color} />
        <TypingIndicatorDot delay="0.2s" color={color} />
        <TypingIndicatorDot delay="0.4s" color={color} />
      </div>
    </div>
  );
}

export default function Chat({ items, view, onSendMessage }: ChatProps) {
  const itemsEndRef = useRef<HTMLDivElement>(null);

  const [inputMessageText, setInputMessageText] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const setUserTyping = useConversationStore((s) => s.setUserTyping);
  const setAgentTyping = useConversationStore((s) => s.setAgentTyping);
  const userTyping = useConversationStore((s) => s.userTyping);
  const agentTyping = useConversationStore((s) => s.agentTyping);

  const suggestedMessage = useConversationStore(
    (s) => s.suggestedMessage
  ) as ChatMessage | null;
  const setSuggestedMessage = useConversationStore(
    (s) => s.setSuggestedMessage
  );
  const suggestedMessageDone = useConversationStore(
    (s) => s.suggestedMessageDone
  );
  const composerText = useConversationStore((s) => s.composerText);
  const setComposerText = useConversationStore((s) => s.setComposerText);
  const autoReply = useConversationStore((s) => s.autoReply);

  useEffect(() => {
    itemsEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [items, suggestedMessage]);

  useEffect(() => {
    const typing =
      isComposing ||
      (isFocused &&
        (view === "agent" ? composerText.length : inputMessageText.length) > 0);

    if (view === "user") {
      setUserTyping(typing);
    } else {
      setAgentTyping(typing);
    }
  }, [
    isComposing,
    isFocused,
    inputMessageText,
    composerText,
    view,
    setUserTyping,
    setAgentTyping,
  ]);

  const handleSendMessage = useCallback(() => {
    if (view === "agent") {
      if (!composerText.trim()) return;
      onSendMessage(composerText);
      setComposerText("");
    } else {
      if (!inputMessageText.trim()) return;
      onSendMessage(inputMessageText);
      setInputMessageText("");
    }
  }, [view, composerText, inputMessageText, onSendMessage, setComposerText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !isComposing) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage, isComposing]
  );

  const handleSendNow = useCallback(() => {
    if (!suggestedMessage) return;
    const text = suggestedMessage.content[0]?.text ?? "";
    onSendMessage(text);
    setSuggestedMessage(null);
    setAgentTyping(false);
  }, [suggestedMessage, onSendMessage, setSuggestedMessage, setAgentTyping]);

  const handleEdit = useCallback(() => {
    if (!suggestedMessage) return;
    const text = suggestedMessage.content[0]?.text ?? "";
    setComposerText(text);
    setSuggestedMessage(null);
    setAgentTyping(false);
  }, [suggestedMessage, setComposerText, setSuggestedMessage, setAgentTyping]);

  return (
    <div className="flex flex-col h-full max-w-[750px] mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 md:px-4 pt-4 pb-20">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.type === "tool_call" && view === "agent" ? (
              <ToolCall toolCall={item} />
            ) : item.type === "message" ? (
              <div className="flex flex-col gap-1 mb-5">
                <Message message={item} view={view} />
                {view === "agent" &&
                  item.content[0]?.annotations &&
                  item.content[0]?.annotations?.length > 0 && (
                    <Annotations annotations={item.content[0].annotations!} />
                  )}
              </div>
            ) : null}
          </React.Fragment>
        ))}

        {/* Suggested message + actions */}
        {view === "agent" && suggestedMessage && (
          <div className="flex flex-col gap-1 mb-5">
            <Message message={suggestedMessage} view={view} suggestion={true} />

            {suggestedMessageDone && !autoReply ? (
              <div className="flex justify-end text-xs mt-2">
                <div className="flex flex-col gap-1">
                  <div className="mt-2 flex gap-2">
                    <div
                      onClick={handleSendNow}
                      className="cursor-pointer flex items-center gap-1 px-3 py-1 font-medium rounded-md bg-[#2B83F6] text-white hover:bg-[#2B83F6]/90"
                    >
                      <SendIcon className="w-3 h-3" />
                      Send now
                    </div>
                    <div
                      onClick={handleEdit}
                      className="cursor-pointer flex items-center gap-1 px-3 py-1 font-medium rounded-md bg-[#2B83F6] text-white hover:bg-[#2B83F6]/90"
                    >
                      <PencilIcon className="w-3 h-3" />
                      Edit
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Typing indicators */}
        {view === "user" && agentTyping && <TypingIndicator sender="agent" />}
        {view === "agent" && userTyping && <TypingIndicator sender="user" />}

        <div ref={itemsEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 md:px-4">
        <div className="flex items-center">
          <div className="flex w-full items-center pb-4 md:pb-1">
            <div className="flex w-full flex-col gap-1.5 rounded-2xl p-2.5 pl-1.5 bg-white border border-stone-200 shadow-sm transition-colors">
              <div className="flex items-end gap-1.5 md:gap-2 pl-4">
                <div className="flex min-w-0 flex-1 flex-col">
                  <textarea
                    id="prompt-textarea"
                    tabIndex={0}
                    dir="auto"
                    rows={2}
                    placeholder="Message..."
                    className="mb-2 resize-none border-0 focus:outline-none text-sm bg-transparent px-0 pb-6 pt-2"
                    value={view === "agent" ? composerText : inputMessageText}
                    onChange={(e) =>
                      view === "agent"
                        ? setComposerText(e.target.value)
                        : setInputMessageText(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                  />
                </div>
                <button
                  disabled={
                    view === "agent"
                      ? !composerText.trim()
                      : !inputMessageText.trim()
                  }
                  data-testid="send-button"
                    className="flex h-8 w-8 items-end justify-center rounded-full bg-[#2B83F6] text-white hover:bg-[#2B83F6]/90 disabled:bg-gray-300 disabled:text-gray-400 transition-colors focus:outline-none"
                  onClick={handleSendMessage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 32 32"
                    className="icon-2xl"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
