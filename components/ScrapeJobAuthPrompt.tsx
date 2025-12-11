"use client";

import { Loader2, Lock } from "lucide-react";
import type { FormEvent } from "react";

export function ScrapeJobAuthPrompt({
  token,
  busy,
  error,
  onTokenChange,
  onSubmit,
  description,
}: {
  token: string;
  busy: boolean;
  error: string | null;
  description?: string;
  onTokenChange: (value: string) => void;
  onSubmit: (event?: FormEvent) => void;
}) {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-zinc-600" />
          <div>
            <div className="text-lg font-semibold text-zinc-900">Admin access required</div>
            <div className="text-sm text-zinc-600">
              {description ?? "Enter the admin token to manage scrape jobs."}
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : null}

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(event);
          }}
        >
          <label className="text-sm text-zinc-700 space-y-1 block">
            <span>Admin token</span>
            <input
              type="password"
              value={token}
              onChange={(event) => onTokenChange(event.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B83F6]"
              placeholder="Enter token"
              autoComplete="off"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#2B83F6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d6ccd] disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : null}
            {busy ? "Signing in…" : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
