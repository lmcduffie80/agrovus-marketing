import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — Agrovus",
  description:
    "Agrovus is a Georgia-based SaaS company built on over 20 years of ERP implementation playbooks and user experience.",
};

const strengths = [
  {
    title: "20+ years of ERP implementations",
    body: "We've led ERP rollouts for more than two decades — scoping, data migration, integrations, training, and go-live. Agrovus is built on what we learned doing it.",
  },
  {
    title: "A proven implementation playbook",
    body: "Every deployment follows a repeatable playbook refined across many projects, so you get predictable timelines and fewer surprises on go-live day.",
  },
  {
    title: "User experience first",
    body: "ERP only works if people use it. We design screens around how operators, buyers, and accountants actually work — not around database tables.",
  },
];

export default function AboutPage() {
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
            About Agrovus
          </p>
          <h1 className="font-[family-name:var(--font-jakarta)] text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
            A Georgia-based SaaS company built on 20+ years of ERP experience
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Agrovus brings over two decades of ERP implementation playbooks and
            user experience to distributors, manufacturers, and warehouses —
            delivered as modern, cloud-based software.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-10">
            What we bring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {strengths.map((s) => (
              <div key={s.title}>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Rooted in Georgia
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We&apos;re headquartered in Georgia and serve operations across the
            country. Our team has spent its career inside ERP projects — and we
            started Agrovus to make the software we always wished our clients
            had: fast to implement, easy to use, and priced for growing
            businesses.
          </p>
        </div>
      </section>

      <section className="btn-gradient-primary bg-primary py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center text-primary-foreground">
          <h2 className="font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Put our playbook to work
          </h2>
          <p className="text-primary-tint-foreground mb-8">
            Start self-serve today, or talk to us about an Enterprise rollout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-background text-primary hover:bg-primary-tint font-semibold w-full sm:w-auto"
              >
                See pricing
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground w-full sm:w-auto"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
