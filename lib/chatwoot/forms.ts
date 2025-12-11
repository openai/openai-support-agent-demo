import {
  CHATWOOT_COMPLAINT_TYPES,
  CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS,
} from "@/config/chatwootAttributes";
import { HOST_COMPANY_NAME } from "@/config/constants";
import { AGENT_NAME } from "@/config/demoData";

export type ChatwootFormFieldType =
  | "text"
  | "text_area"
  | "email"
  | "select"
  | "number"
  | "date"
  | "url"
  | "phone";

export interface ChatwootFormFieldOption {
  label: string;
  value: string;
}

export interface ChatwootFormField {
  name: string;
  label: string;
  type: ChatwootFormFieldType | (string & {});
  placeholder?: string;
  default?: string;
  options?: ChatwootFormFieldOption[];
}

export interface ChatwootFormContentAttributes {
  title?: string;
  items: ChatwootFormField[];
  in_reply_to?: number;
}

const ATTRIBUTE_KEY_VALUES = CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS;

type ComplaintAttributeKey =
  | keyof typeof ATTRIBUTE_KEY_VALUES
  | (typeof ATTRIBUTE_KEY_VALUES)[keyof typeof ATTRIBUTE_KEY_VALUES];

export type ChatwootComplaintFormDefaults = Partial<
  Record<ComplaintAttributeKey, string>
>;

const NORMALIZED_HOST_COMPANY_NAME = HOST_COMPANY_NAME.trim().toLowerCase();
const NORMALIZED_AGENT_NAME = AGENT_NAME.trim().toLowerCase();

const PLACEHOLDER_SENTINEL_VALUES = new Set([
  "unknown",
  "customer",
  "customer name",
  "company",
  "company name",
  "company location",
  "contact",
  "contact info",
  "contact information",
  "n/a",
  "na",
  "none",
  "not provided",
  "not specified",
  "-",
  NORMALIZED_HOST_COMPANY_NAME,
  NORMALIZED_AGENT_NAME,
]);

interface PickDefaultOptions {
  placeholder?: string;
  treatPlaceholdersAsEmpty?: boolean;
  required?: boolean;
  sentinelValues?: string[];
}

function isPlaceholderSentinel(
  value: string,
  { placeholder, sentinelValues }: PickDefaultOptions
): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  if (placeholder && normalized === placeholder.trim().toLowerCase()) {
    return true;
  }
  if (PLACEHOLDER_SENTINEL_VALUES.has(normalized)) {
    return true;
  }
  if (Array.isArray(sentinelValues)) {
    for (const extra of sentinelValues) {
      if (normalized === extra.trim().toLowerCase()) {
        return true;
      }
    }
  }
  return false;
}

export const COMPLAINT_TYPE_OPTIONS: ChatwootFormFieldOption[] =
  CHATWOOT_COMPLAINT_TYPES.map((value) => ({
    label: value,
    value,
  }));

function pickDefault(
  defaults: ChatwootComplaintFormDefaults | undefined,
  keys: ComplaintAttributeKey[],
  options: PickDefaultOptions = {}
): string | undefined {
  const { placeholder, treatPlaceholdersAsEmpty, required } = options;
  if (!defaults) {
    return required && placeholder ? placeholder : undefined;
  }
  for (const key of keys) {
    const rawValue = defaults[key];
    if (typeof rawValue === "string") {
      const trimmed = rawValue.trim();
      if (trimmed) {
        if (treatPlaceholdersAsEmpty) {
          const shouldSkip = isPlaceholderSentinel(trimmed, options);
          if (shouldSkip) {
            continue;
          }
        }
        return trimmed;
      }
    }
  }
  if (required && placeholder) {
    return placeholder;
  }
  return undefined;
}

export const DEFAULT_COMPLAINT_FORM_TITLE = "Complaint intake form";

export function buildComplaintFormFields(
  defaults?: ChatwootComplaintFormDefaults
): ChatwootFormField[] {
  const attr = ATTRIBUTE_KEY_VALUES;
  return [
    {
      name: attr.customerName,
      label: "Customer name",
      type: "text",
      placeholder: "Customer full name",
      default: pickDefault(
        defaults,
        [attr.customerName, "customerName"],
        { placeholder: "Customer full name", treatPlaceholdersAsEmpty: true }
      ),
    },
    {
      name: attr.companyName,
      label: "Company name",
      type: "text",
      placeholder: "Company or organization",
      default: pickDefault(
        defaults,
        [attr.companyName, "companyName"],
        { placeholder: "Company or organization", treatPlaceholdersAsEmpty: true }
      ),
    },
    {
      name: attr.companyLocation,
      label: "Company location",
      type: "text",
      placeholder: "City, state, or region",
      default: pickDefault(
        defaults,
        [attr.companyLocation, "companyLocation"],
        { placeholder: "City, state, or region", treatPlaceholdersAsEmpty: true }
      ),
    },
    {
      name: attr.contact,
      label: "Primary contact",
      type: "text",
      placeholder: "Email or phone number",
      default: pickDefault(
        defaults,
        [attr.contact, "contact"],
        { placeholder: "Email or phone number", treatPlaceholdersAsEmpty: true }
      ),
    },
    {
      name: attr.complaintType,
      label: "Complaint type",
      type: "select",
      options: COMPLAINT_TYPE_OPTIONS,
      default: pickDefault(defaults, [attr.complaintType, "complaintType"]),
    },
    {
      name: attr.issueDescription,
      label: "Issue description",
      type: "text_area",
      placeholder: "Describe the issue",
      default: pickDefault(
        defaults,
        [attr.issueDescription, "issueDescription"],
        { placeholder: "Describe the issue", treatPlaceholdersAsEmpty: true }
      ),
    },
  ];
}

export function buildComplaintFormContent(
  defaults?: ChatwootComplaintFormDefaults,
  options?: { title?: string }
): ChatwootFormContentAttributes {
  const items = buildComplaintFormFields(defaults);
  const title = options?.title?.trim() || DEFAULT_COMPLAINT_FORM_TITLE;
  return {
    title,
    items,
  };
}
