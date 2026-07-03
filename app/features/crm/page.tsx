import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  { title: "Inquiry Management", desc: "Capture and track every inbound inquiry. Log conversations, assign follow-ups, and never let a deal slip through the cracks." },
  { title: "Sales Pipeline", desc: "Visual pipeline stages from prospect to closed. See deal value, probability, and expected close date at a glance." },
  { title: "Production Forecasting", desc: "Convert pipeline into production forecasts automatically. Know what to blend before the order is even placed." },
  { title: "Revenue Reporting", desc: "Monthly, quarterly, and annual revenue views by product, rep, territory, or customer segment." },
  { title: "Customer History", desc: "Every order, invoice, and interaction in one timeline. Walk into any customer conversation fully prepared." },
  { title: "Multi-Entity Support", desc: "Run CRM across multiple subsidiaries from a single login. Separate pipelines, shared customer master." },
];

export default function CRMPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#00B477]/5 to-background border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/features" className="text-sm text-[#00B477] hover:underline mb-6 inline-block">← All Features</Link>
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#00B477]/10 text-[#00B477] border-[#00B477]/20">Sales & CRM</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Sales & CRM built for<br />ag sales cycles
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From first inquiry to production forecast, Agrovus tracks every deal and automatically feeds your production plan — no spreadsheets required.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-[#00B477] hover:bg-[#009962] text-white font-semibold px-6 py-3 transition-colors"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: "100%", label: "Ag-native pipeline stages" },
            { value: "0", label: "Spreadsheets needed" },
            { value: "Real-time", label: "Production forecasting" },
            { value: "1 login", label: "Multi-entity support" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-[#00B477]">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What&apos;s included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((c) => (
            <div key={c.title} className="border border-border rounded-xl p-6 hover:border-[#00B477]/30 transition-colors">
              <div className="w-8 h-8 bg-[#00B477]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-[#00B477] font-bold text-sm">✓</span>
              </div>
              <h3 className="font-semibold text-base mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00B477] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">See CRM in action</h2>
          <p className="text-[#ccf5e7] mb-8">Start a 14-day free trial. The license is free during the trial — you only pay the one-time implementation fee at signup.</p>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-white text-[#00B477] hover:bg-[#f0fdf9] font-semibold px-6 py-3 transition-colors">
            View Plans & Pricing →
          </Link>
        </div>
      </section>
    </div>
  );
}
