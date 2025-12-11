"use client";

import { Clock4Icon, GaugeIcon, MessageSquareIcon, ShieldCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgentRole } from "@/lib/generated/prisma";

type SectionCardsProps = {
  stats: {
    userId?: string;
    verified?: boolean;
    roles?: AgentRole[];
    expiresAt?: string;
    messageCount: number;
    pendingMessages: number;
    autoReply: boolean;
    modelProvider: string;
  };
};

function SessionSummary({ userId, verified, roles, expiresAt }: SectionCardsProps["stats"]) {
  const expiryDate = expiresAt ? new Date(expiresAt) : null;
  const expiryLabel = expiryDate && !Number.isNaN(expiryDate.getTime())
    ? `Session expires at ${expiryDate.toLocaleTimeString()}`
    : "Active session window";

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Session</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold">
          {userId ?? "Not signed in"}
        </CardTitle>
        <div className="absolute right-4 top-4 flex flex-wrap gap-2">
          <Badge variant={verified ? "default" : "outline"} className="rounded-lg text-xs">
            {verified ? "Verified" : "Pending"}
          </Badge>
          {(roles ?? []).map((role) => (
            <Badge key={role} variant="secondary" className="rounded-lg text-xs capitalize">
              {role}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
        {expiryLabel}
      </CardFooter>
    </Card>
  );
}

function MessageSummary({ messageCount, pendingMessages }: Pick<SectionCardsProps["stats"], "messageCount" | "pendingMessages">) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Conversation load</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {messageCount}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex items-center gap-1 rounded-lg text-xs">
            <MessageSquareIcon className="size-3" />
            {pendingMessages} pending
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
        <div className="line-clamp-1 flex gap-2 font-medium text-foreground">
          Live chat history retained across views
        </div>
        <div>Latest messages surface automatically in the activity feed.</div>
      </CardFooter>
    </Card>
  );
}

function ModelSummary({ autoReply, modelProvider }: Pick<SectionCardsProps["stats"], "autoReply" | "modelProvider">) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Assistant settings</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums capitalize">
          {modelProvider}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant={autoReply ? "outline" : "secondary"} className="flex gap-1 rounded-lg text-xs">
            <GaugeIcon className="size-3" />
            {autoReply ? "Auto-reply on" : "Manual only"}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
        <div className="line-clamp-1 flex gap-2 font-medium text-foreground">
          Controls mirror the agent workspace settings
        </div>
        <div>Switch providers from the agent tools panel as needed.</div>
      </CardFooter>
    </Card>
  );
}

function StabilitySummary() {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Handoff health</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">Healthy</CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <ShieldCheckIcon className="size-3" />
            synced
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
        <div className="line-clamp-1 flex gap-2 font-medium text-foreground">
          Case context synced between customer and agent panes
        </div>
        <div className="flex items-center gap-2">
          <Clock4Icon className="size-4" />
          Zero re-auth prompts detected in this session.
        </div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <SessionSummary {...stats} />
      <MessageSummary messageCount={stats.messageCount} pendingMessages={stats.pendingMessages} />
      <ModelSummary autoReply={stats.autoReply} modelProvider={stats.modelProvider} />
      <StabilitySummary />
    </div>
  );
}
