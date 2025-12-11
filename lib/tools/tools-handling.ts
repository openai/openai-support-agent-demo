import { agentTools } from "@/config/tools-list";
import { functionsMap } from "../../config/functions";
import useConversationStore from "@/stores/useConversationStore";

export type ToolName = keyof typeof functionsMap;

export const handleTool = async (
  toolName: ToolName,
  parameters: any,
  mode = "suggestion",
  provider = "openai"
) => {
  console.log("Handle tool", toolName, parameters);
  // Show typing indicator while the tool executes
  try {
    useConversationStore.getState().setAgentTyping(true);
  } catch {
    // ignore if store is unavailable (e.g. during tests)
  }
  // These tools will be suggested as a "recommended action" to the human agent
  if (agentTools.includes(toolName)) {
    if (mode === "suggestion") {
      console.log("Suggesting action", toolName);
      return {
        response: `Tool ${toolName} has been suggested as a next step for the human agent. Wait for the assistant response confirming the action.`,
      };
    } else {
      console.log("Executing tool", toolName);
      const result = await functionsMap[toolName](parameters);
      console.log("Tool result", result);
      let processed = result;
      if (
        (provider === "ollama" || provider === "ollama-openai") &&
        toolName === "search_knowledge_base" &&
        result?.results
      ) {
        const context = result.results.map((r: any) => r.text ?? r);
        processed = { context, query: parameters.query };
      }
      return {
        result: processed,
        response: `Tool ${toolName} has been executed`,
      };
    }
  }
  // These tools will be automatically executed
  else {
    if (functionsMap[toolName]) {
      return await functionsMap[toolName](parameters);
    } else {
      throw new Error(`Unknown tool: ${toolName}`);
    }
  }
};
