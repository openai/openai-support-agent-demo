import {
  assignConversation,
  toggleConversationStatus,
  sendBotMessage,
} from "@/lib/chatwootBot";
import { getAgent, setAgentAvailability, updateConversation } from "@/lib/chatwoot";
import { storeBotMessage } from "@/lib/storeBotMessage";
import type { AgentAvailability } from "@/lib/agentRotation";

export async function handOff(
  accountId: number,
  conversationId: number,
  agentId: number,
  _role: "agent" | "administrator" = "agent"
): Promise<boolean> {
  void _role;
  let availabilityBeforeBusy: AgentAvailability | null = null;
  try {
    const agent = await getAgent(accountId, agentId);
    if (agent) {
      const status = (agent as any)?.availability_status;
      if (status === "online" || status === "busy" || status === "offline") {
        availabilityBeforeBusy = status;
      } else {
        console.warn("handoff availability snapshot unavailable", {
          accountId,
          conversationId,
          agentId,
          availability: status,
        });
      }
    } else {
      console.warn("handoff agent not found during availability snapshot", {
        accountId,
        conversationId,
        agentId,
      });
    }
  } catch (err) {
    console.error("handoff availability fetch error", err);
  }
  try {
    await toggleConversationStatus(accountId, conversationId, "open");
    await assignConversation(accountId, conversationId, agentId);
    await setAgentAvailability(accountId, agentId, "busy");
    return true;
  } catch (err) {
    console.error("handoff error", err);
    try {
      const availabilityToRestore = availabilityBeforeBusy ?? "online";
      if (availabilityBeforeBusy === null) {
        console.warn(
          "handoff rollback missing availability snapshot; defaulting to online",
          {
            accountId,
            conversationId,
            agentId,
          }
        );
      }
      await setAgentAvailability(
        accountId,
        agentId,
        availabilityToRestore
      );
    } catch (error) {
      console.error("rollback availability error", error);
    }
    try {
      await updateConversation(accountId, conversationId, {
        status: "pending",
        assignee_id: null,
      });
    } catch (error) {
      console.error("rollback conversation error", error);
    }
    try {
      const fallbackContent =
        "We're unable to connect you to a human agent right now. Please try again later.";
      const response = await sendBotMessage(
        accountId,
        conversationId,
        fallbackContent
      );
      await storeBotMessage({
        accountId,
        conversationId,
        payload: response,
        fallbackContent,
      });
    } catch (error) {
      console.error("send fallback message error", error);
    }
    return false;
  }
}

export default handOff;
