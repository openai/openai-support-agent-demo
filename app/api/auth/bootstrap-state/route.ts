import { getAgentBootstrapState } from "@/lib/server/bootstrap";

export async function GET() {
  const state = await getAgentBootstrapState();
  return Response.json(state, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
