export const CONVO_LABELS = {
  waiting: "waiting-agent",
  awaiting: "awaiting-confirmation",
  assigned: "agent-assigned",
  expired: "queue-expired",
  complaint: "complaint",
} as const;

export const HANDOFF_STATUS_LABELS = [
  CONVO_LABELS.waiting,
  CONVO_LABELS.awaiting,
  CONVO_LABELS.assigned,
  CONVO_LABELS.expired,
] as const;
