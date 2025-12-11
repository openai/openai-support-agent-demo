const raw = process.env.AGENT_TOKENS;
interface AgentTokenMap {
  [agentId: number]: string;
}

let agentTokens: AgentTokenMap = {};

if (raw) {
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    agentTokens = Object.fromEntries(
      Object.entries(parsed).map(([id, token]) => [Number(id), token])
    ) as AgentTokenMap;
  } catch (err) {
    console.warn("Failed to parse AGENT_TOKENS env variable", err);
  }
}

export function getAgentToken(agentId: number): string | undefined {
  return agentTokens[agentId];
}

export { agentTokens };
