import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { isContactTopic } from "./topics";

export const metadata: Metadata = {
  title: "Contact Sales — Agrovus",
  description:
    "Talk to the Agrovus team about Enterprise rollouts, the Scale plan, custom ERP builds, or a custom CRM with built-in AI tools.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string | string[] }>;
}) {
  const { topic } = await searchParams;
  const initialTopic = isContactTopic(topic) ? topic : "general";

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 20% 0%, var(--primary), transparent)",
        }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
            Contact Sales
          </p>
          <h1 className="font-[family-name:var(--font-jakarta)] text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Let&apos;s talk
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Tell us about your business and what you&apos;re looking for. We
            reply within one business day.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Enterprise rollouts and the Scale plan</li>
            <li>Custom ERP scoping and builds</li>
            <li>Custom CRMs with built-in AI tools</li>
          </ul>
        </div>
        <div className="lg:col-span-3 rounded-xl border border-border bg-background p-6 sm:p-8">
          <ContactForm initialTopic={initialTopic} />
        </div>
      </div>
    </section>
  );
}
