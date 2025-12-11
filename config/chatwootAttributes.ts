export const CHATWOOT_CONVERSATION_ATTRIBUTE_KEYS = {
  customerName: "customer_name",
  companyName: "company_name",
  companyLocation: "company_location",
  contact: "contact",
  complaintType: "complaint_type",
  issueDescription: "issue_description",
} as const;

export const CHATWOOT_COMPLAINT_TYPES = [
  "Delayed Supply",
  "Delayed Quote",
  "Equipment Malfunction",
  "Employee Misconduct",
  "Training",
  "Maintenance",
  "Other",
  "Solution Failure",
] as const;

export type ChatwootComplaintType = (typeof CHATWOOT_COMPLAINT_TYPES)[number];
