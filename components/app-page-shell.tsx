"use client";

import * as React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface AppPageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppPageShell({ children, className = "" }: AppPageShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className={`flex flex-1 flex-col p-4 lg:p-6 ${className}`}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

