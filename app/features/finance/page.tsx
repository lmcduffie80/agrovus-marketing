import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  { title: "Invoicing & AR", desc: "Generate professional invoices from fulfilled orders. Track open balances, aging, and payment status in real time." },
  { title: "Bank Feed Integration", desc: "Plaid-powered bank feeds pull transactions automatically. Reconcile in minutes, not hours." },
  { title: "Bank Reconciliation", desc: "Match transactions to invoices and expenses with one click. Full audit trail and unexplained variance reporting." },
  { title: "AR Aging Reports", desc: "See who owes what and for how long. Automated reminders for overdue balances." },
  { title: "Manual Invoices", desc: "Create one-off invoices for services, consulting, or non-inventory items. PDF generation and email delivery built in." },
  { title: "Multi-Entity Financials", desc: "Separate financials per subsidiary with consolidated reporting. Intercompany transactions handled automatically." },
  { title: "Financial Consolidation", desc: "Roll up financials across entities with elimination entries and minority interest calculations." },
  { title: "Audit Trail", desc: "Every transaction is immutable and timestamped. Full change history for compliance and audit readiness." },
];

export default function FinancePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#00B477]/5 to-background border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/features" className="text-sm text-[#00B477] hover:underline mb-6 inline-block">← All Features</Link>
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#00B477]/10 text-[#00B477] border-[#00B477]/20">Finance & AR</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Finance that closes<br />the loop on every sale
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From invoice generation to bank reconciliation, Agrovus handles your financial operations without a separate accounting package.
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
            { value: "Plaid", label: "Bank feed integration" },
            { value: "Real-time", label: "AR aging" },
            { value: "Multi-entity", label: "Financial rollup" },
            { value: "Full", label: "Audit trail" },
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
          <h2 className="text-3xl font-bold mb-4">Retire your spreadsheets</h2>
          <p className="text-[#ccf5e7] mb-8">Start your 14-day free trial and close your books faster.</p>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-white text-[#00B477] hover:bg-[#f0fdf9] font-semibold px-6 py-3 transition-colors">
            View Plans & Pricing →
          </Link>
        </div>
      </section>
    </div>
  );
}
