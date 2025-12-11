import { NextResponse } from "next/server";
import type {
  ChatwootEvent,
  ConversationStatusChangedPayload,
  ConversationUpdatedPayload,
} from "@/types/chatwoot";
import { releaseAgent } from "@/lib/conversationResolution";
import { CONVO_LABELS } from "@/lib/constants";
import { getAgent, setAgentAvailability } from "@/lib/chatwoot";
import {
  AgentAvailability,
  clearActiveConversation,
  setActiveConversation,
} from "@/lib/agentRotation";
import {
  recordReleaseFailure,
  clearReleaseAttempts,
} from "@/lib/releaseAttempts";
import { notifyHandoffIssue } from "@/lib/friendlyErrors";

function parseAvailability(value: unknown): AgentAvailability | null {
  return value === "online" || value === "busy" || value === "offline"
    ? (value as AgentAvailability)
    : null;
}

export async function POST(request: Request) {
  let accountId: number | undefined;
  let conversationId: number | undefined;
  let fallbackSent = false;
  const sendFallback = async () => {
    if (fallbackSent || accountId === undefined || conversationId === undefined)
      return;
    fallbackSent = true;
    try {
      await notifyHandoffIssue(accountId, conversationId);
    } catch (err) {
      console.error("fallback notifyHandoffIssue error", err);
    }
  };
  try {
    const incoming = await request.json();
    // Merge Chatwoot's structured payload with any extra fields we might receive
    const payload = (incoming.data ?? incoming) as
      Partial<ChatwootEvent> & Record<string, any>;

    // Chatwoot may send either `event` or `type`; fall back accordingly
    const event = payload.event ?? payload.type;

    accountId =
      payload.account_id ??
      payload.account?.id ??
      payload.conversation?.account_id ??
      payload.meta?.assignee?.account_id ??
      payload.messages?.[0]?.account_id ??
      payload.message?.account_id ??
      payload.message?.account?.id ??
      payload.message?.conversation?.account_id ??
      payload.message?.conversation?.account?.id;

    conversationId =
      payload.id ??
      payload.conversation?.id ??
      payload.messages?.[0]?.conversation_id ??
      payload.message?.conversation_id ??
      payload.message?.conversation?.id;

    if (accountId === undefined) {
      console.warn("chatwoot status webhook missing account ID", payload);
      return NextResponse.json({ status: "ignored" });
    }

    if (conversationId === undefined) {
      console.warn("chatwoot status webhook missing conversation ID", payload);
      return NextResponse.json({ status: "ignored" });
    }

    if (event === "conversation_status_changed") {
      const typedPayload = payload as ConversationStatusChangedPayload;
      const { status, previous_status: previous } = typedPayload;
      console.info("chatwoot status webhook status change", {
        event,
        conversationId,
        status,
        previous_status: previous,
      });
      if (previous === "open" && status !== "open") {
        const assigneeId =
          payload.assignee_id ??
          (typedPayload as any)?.assignee_id ??
          payload.meta?.assignee?.id ??
          (typedPayload.conversation as any)?.assignee_id ??
          (payload.conversation as any)?.assignee_id;
        const inboxId =
          payload.inbox_id ??
          (typedPayload.conversation as any)?.inbox_id ??
          (payload.conversation as any)?.inbox_id;
        try {
          await releaseAgent(
            accountId,
            conversationId,
            typedPayload.conversation,
            assigneeId,
            inboxId
          );
          clearReleaseAttempts(conversationId);
        } catch (err) {
          console.error("Agent availability update failed", err);
          const message =
            err instanceof Error ? err.message : "Agent release failed";
          const { shouldRetry } = await recordReleaseFailure(
            conversationId,
            err
          );
          await sendFallback();
          if (shouldRetry) {
            return NextResponse.json({ error: message }, { status: 500 });
          }
          return NextResponse.json(
            { status: "unreleased", error: message },
            { status: 200 }
          );
        }
        return NextResponse.json({ status: "handled" });
      }
      if (status === "open") {
        return NextResponse.json({ status: "handled" });
      }
    } else if (event === "conversation_updated") {
      const typedPayload = payload as ConversationUpdatedPayload;
      console.info("chatwoot status webhook conversation update", {
        event,
        conversationId,
        changed_attributes: typedPayload.changed_attributes,
      });
      const changes = Object.assign(
        {},
        ...(typedPayload.changed_attributes || [])
      );
      console.info("chatwoot status webhook changes", {
        event,
        conversationId,
        changes,
      });
      const statusCurrent = changes.status?.current_value as
        | string
        | undefined;
      const statusPrevious = changes.status?.previous_value as
        | string
        | undefined;
      const labelListChange =
        changes.label_list ?? changes.cached_label_list;
      let labelsCurrent = Array.isArray(labelListChange?.current_value)
        ? labelListChange?.current_value
        : undefined;
      const labelsPrevious = Array.isArray(labelListChange?.previous_value)
        ? labelListChange?.previous_value
        : undefined;
      if (!labelListChange) {
        const labelSource =
          payload.label_list ?? payload.cached_label_list ?? payload.labels;
        if (Array.isArray(labelSource)) {
          labelsCurrent = labelSource;
        } else if (typeof labelSource === "string") {
          labelsCurrent = labelSource
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean);
        }
      }
      const assigneeChange = changes.assignee_id;
      const assigneeIdFromChange =
        typeof assigneeChange?.current_value === "number"
          ? assigneeChange.current_value
          : undefined;
      const assigneeId =
        payload.assignee_id ??
        assigneeIdFromChange ??
        payload.meta?.assignee?.id ??
        (typedPayload.conversation as any)?.assignee_id;
      const previousAssigneeRaw = assigneeChange?.previous_value;
      const previousAssigneeId =
        typeof previousAssigneeRaw === "number"
          ? previousAssigneeRaw
          : undefined;
      const hasAssigneeChange = Object.prototype.hasOwnProperty.call(
        changes,
        "assignee_id"
      );
      const inboxId =
        payload.inbox_id ??
        (typedPayload.conversation as any)?.inbox_id ??
        (payload.conversation as any)?.inbox_id;
      const hasAssignedLabel =
        Array.isArray(labelsCurrent) &&
        labelsCurrent.includes(CONVO_LABELS.assigned);
      console.info("chatwoot status webhook resolved fields", {
        event,
        conversationId,
        assigneeId,
        labels_current: labelsCurrent,
        labels_previous: labelsPrevious,
        status_current: statusCurrent,
        status_previous: statusPrevious,
      });
      if (
        typeof previousAssigneeId === "number" &&
        previousAssigneeId !== assigneeId
      ) {
        let previousAvailability: AgentAvailability | null = null;
        try {
          previousAvailability = await clearActiveConversation(
            previousAssigneeId
          );
        } catch (err) {
          console.error("clear previous active conversation error", err);
        }
        if (previousAvailability === null) {
          console.warn(
            "previous agent availability snapshot missing; leaving availability unchanged",
            {
              event,
              conversationId,
              previousAssigneeId,
            }
          );
        } else {
          try {
            await setAgentAvailability(
              accountId,
              previousAssigneeId,
              previousAvailability
            );
          } catch (err) {
            console.error("reset previous agent availability error", err);
            await sendFallback();
          }
        }
      }
      const conversationIsOpen =
        statusCurrent === "open" ||
        (!statusCurrent &&
          ((typedPayload.conversation as any)?.status === "open" ||
            (payload.conversation as any)?.status === "open"));
      const shouldMarkNewAgentBusy =
        hasAssigneeChange &&
        typeof assigneeId === "number" &&
        conversationIsOpen &&
        previousAssigneeId !== assigneeId;
      if (shouldMarkNewAgentBusy) {
        let assigneeAvailability: AgentAvailability | null = parseAvailability(
          payload.meta?.assignee?.availability_status
        );
        if (!assigneeAvailability && typeof assigneeId === "number") {
          try {
            const agent = await getAgent(accountId, assigneeId);
            if (agent) {
              assigneeAvailability = parseAvailability(
                (agent as any)?.availability_status
              );
              if (!assigneeAvailability) {
                console.warn(
                  "assignee availability lookup returned unknown status",
                  {
                    event,
                    conversationId,
                    assigneeId,
                    availability: (agent as any)?.availability_status,
                  }
                );
              }
            } else {
              console.warn("assignee not found in Chatwoot agent list", {
                event,
                conversationId,
                assigneeId,
              });
            }
          } catch (err) {
            console.error("fetch assignee availability error", err);
          }
        }
        if (!assigneeAvailability) {
          console.warn("defaulting new assignee availability to online", {
            event,
            conversationId,
            assigneeId,
          });
        }
        try {
          await setActiveConversation(
            assigneeId,
            conversationId,
            assigneeAvailability
          );
          await setAgentAvailability(accountId, assigneeId, "busy");
        } catch (err) {
          console.error("set new agent busy error", err);
          await sendFallback();
        }
      }
      const shouldRelease =
        (statusCurrent === "pending" || statusCurrent === "resolved") &&
        statusPrevious === "open" &&
        hasAssignedLabel;
      if (shouldRelease) {
        console.info("chatwoot status webhook releasing agent", {
          event,
          conversationId,
          assigneeId,
          labels_current: labelsCurrent,
          labels_previous: labelsPrevious,
          status_current: statusCurrent,
          status_previous: statusPrevious,
        });
        try {
          await releaseAgent(
            accountId,
            conversationId,
            typedPayload.conversation,
            assigneeId,
            inboxId
          );
          clearReleaseAttempts(conversationId);
        } catch (err) {
          console.error("Agent availability update failed", err);
          const message =
            err instanceof Error ? err.message : "Agent release failed";
          const { shouldRetry } = await recordReleaseFailure(
            conversationId,
            err
          );
          await sendFallback();
          if (shouldRetry) {
            return NextResponse.json({ error: message }, { status: 500 });
          }
          return NextResponse.json(
            { status: "unreleased", error: message },
            { status: 200 }
          );
        }
      } else {
        console.info("chatwoot status webhook skipping release", {
          event,
          conversationId,
          assigneeId,
          labels_current: labelsCurrent,
          labels_previous: labelsPrevious,
          status_current: statusCurrent,
          status_previous: statusPrevious,
        });
      }
      return NextResponse.json({ status: "handled" });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error) {
    console.error("Chatwoot status webhook error", error);
    await sendFallback();
    return NextResponse.json({ status: "error" });
  }
}
