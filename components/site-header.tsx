"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import SessionTimer from "./SessionTimer";
import { useSessionStore } from "@/stores/useSessionStore";

export function SiteHeader() {
  const { userId, verified, roles } = useSessionStore();

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b bg-background/70 backdrop-blur transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
        <div className="flex flex-col">
          <h1 className="text-base font-medium">Support dashboard</h1>
          <p className="text-xs text-muted-foreground">Live assistant + human handoff workspace</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <SessionTimer />
          <Separator orientation="vertical" className="h-4" />
          <Badge variant={verified ? "default" : "outline"}>{verified ? "Verified" : "Awaiting verification"}</Badge>
          {userId && <Badge variant="secondary">{userId}</Badge>}
          {(roles ?? []).map((role) => (
            <Badge key={role} variant="outline" className="capitalize">
              {role}
            </Badge>
          ))}
        </div>
      </div>
    </header>
  );
}
