import type { AgentAvailability } from "@/lib/agentRotation";

interface Account {
  id?: number;
  account_id?: number;
  [key: string]: any;
}

interface Assignee {
  id?: number;
  account_id?: number;
  availability_status?: AgentAvailability;
}

export interface Conversation {
  id: number;
  status?: string;
  inbox_id?: number;
  account?: Account;
  [key: string]: any;
}

export interface ChatwootSubmittedValue {
  name?: string;
  label?: string;
  value?: unknown;
  answer?: unknown;
  text?: unknown;
  [key: string]: unknown;
}

export interface Message {
  id?: number;
  content: string;
  message_type?: number | string;
  type?: string;
  conversation?: Conversation;
  conversation_id?: number;
  account?: Account;
  account_id?: number;
  content_type?: string;
  content_attributes?: {
    in_reply_to?: number | string;
    in_reply_to_external_id?: number | string;
    submitted_values?: ChatwootSubmittedValue[];
    submitted_email?: string;
    submitted_phone_number?: string;
    [key: string]: any;
  };
  inbox_id?: number;
  private?: boolean;
  [key: string]: any;
}

export interface BasePayload {
  event:
    | "message_created"
    | "message_updated"
    | "conversation_updated"
    | "conversation_status_changed";
  type?: string;
  account?: Account;
  account_id?: number;
  conversation?: Conversation;
  conversation_id?: number;
  inbox_id?: number;
  id?: number;
  meta?: { assignee?: Assignee } & Record<string, any>;
  messages?: Message[];
  message?: Message;
}

export interface MessageCreatedPayload extends BasePayload {
  event: "message_created";
  message: Message;
}

export interface MessageUpdatedPayload extends BasePayload {
  event: "message_updated";
  message: Message;
}

export interface ConversationUpdatedPayload extends BasePayload {
  event: "conversation_updated";
  changed_attributes?: Record<string, any>[];
}

export interface ConversationStatusChangedPayload extends BasePayload {
  event: "conversation_status_changed";
  status?: string;
  previous_status?: string;
}

export type ChatwootEvent =
  | MessageCreatedPayload
  | MessageUpdatedPayload
  | ConversationUpdatedPayload
  | ConversationStatusChangedPayload;

export type ChatwootWebhookPayload =
  | ChatwootEvent
  | { event: ChatwootEvent["event"]; data: ChatwootEvent };

