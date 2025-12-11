"use client";

import { useState, type FormEvent } from "react";

export default function OnboardingForm() {
  const [userId, setUserId] = useState("");
  const [pin, setPin] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/bootstrap-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          pin,
          telegramChatId: telegramChatId || null,
          secret,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Unable to create the first admin account.");
        return;
      }

      setSuccess("Admin account created. You can now log in.");
      setUserId("");
      setPin("");
      setSecret("");
      setTelegramChatId("");
    } catch (submitError) {
      console.error("Failed to bootstrap admin", submitError);
      setError("Unexpected error while creating the admin account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 px-4 py-10">
      <div className="w-full max-w-xl rounded-lg bg-white/95 p-8 shadow-lg backdrop-blur">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Initialize Admin Access</h1>
          <p className="text-sm text-gray-600">
            No agent accounts were found. Create the first account to unlock the app. This setup is automatically
            disabled after the first account is created.
          </p>
        </div>

        {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">{success}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Bootstrap Secret
            <input
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Shared secret from the environment"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Admin User ID
            <input
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Choose a unique user identifier"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Admin PIN
            <input
              required
              type="password"
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Enter a secure PIN"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Telegram Chat ID (optional)
            <input
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Connect Telegram notifications"
              value={telegramChatId}
              onChange={(event) => setTelegramChatId(event.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Creating admin account..." : "Create admin account"}
          </button>
        </form>
      </div>
    </div>
  );
}
