"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { useToastStore } from "@/stores/useToastStore";
import { useSessionStore } from "@/stores/useSessionStore";

export function useLogout() {
  const router = useRouter();
  const clearSession = useSessionStore((state) => state.clearSession);
  const [loggingOut, setLoggingOut] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    clearSession();
    router.replace("/login");
    router.refresh();

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.warn("Logout request failed", error);
      addToast({
        title: "Logout incomplete",
        description: "We could not confirm logout, but your session was cleared locally.",
        variant: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  }, [addToast, clearSession, loggingOut, router]);

  return { logout, loggingOut };
}
