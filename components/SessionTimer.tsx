"use client";
import { useEffect, useRef } from "react";
import useConversationStore from "@/stores/useConversationStore";
import useDataStore from "@/stores/useDataStore";

const TIMEOUT_MS = 4 * 60 * 1000;

export default function SessionTimer() {
  const chatMessages = useConversationStore((s) => s.chatMessages);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        const { pendingMessages, clearPendingMessages } =
          useConversationStore.getState();
        const { sessionId, contactId } =
          useDataStore.getState() as any;
        if (sessionId) {
          try {
            await fetch(`/api/sessions/${sessionId}/end`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: pendingMessages,
                identifier: contactId,
              }),
            });
            clearPendingMessages();
          } catch (err) {
            console.error("Failed to end session", err);
          }
        }
      }, TIMEOUT_MS);
    };

    reset();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [chatMessages]);

  return null;
}
