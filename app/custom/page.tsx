import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Custom ERP — Agrovus",
  description:
    "AI-assisted scoping and fixed-scope custom ERP builds — module extensions to company-wide systems, with full handoff or licensed Agrovus core.",
};

const scopingSteps = [
  "Kickoff: agree on departments, processes, and who to interview",
  "Capture: 30–60 minute interviews plus screen recordings of today's systems",
  "AI analysis: draft process maps, requirements, data model, reports, and forms — reviewed by a person",
  "Validation workshop: walk the maps the same week and correct what’s wrong",
  "Deliverables: scope doc, process flows, module list, clickable prototype, phased plan, fixed-price proposal",
];

const bands = [
  {
    size: "Module extension",
    scope: "One workflow on Agrovus core, under 50 users",
    price: "$25,000–$75,000",
    timeline: "4–8 weeks",
  },
  {
    size: "Department system",
    scope: "3–5 modules, under 100 users, 1–2 integrations",
    price: "$100,000–$250,000",
    timeline: "3–6 months",
  },
  {
    size: "Company-wide ERP",
    scope: "6+ modules, 100–500+ users, several integrations, full handoff",
    price: "$300,000–$750,000",
    timeline: "6–12 months",
  },
];

export default function CustomPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-background py-20 sm:py-28">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 20% 0%, var(--primary), transparent)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
            Custom ERP
          </p>
          <h1 className="font-[family-name:var(--font-jakarta)] text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
            A system built around your process — then owned by you
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Two paid steps: a short AI-assisted scoping engagement that produces
            a fixed-price proposal, then a phased build. Scoping is billed on
            its own and is not credited against the build.
          </p>
          <a href="mailto:sales@agrovus.app?subject=Agrovus%20custom%20ERP%20scoping">
            <Button
              size="lg"
              className="btn-gradient-primary bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              Request scoping
            </Button>
          </a>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            AI-assisted scoping
          </h2>
          <p className="text-muted-foreground mb-2 max-w-xl">
            2–4 weeks · <span className="text-foreground font-semibold">$50,000</span>
          </p>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Filters tire-kickers, pays for the work that wins the deal, and
            leaves you with useful deliverables even if you never build.
          </p>
          <ol className="space-y-4 max-w-3xl">
            {scopingSteps.map((step, i) => (
              <li key={step} className="flex gap-4 text-sm leading-relaxed">
                <span className="font-[family-name:var(--font-jakarta)] text-primary font-extrabold shrink-0 w-6">
                  {i + 1}.
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Build pricing bands
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Payment: 25% at signing, milestones as each phase is accepted, 10%
            held until final acceptance.
          </p>
          <div className="overflow-x-auto border border-border rounded-xl bg-background">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold">Size</th>
                  <th className="px-4 py-3 font-semibold">Typical scope</th>
                  <th className="px-4 py-3 font-semibold">Price (USD)</th>
                  <th className="px-4 py-3 font-semibold">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {bands.map((row) => (
                  <tr key={row.size} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{row.size}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.scope}</td>
                    <td className="px-4 py-3 text-primary font-semibold whitespace-nowrap">
                      {row.price}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {row.timeline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">
            Who owns the code
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
            <div>
              <h3 className="font-semibold text-lg mb-2">Full handoff</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                You own all custom code and documentation outright. Highest
                price. Ongoing optional support retainer. Our reuse is limited
                to general know-how — nothing built for you goes back into
                Agrovus.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Licensed build</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                You own your custom modules; you license the Agrovus core.
                Typically 40–60% lower up front, plus an annual license and
                support. Core improvements can feed back into the product.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-8 max-w-2xl">
            Suggested retainer after go-live: $3,000–$10,000 / month for a set
            number of hours, hosting oversight, and updates. Bug fixes stay
            free; new features are quoted separately or covered by the retainer.
          </p>
        </div>
      </section>

      <section className="btn-gradient-primary bg-primary py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-primary-foreground">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Start with scoping
          </h2>
          <p className="text-primary-tint-foreground mb-8">
            A fixed $50,000 engagement that ends in a fixed-price proposal —
            useful whether or not you proceed to build.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:sales@agrovus.app?subject=Agrovus%20custom%20ERP%20scoping">
              <Button
                size="lg"
                className="bg-background text-primary hover:bg-primary-tint font-semibold w-full sm:w-auto"
              >
                Request scoping
              </Button>
            </a>
            <Link href="/enterprise">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
              >
                Compare Enterprise
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
