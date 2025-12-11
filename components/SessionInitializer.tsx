"use client";

import { useEffect } from "react";

import { AgentRole } from "@/lib/generated/prisma";
import { useSessionStore } from "@/stores/useSessionStore";

export default function SessionInitializer() {
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          clearSession();
          return;
        }
        const data = (await response.json()) as {
          userId: string;
          roles: AgentRole[] | string[];
          verified: boolean;
          csrf: string;
          expiresAt?: string;
        };

        const roles = Array.isArray(data.roles) ? (data.roles as (AgentRole | string)[]) : [];
        const normalizedRoles: AgentRole[] = roles.filter((role): role is AgentRole =>
          Object.values(AgentRole).includes(role as AgentRole)
        );
        if (!cancelled) {
          setSession({
            userId: data.userId,
            roles: normalizedRoles,
            verified: data.verified,
            csrfToken: data.csrf,
            expiresAt: data.expiresAt,
          });
        }
      } catch (error) {
        console.warn("Failed to hydrate session", error);
        if (!cancelled) clearSession();
      }
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [clearSession, setSession]);

  return null;
}
