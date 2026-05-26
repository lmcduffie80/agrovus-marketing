import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  { title: "SDS Document Parsing", desc: "Upload a Safety Data Sheet PDF and AI extracts hazmat classifications, transport info, PPE requirements, and more — in seconds." },
  { title: "BOM Generation from CSF", desc: "Upload a crop support file and AI drafts a full bill of materials with components, quantities, and yield factors." },
  { title: "Hazmat Auto-Flagging", desc: "AI scans every product in your catalog and flags hazmat classifications automatically. Stay DOT-compliant without manual review." },
  { title: "AI Lookup by Item Code", desc: "Query any item code to instantly retrieve its hazmat status, SDS data, and transport classification — no searching required." },
  { title: "Bulk Document Processing", desc: "Upload batches of SDS PDFs and AI processes them all. Populate your entire SDS repository in one pass." },
  { title: "Structured Data Extraction", desc: "AI converts unstructured PDF data into clean, structured records that feed your inventory, BOMs, and compliance reports." },
];

export default function AIPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#00B477]/5 to-background border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/features" className="text-sm text-[#00B477] hover:underline mb-6 inline-block">← All Features</Link>
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#00B477]/10 text-[#00B477] border-[#00B477]/20">AI Workflows</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              AI that understands<br />agriculture
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Agrovus AI reads your SDS documents, generates BOMs from crop support files, and keeps your hazmat records current — automatically.
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
            { value: "Seconds", label: "SDS parse time" },
            { value: "Auto", label: "Hazmat flagging" },
            { value: "Bulk", label: "Document processing" },
            { value: "Structured", label: "Data extraction" },
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

      <section className="bg-[#00B477] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Let AI handle your compliance paperwork</h2>
          <p className="text-[#ccf5e7] mb-8">Start a 14-day free trial and see how much time AI saves your team.</p>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-white text-[#00B477] hover:bg-[#f0fdf9] font-semibold px-6 py-3 transition-colors">
            View Plans & Pricing →
          </Link>
        </div>
      </section>
    </div>
  );
}
