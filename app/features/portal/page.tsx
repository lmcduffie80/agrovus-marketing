import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  { title: "Invoice Access", desc: "Customers view and download their invoices directly — no more \"can you resend that invoice\" calls." },
  { title: "Document Downloads", desc: "SDS sheets, certificates of analysis, delivery notes, BOLs — all available to the customer on demand." },
  { title: "Order History", desc: "Customers see their order history in one place — no more digging through email threads to find what shipped when." },
  { title: "Crop Support File Upload", desc: "Customers upload CSF documents for new product requests. AI parses them and routes to your production team." },
  { title: "Branded Experience", desc: "White-labeled with your company name. Customers see your brand, not ours." },
  { title: "Secure Authentication", desc: "Each customer gets their own secure login. Data is fully isolated — no customer sees another's records." },
  { title: "Impersonation for Support", desc: "Your team can impersonate any customer account to troubleshoot or demonstrate without sharing credentials." },
  { title: "Mobile Friendly", desc: "Fully responsive — customers can check invoices and download documents from their phone in the field." },
];

export default function PortalPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#00B477]/5 to-background border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/features" className="text-sm text-[#00B477] hover:underline mb-6 inline-block">← All Features</Link>
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#00B477]/10 text-[#00B477] border-[#00B477]/20">Customer Portal</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Self-service for<br />your customers
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Give your customers a branded portal to access invoices, documents, and order history — without calling your team for every request.
            </p>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-[#00B477] hover:bg-[#009962] text-white font-semibold px-6 py-3 transition-colors">
              Start Free Trial →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: "Branded", label: "Your identity" },
            { value: "Secure", label: "Per-customer login" },
            { value: "Self-service", label: "Invoices & documents" },
            { value: "Mobile", label: "Ready in the field" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-[#00B477]">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What&apos;s included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <section className="bg-[#00B477] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Give your customers a portal they&apos;ll actually use</h2>
          <p className="text-[#ccf5e7] mb-8">Included in every Agrovus plan. Start your 14-day free trial.</p>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-white text-[#00B477] hover:bg-[#f0fdf9] font-semibold px-6 py-3 transition-colors">
            View Plans & Pricing →
          </Link>
        </div>
      </section>
    </div>
  );
}
