import { create } from "zustand";
import type { AgentRole } from "@/lib/generated/prisma";

export type SessionDetails = {
  userId: string;
  verified: boolean;
  roles: AgentRole[];
  csrfToken: string | null;
  expiresAt?: string;
};

interface SessionState extends Partial<SessionDetails> {
  setSession: (session: SessionDetails) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  userId: undefined,
  verified: undefined,
  roles: undefined,
  csrfToken: null,
  expiresAt: undefined,
  setSession: (session) =>
    set({
      userId: session.userId,
      verified: session.verified,
      roles: session.roles,
      csrfToken: session.csrfToken,
      expiresAt: session.expiresAt,
    }),
  clearSession: () =>
    set({ userId: undefined, verified: undefined, roles: undefined, csrfToken: null, expiresAt: undefined }),
}));

export const sessionStore = useSessionStore;
