"use server";

import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { CONTACT_TOPICS, isContactTopic, type ContactTopic } from "./topics";

const SALES_INBOX = "info@agrovus.com";
const FROM = "Agrovus Website <website@agrovus.com>";

export type ContactFields = {
  name: string;
  email: string;
  company: string;
  phone: string;
  topic: ContactTopic;
  message: string;
};

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactFields, string>>;
  values?: ContactFields;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string, maxLength: number): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: hidden from people, filled in by bots. Pretend it worked.
  if (field(formData, "website", 200)) {
    return { status: "success" };
  }

  const rawTopic = formData.get("topic");
  const values: ContactFields = {
    name: field(formData, "name", 200),
    email: field(formData, "email", 320).toLowerCase(),
    company: field(formData, "company", 200),
    phone: field(formData, "phone", 50),
    topic: isContactTopic(rawTopic) ? rawTopic : "general",
    message: field(formData, "message", 5000),
  };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!values.name) fieldErrors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(values.email)) fieldErrors.email = "Please enter a valid email address.";
  if (!values.message) fieldErrors.message = "Tell us a little about what you need.";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  // Either channel alone is enough to not lose the lead, so only fail if both do.
  const [saved, emailed] = await Promise.all([saveLead(values), emailLead(values)]);
  if (!saved && !emailed) {
    return {
      status: "error",
      message: `Something went wrong sending your message. Please email us at ${SALES_INBOX}.`,
      values,
    };
  }

  return { status: "success" };
}

async function saveLead(values: ContactFields): Promise<boolean> {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO leads (name, email, company, phone, topic, message)
      VALUES (${values.name}, ${values.email}, ${values.company || null},
              ${values.phone || null}, ${values.topic}, ${values.message})
    `;
    return true;
  } catch (err) {
    console.error("[contact] failed to save lead:", err);
    return false;
  }
}

async function emailLead(values: ContactFields): Promise<boolean> {
  const topicLabel = CONTACT_TOPICS[values.topic];
  const who = values.company ? `${values.name} (${values.company})` : values.name;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [SALES_INBOX],
      replyTo: values.email,
      subject: `New ${topicLabel} lead: ${who}`,
      text: [
        `Topic:   ${topicLabel}`,
        `Name:    ${values.name}`,
        `Email:   ${values.email}`,
        `Company: ${values.company || "—"}`,
        `Phone:   ${values.phone || "—"}`,
        "",
        values.message,
        "",
        "— Sent from the contact form on agrovus.com. Reply to this email to respond directly.",
      ].join("\n"),
    });
    if (error) {
      console.error("[contact] failed to email lead:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] failed to email lead:", err);
    return false;
  }
}
