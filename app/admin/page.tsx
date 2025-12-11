"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppPageShell } from "@/components/app-page-shell";

import { authFetch } from "@/lib/client/authFetch";
import { defaultRouteForRoles } from "@/lib/auth/routes";
import type { AgentRole } from "@/lib/generated/prisma";
import { useToastStore } from "@/stores/useToastStore";
import { useSessionStore } from "@/stores/useSessionStore";

interface AgentAccountRow {
  userId: string;
  roles: AgentRole[];
  telegramChatId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const csrfToken = useSessionStore((state) => state.csrfToken);
  const roles = useSessionStore((state) => state.roles);
  const addToast = useToastStore((state) => state.addToast);
  const [agents, setAgents] = useState<AgentAccountRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [newUserId, setNewUserId] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newRoles, setNewRoles] = useState<AgentRole[]>(["agent"]);
  const [newTelegramChatId, setNewTelegramChatId] = useState("");

  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const defaultRedirect = useMemo(() => defaultRouteForRoles(roles), [roles]);

  useEffect(() => {
    if (!csrfToken) return;
    const loadAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authFetch("/api/admin/agents", {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          setError("Unable to load agents");
          return;
        }
        const data = (await response.json()) as { agents: AgentAccountRow[] };
        setAgents(data.agents);
      } catch (err) {
        console.error("Failed to fetch agents", err);
        setError("Failed to fetch agents.");
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, [csrfToken]);

  if (!roles) {
    return (
      <AppPageShell>
        <div className="p-6">
          <p className="text-sm text-muted-foreground">Checking your access…</p>
        </div>
      </AppPageShell>
    );
  }

  const toggleRole = (
    selected: AgentRole,
    rolesList: AgentRole[],
    setter: (roles: AgentRole[]) => void
  ) => {
    const exists = rolesList.includes(selected);
    const updated = exists ? rolesList.filter((role) => role !== selected) : [...rolesList, selected];
    setter(updated);
  };

  const createAgent = async () => {
    setSavingUserId("__new__");
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await authFetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newUserId,
          pin: newPin,
          roles: newRoles,
          telegramChatId: newTelegramChatId || null,
        }),
      });
      if (!response.ok) {
        setError("Unable to create agent. Please check the fields and try again.");
        return;
      }
      const data = (await response.json()) as { agent: AgentAccountRow };
      setAgents((prev) => [...prev, data.agent]);
      setNewUserId("");
      setNewPin("");
      setNewRoles(["agent"]);
      setNewTelegramChatId("");
      setSuccessMessage("Agent created successfully.");
      addToast({ title: "Agent created", description: `${data.agent.userId} is ready to sign in.`, variant: "success" });
    } catch (err) {
      console.error("Failed to create agent", err);
      setError("Unexpected error while creating the agent.");
      addToast({ title: "Unable to create agent", variant: "error" });
    } finally {
      setSavingUserId(null);
    }
  };

  const updateAgent = async (
    agent: AgentAccountRow,
    updates: { roles?: AgentRole[]; telegramChatId?: string | null; pin?: string }
  ) => {
    setSavingUserId(agent.userId);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await authFetch(`/api/admin/agents/${agent.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        setError("Unable to update agent. Please try again.");
        return;
      }
      const data = (await response.json()) as { agent: AgentAccountRow };
      setAgents((prev) => prev.map((row) => (row.userId === agent.userId ? data.agent : row)));
      setSuccessMessage("Agent updated.");
      addToast({ title: "Agent updated", description: `${agent.userId} changes saved.`, variant: "success" });
    } catch (err) {
      console.error("Failed to update agent", err);
      setError("Unexpected error while updating the agent.");
      addToast({ title: "Unable to update agent", variant: "error" });
    } finally {
      setSavingUserId(null);
    }
  };

  const deleteAgent = async (userId: string) => {
    const confirmed = window.confirm(`Delete ${userId}? This cannot be undone.`);
    if (!confirmed) return;
    setDeletingUserId(userId);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await authFetch(`/api/admin/agents/${userId}`, { method: "DELETE" });
      if (!response.ok) {
        setError("Unable to delete agent.");
        addToast({ title: "Unable to delete agent", variant: "error" });
        return;
      }
      setAgents((prev) => prev.filter((agent) => agent.userId !== userId));
      addToast({ title: "Agent deleted", description: `${userId} was removed.`, variant: "success" });
    } catch (err) {
      console.error("Failed to delete agent", err);
      setError("Unexpected error while deleting the agent.");
      addToast({ title: "Delete failed", variant: "error" });
    } finally {
      setDeletingUserId(null);
    }
  };

  if (!csrfToken) {
    return (
      <AppPageShell>
        <div className="p-6">
          <p className="rounded bg-destructive/10 p-4 text-destructive">Missing CSRF token. Please re-authenticate.</p>
        </div>
      </AppPageShell>
    );
  }

  if (roles && !roles.includes("admin")) {
    return (
      <AppPageShell>
        <div className="p-6">
          <p className="rounded bg-destructive/10 p-4 text-destructive">
            You do not have permission to view this page. Return to {" "}
            <Link className="font-semibold underline" href={defaultRedirect}>
              {defaultRedirect}
            </Link>
            .
          </p>
        </div>
      </AppPageShell>
    );
  }

  return (
    <AppPageShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Quick links to core tools plus agent management. All actions reuse your current authenticated session.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[{ label: "Messaging", href: "/", description: "Open the messaging UI" },
          { label: "Vector Store", href: "/init_vs", description: "Initialize or rebuild embeddings" },
          { label: "Scrape Jobs", href: "/scrape_jobs", description: "Manage and monitor scrapers" }].map(
          (entry) => (
            <Link
              key={entry.href}
              className="rounded border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-gray-400"
              href={entry.href}
            >
              <div className="text-lg font-semibold text-gray-900">{entry.label}</div>
              <p className="text-sm text-gray-600">{entry.description}</p>
            </Link>
          )
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Agent Accounts</h2>
        <p className="text-sm text-gray-600">
          Create new agents or update existing accounts. All actions are protected with CSRF.
        </p>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 p-3 rounded">{error}</p>}
      {successMessage && (
        <p className="text-sm text-green-700 bg-green-50 p-3 rounded">{successMessage}</p>
      )}

      <section className="border rounded p-4 space-y-3 bg-white shadow-sm">
        <h2 className="text-lg font-semibold">Create Agent</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col text-sm">
            User ID
            <input
              className="border rounded p-2 mt-1"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="Unique agent user ID"
            />
          </label>
          <label className="flex flex-col text-sm">
            PIN
            <input
              className="border rounded p-2 mt-1"
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Temporary PIN"
            />
          </label>
          <div className="flex flex-col text-sm">
            Roles
            <div className="flex gap-3 mt-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={newRoles.includes("agent")}
                  onChange={() => toggleRole("agent", newRoles, setNewRoles)}
                />
                Agent
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={newRoles.includes("admin")}
                  onChange={() => toggleRole("admin", newRoles, setNewRoles)}
                />
                Admin
              </label>
            </div>
          </div>
          <label className="flex flex-col text-sm">
            Telegram Chat ID (optional)
            <input
              className="border rounded p-2 mt-1"
              value={newTelegramChatId}
              onChange={(e) => setNewTelegramChatId(e.target.value)}
              placeholder="Telegram chat ID"
            />
          </label>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={createAgent}
          disabled={savingUserId !== null}
        >
          {savingUserId === "__new__" ? "Creating..." : "Create Agent"}
        </button>
      </section>

      <section className="border rounded p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Existing Agents</h2>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
        <div className="space-y-3">
          {agents.map((agent) => (
            <AgentRow
              key={agent.userId}
              agent={agent}
              onSave={updateAgent}
              onDelete={deleteAgent}
              saving={savingUserId === agent.userId}
              deleting={deletingUserId === agent.userId}
              toggleRole={toggleRole}
            />
          ))}
          {!loading && agents.length === 0 && (
            <p className="text-sm text-gray-600">No agents found yet.</p>
          )}
        </div>
      </section>
      </div>
    </AppPageShell>
  );
}

function AgentRow({
  agent,
  onSave,
  onDelete,
  saving,
  deleting,
  toggleRole,
}: {
  agent: AgentAccountRow;
  onSave: (
    agent: AgentAccountRow,
    updates: { roles?: AgentRole[]; telegramChatId?: string | null; pin?: string }
  ) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
  saving: boolean;
  deleting: boolean;
  toggleRole: (
    selected: AgentRole,
    rolesList: AgentRole[],
    setter: (roles: AgentRole[]) => void
  ) => void;
}) {
  const [roles, setRoles] = useState<AgentRole[]>(agent.roles);
  const [telegramChatId, setTelegramChatId] = useState(agent.telegramChatId ?? "");
  const [pin, setPin] = useState("");

  return (
    <div className="border rounded p-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">{agent.userId}</p>
          <p className="text-xs text-gray-500">
            Updated {new Date(agent.updatedAt).toLocaleString()} | Created {new Date(agent.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-sm">
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={roles.includes("agent")}
                onChange={() => toggleRole("agent", roles, setRoles)}
              />
              Agent
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={roles.includes("admin")}
                onChange={() => toggleRole("admin", roles, setRoles)}
              />
              Admin
            </label>
          </div>
          <div className="flex flex-col text-xs">
            <label>Telegram Chat ID</label>
            <input
              className="border rounded p-1 text-sm"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="flex flex-col text-xs">
            <label>Reset PIN</label>
            <input
              className="border rounded p-1 text-sm"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="New PIN"
            />
          </div>
          <button
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm hover:bg-gray-900 disabled:opacity-50"
            onClick={() =>
              onSave(agent, {
                roles,
                telegramChatId: telegramChatId || null,
                pin: pin || undefined,
              })
            }
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
            onClick={() => onDelete(agent.userId)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
