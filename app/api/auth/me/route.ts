import { requireSession } from "@/lib/server/auth";

export async function GET(request: Request) {
  const result = await requireSession(request, { requireVerified: false });
  if ("response" in result) return result.response;

  return new Response(
    JSON.stringify({
      authenticated: true,
      verified: result.session.verified,
      userId: result.session.agent.userId,
      roles: result.session.agent.roles,
      csrf: result.session.csrf,
      expiresAt: result.session.expiresAt,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
