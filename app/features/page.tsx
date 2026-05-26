import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    href: "/features/crm",
    icon: "🌾",
    name: "CRM & Sales Pipeline",
    tagline: "From first inquiry to closed deal",
    desc: "Manage leads, track opportunities, forecast production, and run your sales team — all built around ag sales cycles.",
  },
  {
    href: "/features/inventory",
    icon: "📦",
    name: "Inventory & Warehousing",
    tagline: "Real-time visibility across every location",
    desc: "Multi-location inventory with lot tracking, FIFO costing, transfers, and automatic reorder points.",
  },
  {
    href: "/features/production",
    icon: "🏭",
    name: "Production & Work Orders",
    tagline: "Blend scheduling built for ag",
    desc: "Bills of materials, work orders, and production scheduling designed for formulated ag products.",
  },
  {
    href: "/features/finance",
    icon: "💰",
    name: "Finance & AR",
    tagline: "No separate accounting software needed",
    desc: "Invoicing, AR aging, bank reconciliation, and Plaid-powered bank feeds in one platform.",
  },
  {
    href: "/features/ai",
    icon: "🤖",
    name: "AI-Powered Workflows",
    tagline: "Automation that understands agriculture",
    desc: "Parse SDS documents, auto-generate BOMs from crop support files, and flag hazmat requirements — automatically.",
  },
  {
    href: "/features/portal",
    icon: "🌐",
    name: "Customer Portal",
    tagline: "Self-service for your customers",
    desc: "Branded portal where customers review invoices, download documents, and submit orders without calling you.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold tracking-widest text-[#00B477] uppercase mb-3">Platform</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Everything in one platform
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Every module built specifically for ag manufacturers and distributors — no bolt-ons, no workarounds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="group">
            <Card className="h-full border-border shadow-sm hover:shadow-md hover:border-[#00B477]/30 transition-all">
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="text-4xl mb-4">{f.icon}</div>
                <p className="text-xs font-semibold tracking-wide text-[#00B477] uppercase mb-1">{f.tagline}</p>
                <h2 className="text-lg font-bold mb-2 group-hover:text-[#00B477] transition-colors">{f.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
                <p className="text-sm font-medium text-[#00B477] mt-4">Learn more →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center bg-[#00B477]/5 border border-[#00B477]/20 rounded-2xl p-10">
        <h2 className="text-2xl font-bold mb-3">Ready to see it in action?</h2>
        <p className="text-muted-foreground mb-6">Start a 14-day free trial — no credit card required for the license.</p>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-lg bg-[#00B477] hover:bg-[#009962] text-white font-semibold px-6 py-3 transition-colors"
        >
          View Plans & Pricing →
        </Link>
      </div>
    </div>
  );
}
