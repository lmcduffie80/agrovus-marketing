export const CONTACT_TOPICS = {
  general: "General inquiry",
  enterprise: "Enterprise",
  scale: "Scale plan",
  "custom-erp": "Custom ERP / scoping",
  "custom-crm": "Custom CRM with AI tools",
} as const;

export type ContactTopic = keyof typeof CONTACT_TOPICS;

export function isContactTopic(value: unknown): value is ContactTopic {
  return typeof value === "string" && Object.hasOwn(CONTACT_TOPICS, value);
}
