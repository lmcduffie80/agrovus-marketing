"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { submitContact, type ContactState } from "./actions";
import { CONTACT_TOPICS, type ContactTopic } from "./topics";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 aria-invalid:border-destructive";

export function ContactForm({ initialTopic }: { initialTopic: ContactTopic }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-xl border border-primary/30 bg-primary/5 p-8">
        <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold tracking-tight mb-2">
          Thanks — we got your message
        </h2>
        <p className="text-muted-foreground">
          Someone from our team will get back to you within one business day.
        </p>
      </div>
    );
  }

  const values = state.values;
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name" htmlFor="name" error={errors.name} required>
          <input
            id="name"
            name="name"
            autoComplete="name"
            defaultValue={values?.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
          />
        </Field>
        <Field label="Work email" htmlFor="email" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values?.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
          />
        </Field>
        <Field label="Company" htmlFor="company">
          <input
            id="company"
            name="company"
            autoComplete="organization"
            defaultValue={values?.company}
            className={inputClass}
          />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={values?.phone}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Interested in" htmlFor="topic">
        <select
          id="topic"
          name="topic"
          defaultValue={values?.topic ?? initialTopic}
          className={inputClass}
        >
          {Object.entries(CONTACT_TOPICS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="How can we help?" htmlFor="message" error={errors.message} required>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={values?.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={inputClass}
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="btn-gradient-primary bg-primary hover:bg-primary-hover text-primary-foreground px-6"
      >
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
