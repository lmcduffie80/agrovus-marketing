import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const packs = [
  {
    name: "Agriculture & crop inputs",
    desc: "EPA registration, restricted-use tracking, seasonal pricing, grower accounts",
    featured: true,
  },
  {
    name: "Chemicals & coatings",
    desc: "SDS documents, hazmat classes, lot and batch genealogy",
    featured: false,
  },
  {
    name: "Food & beverage",
    desc: "Lot traceability, FEFO picking, recall reports",
    featured: false,
  },
  {
    name: "Industrial & MRO",
    desc: "Large catalogs, kits and assemblies, customer-specific pricing",
    featured: false,
  },
  {
    name: "3PL & warehousing",
    desc: "Multi-client inventory, storage billing, client portals",
    featured: false,
  },
  {
    name: "General manufacturing",
    desc: "Bills of materials, work orders, routings, scrap tracking",
    featured: false,
  },
];

const features = [
  {
    href: "/features/inventory",
    title: "Catalog & Inventory",
    description:
      "Finished goods catalog with material costing, real-time multi-location inventory, lot tracking, and moving-average costing across your facilities.",
  },
  {
    href: "/features/production",
    title: "Production & Work Orders",
    description:
      "Bill of materials, work orders, and production scheduling for formulated and assembled products.",
  },
  {
    href: "/features/crm",
    title: "Sales & CRM",
    description:
      "Track inquiries, manage your pipeline, and generate production forecasts alongside your sales cycle.",
  },
  {
    href: "/features/finance",
    title: "Finance & AR",
    description:
      "Invoicing, AR aging, bank reconciliation, and Plaid-powered bank feeds — no separate accounting software needed.",
  },
  {
    href: "/features/ai",
    title: "AI-Powered Workflows",
    description:
      "AI parses SDS documents, drafts BOMs from source files, and flags hazmat requirements automatically.",
  },
  {
    href: "/features/portal",
    title: "Customer Portal",
    description:
      "Self-service portal for invoices, documents, and product requests — branded for your customers.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — brand + one promise + CTAs */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% -20%, var(--primary), transparent), linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(to right, var(--primary) 1px, transparent 1px)",
            backgroundSize: "auto, 48px 48px, 48px 48px",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32 text-center">
          <p className="font-[family-name:var(--font-jakarta)] text-3xl sm:text-4xl font-extrabold tracking-tight text-primary mb-6">
            Agrovus
          </p>
          <h1 className="font-[family-name:var(--font-jakarta)] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            ERP for distributors, manufacturers,{" "}
            <span className="text-primary">and warehouses.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10">
            One platform for inventory, purchasing, sales, production, and
            billing — with industry packs for the workflows that differ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button
                size="lg"
                className="btn-gradient-primary bg-primary hover:bg-primary-hover text-primary-foreground w-full sm:w-auto"
              >
                See Pricing →
              </Button>
            </Link>
            <Link href="/enterprise">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Enterprise & Custom
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Industry packs — Ag featured */}
      <section className="border-y border-border bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
              Industry packs
            </p>
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              One codebase. Packs for each market.
            </h2>
            <p className="text-muted-foreground text-lg">
              Core inventory, warehousing, purchasing, sales, production, and
              billing work the same everywhere. Industry packs add the fields,
              units, compliance docs, and reports each vertical needs.
              Agriculture is our first pack — not a limit on who can buy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            {packs.map((pack) => (
              <div
                key={pack.name}
                className={
                  pack.featured
                    ? "sm:col-span-2 lg:col-span-1 border-l-2 border-primary pl-5"
                    : "border-l-2 border-transparent pl-5"
                }
              >
                {pack.featured && (
                  <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                    Featured pack
                  </Badge>
                )}
                <h3 className="font-semibold text-foreground mb-1">{pack.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pack.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Everything your operation needs
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No bolt-ons. Modules ship ready for day one — self-serve,
              Enterprise, or a custom build when you need something owned.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <Link key={f.title} href={f.href} className="group block">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.description}
                </p>
                <p className="text-xs font-medium text-primary mt-3">
                  Learn more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Three ways to buy */}
      <section className="border-t border-border bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-jakarta)] text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Three ways to buy
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Same product. Choose self-serve, an Enterprise contract, or a
              custom ERP built around your process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
                Self-serve
              </p>
              <h3 className="font-semibold text-lg mb-2">Starter · Growth · Scale</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Card-on-file subscription with a one-time implementation fee.
                Best for roughly 3–50 users.
              </p>
              <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
                View plans →
              </Link>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
                Enterprise
              </p>
              <h3 className="font-semibold text-lg mb-2">Annual contract</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Platform fee, volume user rates, SLA, and guided implementation
                for 50+ users and multi-site ops.
              </p>
              <Link href="/enterprise" className="text-sm font-medium text-primary hover:underline">
                Enterprise pricing →
              </Link>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-2">
                Custom ERP
              </p>
              <h3 className="font-semibold text-lg mb-2">Build & own</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Paid AI-assisted scoping, then a fixed-scope phased build —
                full handoff or licensed core.
              </p>
              <Link href="/custom" className="text-sm font-medium text-primary hover:underline">
                Custom services →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="btn-gradient-primary bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-primary-foreground">
          <h2 className="font-[family-name:var(--font-jakarta)] text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to modernize your operation?
          </h2>
          <p className="text-primary-tint-foreground text-lg mb-8">
            Start with a self-serve plan, or talk to us about Enterprise and
            custom builds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-background text-primary hover:bg-primary-tint font-semibold w-full sm:w-auto"
              >
                View Plans & Pricing
              </Button>
            </Link>
            <a href="mailto:sales@agrovus.app?subject=Agrovus%20sales%20inquiry">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
              >
                Contact Sales
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
