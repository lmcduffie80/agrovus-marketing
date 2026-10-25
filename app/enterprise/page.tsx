import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Enterprise — Agrovus",
  description:
    "Annual Enterprise contracts: platform fee, volume user pricing, $50,000 scoping, implementation, and SLA for 50+ user multi-site operations.",
};

const parts = [
  {
    part: "Platform fee",
    price: "$36,000 / year",
    covers: "All modules, unlimited locations, API, SSO, audit log, sandbox",
  },
  {
    part: "Users 51–150",
    price: "$50 / user / month",
    covers: "Rate applies to every user once the count lands in this band",
  },
  {
    part: "Users 151–300",
    price: "$45 / user / month",
    covers: "Volume rate for mid-size Enterprise deployments",
  },
  {
    part: "Users 301+",
    price: "$40 / user / month",
    covers: "Lowest per-user rate for large user counts",
  },
  {
    part: "Scoping",
    price: "$50,000 one-time",
    covers: "AI-assisted discovery (2–4 weeks): process maps, requirements, prototype, and fixed-scope proposal",
  },
  {
    part: "Implementation",
    price: "$25,000–$150,000 one-time",
    covers: "Data migration, integrations, training, go-live support — quoted from the scoping session",
  },
  {
    part: "Dedicated environment",
    price: "+$18,000 / year",
    covers: "Optional separate database and hosting for isolation",
  },
  {
    part: "Custom integration",
    price: "$250,000–$600,000",
    covers: "Optional SAP, EDI, carriers, scales, or client systems — priced by scope",

  },
];

const terms = [
  "1-year minimum; 5% off for a 3-year term, with a 5% per year renewal price cap",
  "Billed annually in advance, or quarterly at a 3% premium",
  "99.9% monthly uptime SLA with service credits for misses",
  "Named account contact; 1-hour response for system-down issues; quarterly business reviews",
  "You own your data and can export anytime; full export within 30 days of termination",
  "Annual user true-up; added users billed from the date added",
];

export default function EnterprisePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-background py-20 sm:py-28">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 80% 0%, var(--primary), transparent)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
            Enterprise
          </p>
          <h1 className="font-[family-name:var(--font-jakarta)] text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
            Annual contracts for multi-site operations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Qualify when you have more than 50 users, need more than three
            integrations, need an uptime guarantee, or run several companies or
            sites. Platform fee + volume user rates + implementation.
          </p>
          <a href="mailto:sales@agrovus.app?subject=Agrovus%20Enterprise%20inquiry">
            <Button
              size="lg"
              className="btn-gradient-primary bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              Contact Sales
            </Button>
          </a>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            How Enterprise is priced
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Example: 200 users ≈ $144,000 / year plus implementation. 500 users
            ≈ $276,000 / year plus implementation.
          </p>
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold">Part</th>
                  <th className="px-4 py-3 font-semibold">Price (USD)</th>
                  <th className="px-4 py-3 font-semibold">What it covers</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((row) => (
                  <tr key={row.part} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      {row.part}
                    </td>
                    <td className="px-4 py-3 text-primary font-semibold whitespace-nowrap">
                      {row.price}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.covers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">
            Contract terms
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {terms.map((t) => (
              <li
                key={t}
                className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
              >
                <span className="text-primary font-bold shrink-0">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="btn-gradient-primary bg-primary py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-primary-foreground">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Talk through your Enterprise quote
          </h2>
          <p className="text-primary-tint-foreground mb-8">
            We&apos;ll scope users, sites, integrations, and go-live — then send
            an order form.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:sales@agrovus.app?subject=Agrovus%20Enterprise%20inquiry">
              <Button
                size="lg"
                className="bg-background text-primary hover:bg-primary-tint font-semibold w-full sm:w-auto"
              >
                Email Sales
              </Button>
            </a>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
              >
                Compare self-serve plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
