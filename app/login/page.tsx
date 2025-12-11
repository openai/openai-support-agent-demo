"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AgentRole } from "@/lib/generated/prisma";
import { defaultRouteForRoles } from "@/lib/auth/routes";
import { useSessionStore } from "@/stores/useSessionStore";

const POLL_INTERVAL_MS = 2500;

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [pin, setPin] = useState("");
  const [pending, setPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);
  const [chatConfigured, setChatConfigured] = useState<boolean | null>(null);
  const pollTimer = useRef<NodeJS.Timeout | null>(null);
  const setSession = useSessionStore((state) => state.setSession);
  const sessionRoles = useSessionStore((state) => state.roles);
  const sessionVerified = useSessionStore((state) => state.verified);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  const redirectTarget = useMemo(() => defaultRouteForRoles(sessionRoles), [sessionRoles]);

  useEffect(() => {
    if (sessionVerified && sessionRoles && redirectTarget && !pending) {
      router.replace(redirectTarget);
    }
  }, [pending, redirectTarget, router, sessionRoles, sessionVerified]);

  async function checkVerification() {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (response.status === 401) {
        setPending(false);
        setStatusMessage(null);
        setError("Session expired. Please try logging in again.");
        return;
      }
      if (response.status === 429) {
        setError("Too many status checks. Please wait a moment.");
        return;
      }
      if (!response.ok) {
        setError("Unable to check verification status.");
        return;
      }

      const data = (await response.json()) as {
        verified: boolean;
        roles: AgentRole[] | string[];
        userId: string;
        csrf: string;
        expiresAt?: string;
      };

      const roles = Array.isArray(data.roles) ? (data.roles as (AgentRole | string)[]) : [];
      const normalizedRoles: AgentRole[] = roles.filter((role): role is AgentRole =>
        Object.values(AgentRole).includes(role as AgentRole)
      );

      setSession({
        userId: data.userId,
        roles: normalizedRoles,
        verified: data.verified,
        csrfToken: data.csrf,
        expiresAt: data.expiresAt,
      });

      if (data.verified) {
        if (pollTimer.current) clearInterval(pollTimer.current);
        router.push(defaultRouteForRoles(normalizedRoles));
      }
    } catch (err) {
      console.error("Failed to poll session", err);
      setError("Could not reach the server. Please retry shortly.");
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatusMessage(null);
    setPending(false);
    setTelegramStatus(null);
    setChatConfigured(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      });

      if (response.status === 401) {
        setError("Invalid credentials. Please check your user ID and PIN.");
        return;
      }

      if (response.status === 429) {
        setError("Too many attempts. Please slow down and try again.");
        return;
      }

      if (response.status === 400) {
        setError("Please provide both a user ID and PIN.");
        return;
      }

      if (![200, 202].includes(response.status)) {
        setError("Login failed. Please try again.");
        return;
      }

      const data = (await response.json()) as {
        pending: boolean;
        chatConfigured: boolean;
        telegramDelivery?: { ok: boolean; reason?: string };
      };

      setPending(data.pending);
      setChatConfigured(data.chatConfigured);
      if (data.telegramDelivery && !data.telegramDelivery.ok) {
        setTelegramStatus(
          data.telegramDelivery.reason || "Unable to deliver the Telegram code."
        );
      } else if (data.chatConfigured) {
        setTelegramStatus("Telegram code sent. Please confirm to continue.");
      } else {
        setTelegramStatus("No Telegram chat is configured for this account.");
      }

      setStatusMessage(
        response.status === 202
          ? "Login started, but delivery is pending."
          : "Login started. Waiting for verification..."
      );

      if (data.pending) {
        checkVerification();
        pollTimer.current = setInterval(checkVerification, POLL_INTERVAL_MS);
      }
    } catch (err) {
      console.error("Login error", err);
      setError("Unexpected error during login. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow">
        <h1 className="text-2xl font-semibold mb-4">Agent Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={pending}
          >
            {pending ? "Waiting for verification..." : "Sign in"}
          </button>
        </form>
        {statusMessage && (
          <p className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded">
            {statusMessage}
          </p>
        )}
        {telegramStatus && (
          <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
            {telegramStatus}
          </p>
        )}
        {chatConfigured === false && (
          <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-3 rounded">
            Telegram chat is not configured for this account.
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
