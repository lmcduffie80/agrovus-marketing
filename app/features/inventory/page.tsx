import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  { title: "Multi-Location Tracking", desc: "Track stock across warehouses, blending facilities, and distribution points in real time." },
  { title: "Lot & Batch Traceability", desc: "Full lot-level traceability from receipt to fulfillment. Recall-ready in minutes, not days." },
  { title: "FIFO Costing", desc: "Automatic first-in-first-out cost layering. Know your true cost of goods at every moment." },
  { title: "Inventory Transfers", desc: "Move stock between locations with a few clicks. Transfer history and audit trail included." },
  { title: "Reorder Points", desc: "Set min/max levels per item per location. Get alerts before you stock out, not after." },
  { title: "Physical Count Tools", desc: "Guided cycle counts and full physical inventory. Variance reports with GL impact calculated automatically." },
  { title: "Purchase Orders", desc: "Create and track POs against open requirements. Receive against PO with automatic inventory update." },
  { title: "Fulfillment & Picking", desc: "Pick tickets, bill of lading, and fulfillment confirmations — all connected to live inventory." },
];

export default function InventoryPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#00B477]/5 to-background border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/features" className="text-sm text-[#00B477] hover:underline mb-6 inline-block">← All Features</Link>
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#00B477]/10 text-[#00B477] border-[#00B477]/20">Inventory</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Inventory built for<br />ag complexity
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Multi-location, lot-tracked, FIFO-costed inventory that handles the real-world complexity of ag manufacturing and distribution.
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
            { value: "Lot-level", label: "Traceability" },
            { value: "FIFO", label: "Cost layering" },
            { value: "Unlimited", label: "Locations" },
            { value: "Real-time", label: "Availability" },
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
          <h2 className="text-3xl font-bold mb-4">Get real-time inventory visibility</h2>
          <p className="text-[#ccf5e7] mb-8">Start your 14-day free trial and see your inventory exactly as it is.</p>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-white text-[#00B477] hover:bg-[#f0fdf9] font-semibold px-6 py-3 transition-colors">
            View Plans & Pricing →
          </Link>
        </div>
      </section>
    </div>
  );
}
