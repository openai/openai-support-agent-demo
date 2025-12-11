import type { AgentRole } from "@/lib/generated/prisma";

export function defaultRouteForRoles(roles: AgentRole[] | undefined | null) {
  if (roles?.includes("admin")) return "/admin";
  if (roles?.includes("agent")) return "/agent";
  return "/login";
}
