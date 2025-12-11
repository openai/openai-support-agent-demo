"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ComponentType } from "react";
import {
  Database,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  MessageCircle,
  Shield,
} from "lucide-react";

import { useLogout } from "@/lib/client/useLogout";
import type { AgentRole } from "@/lib/generated/prisma";
import { useSessionStore } from "@/stores/useSessionStore";

interface NavItem {
  href: string;
  label: string;
  roles: AgentRole[];
  icon: ComponentType<{ className?: string }>;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Messaging", roles: ["agent", "admin"], icon: MessageCircle },
  { href: "/agent", label: "Agent Dashboard", roles: ["agent", "admin"], icon: LayoutDashboard },
  { href: "/admin", label: "Admin", roles: ["admin"], icon: Shield },
  { href: "/init_vs", label: "Vector Store", roles: ["admin"], icon: Database },
  { href: "/scrape_jobs", label: "Scrape Jobs", roles: ["admin"], icon: ListChecks },
];

function VisibleNavItems(roles: AgentRole[] | undefined) {
  return NAV_ITEMS.filter((item) => item.roles.some((role) => roles?.includes(role)));
}

function NavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: NavItem["icon"]; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-gray-200 ${
        active ? "bg-gray-200 text-gray-900" : "text-gray-700"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default function SidebarNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, loggingOut } = useLogout();
  const userId = useSessionStore((state) => state.userId);
  const verified = useSessionStore((state) => state.verified);
  const roles = useSessionStore((state) => state.roles);

  const hiddenOnRoutes = useMemo(
    () => pathname.startsWith("/login") || pathname.startsWith("/onboarding"),
    [pathname]
  );

  const navItems = useMemo(() => VisibleNavItems(roles), [roles]);

  if (!userId || !verified || hiddenOnRoutes || navItems.length === 0) {
    return null;
  }

  const navContent = (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">Workspace</p>
        <p className="text-sm font-semibold text-gray-900">{userId}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} />
        ))}
      </nav>
      <button
        type="button"
        disabled={loggingOut}
        onClick={logout}
        className="flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Signing out…" : "Logout"}
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
        Menu
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="flex h-full w-72 flex-col bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Home className="h-4 w-4" /> Navigation
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                ✕
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}

      <aside className="hidden h-screen w-64 shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col md:shadow-sm">
        {navContent}
      </aside>
    </>
  );
}
