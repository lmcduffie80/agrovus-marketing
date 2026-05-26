import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  { title: "Bill of Materials", desc: "Multi-level BOMs with version control. Manage formulations, yield factors, and component substitutions." },
  { title: "Work Order Management", desc: "Create, release, and track work orders from planned through built. Real-time status visibility across the shop floor." },
  { title: "Blend Scheduling", desc: "Schedule blend runs based on available inventory and demand. Prevent over-commitment before it happens." },
  { title: "AI BOM Generation", desc: "Upload a crop support file (CSF) and AI generates a draft BOM automatically — cutting setup time from hours to minutes." },
  { title: "Material Requirements", desc: "MRP-style requirements planning. Know what raw materials you need and when to purchase them." },
  { title: "Production Costing", desc: "Capture labor, overhead, and material costs per work order. Compare actual vs. standard cost at close." },
  { title: "Quality & Yield Tracking", desc: "Record actual yield vs. expected per run. Track quality holds and deviations with full audit trail." },
  { title: "Work Order History", desc: "Complete production history per finished good. Know exactly what went into every batch you shipped." },
];

export default function ProductionPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#00B477]/5 to-background border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/features" className="text-sm text-[#00B477] hover:underline mb-6 inline-block">← All Features</Link>
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#00B477]/10 text-[#00B477] border-[#00B477]/20">Production</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Production built for<br />ag formulation
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              BOMs, work orders, and blend scheduling designed specifically for the way ag manufacturers actually produce — from crop support files to finished product.
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
            { value: "Multi-level", label: "BOM support" },
            { value: "AI-powered", label: "BOM generation" },
            { value: "Real-time", label: "Work order status" },
            { value: "Full", label: "Production history" },
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
          <h2 className="text-3xl font-bold mb-4">Streamline your production floor</h2>
          <p className="text-[#ccf5e7] mb-8">Start your 14-day free trial today.</p>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-white text-[#00B477] hover:bg-[#f0fdf9] font-semibold px-6 py-3 transition-colors">
            View Plans & Pricing →
          </Link>
        </div>
      </section>
    </div>
  );
}
