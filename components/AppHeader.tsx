"use client";

import { usePathname } from "next/navigation";

import { useLogout } from "@/lib/client/useLogout";
import { useSessionStore } from "@/stores/useSessionStore";

export default function AppHeader() {
  const pathname = usePathname();
  const userId = useSessionStore((state) => state.userId);
  const verified = useSessionStore((state) => state.verified);
  const { logout, loggingOut } = useLogout();

  if (!userId || !verified || pathname === "/login") {
    return null;
  }

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">Signed in as <span className="font-semibold">{userId}</span></div>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-700 disabled:opacity-60"
        >
          {loggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}
