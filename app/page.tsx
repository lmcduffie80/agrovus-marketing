import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "🌾",
    title: "CRM & Sales Pipeline",
    description:
      "Track inquiries, manage your pipeline, and generate production forecasts — built around ag sales cycles.",
  },
  {
    icon: "📦",
    title: "Inventory & Warehousing",
    description:
      "Real-time multi-location inventory with lot tracking, transfers, and FIFO costing across your facilities.",
  },
  {
    icon: "🏭",
    title: "Production & Work Orders",
    description:
      "Bill of materials, work orders, and blend scheduling purpose-built for formulated ag products.",
  },
  {
    icon: "💰",
    title: "Finance & AR",
    description:
      "Invoicing, AR aging, bank reconciliation, and Plaid-powered bank feeds — no separate accounting software needed.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Workflows",
    description:
      "AI parses SDS documents, generates BOMs from crop support files, and flags hazmat requirements automatically.",
  },
  {
    icon: "🌐",
    title: "Customer Portal",
    description:
      "Self-service portal lets customers review invoices, download documents, and submit new orders — branded for you.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32 text-center">
          <Badge className="mb-6 bg-[#00B477]/10 text-[#00B477] border-[#00B477]/20 hover:bg-[#00B477]/10">
            Purpose-built for agriculture
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            The ERP ag companies{" "}
            <span className="text-[#00B477]">actually use.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10">
            One platform for CRM, inventory, production, finance, and customer
            management — designed from the ground up for ag manufacturers and
            distributors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-[#00B477] hover:bg-[#009962] text-white w-full sm:w-auto">
                See Pricing →
              </Button>
            </Link>
            <a href="https://agrovus.app/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </a>
          </div>
        </div>

        {/* Subtle grid background */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#00B477 1px, transparent 1px), linear-gradient(to right, #00B477 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </section>

      {/* Features */}
      <section className="bg-muted/30 border-y border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything your operation needs
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No bolt-ons. No consultants required. Every module ships ready to
              use on day one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#00B477] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to modernize your operation?
          </h2>
          <p className="text-[#ccf5e7] text-lg mb-8">
            Get started today with a 14-day free trial on your license. The
            implementation fee secures your onboarding slot.
          </p>
          <Link href="/pricing">
            <Button
              size="lg"
              className="bg-white text-[#00B477] hover:bg-[#f0fdf9] font-semibold"
            >
              View Plans & Pricing
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
