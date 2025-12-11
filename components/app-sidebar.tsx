"use client";

import * as React from "react";
import {
  BotIcon,
  FileQuestionIcon,
  LayoutDashboardIcon,
  ListIcon,
  NetworkIcon,
  SettingsIcon,
  UserRoundSearchIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSessionStore } from "@/stores/useSessionStore";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userId, roles, verified } = useSessionStore();

  const navMain = React.useMemo(
    () => [
      { title: "Dashboard", url: "/", icon: LayoutDashboardIcon },
      { title: "Scrape jobs", url: "/scrape_jobs", icon: ListIcon },
      { title: "Knowledge base", url: "http://localhost:3000", icon: UserRoundSearchIcon },
      { title: "Initialization", url: "/init_vs", icon: NetworkIcon },
      { title: "Admin", url: "/admin", icon: UsersIcon },
    ],
    []
  );

  const documents = React.useMemo(
    () => [
      { name: "FAQs", url: "http://localhost:3000", icon: FileQuestionIcon },
      { name: "Agent handbook", url: "http://localhost:3000", icon: BotIcon },
      { name: "Support surface", url: "/", icon: LayoutDashboardIcon },
    ],
    []
  );

  const secondary = React.useMemo(
    () => [
      { title: "FAQ", url: "http://localhost:3000", icon: SettingsIcon },
      { title: "Current session", url: "http://localhost:3000", icon: NetworkIcon },
    ],
    []
  );

  const user = {
    name: userId ?? "Guest",
    email: verified ? "Session verified" : "Awaiting verification",
    avatar: "/openai_logo.svg",
    roles: roles ?? [],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <LayoutDashboardIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Support Ops</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        <NavSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
