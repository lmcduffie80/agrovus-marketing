"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "./CheckoutButton";

// ─── Plan data ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter" as const,
    name: "Starter",
    monthlyPrice: 499,
    annualPrice: 399,
    implFee: 999,
    description: "For small distributors and manufacturers getting started with a modern ERP.",
    features: [
      "Finance & Sales modules",
      "Inventory & Warehouse",
      "Purchase Orders",
      "3 users included",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    id: "growth" as const,
    name: "Growth",
    monthlyPrice: 1199,
    annualPrice: 959,
    implFee: 1999,
    description: "Full ERP suite for growing operations with production and forecasting.",
    features: [
      "All Starter modules",
      "Production module",
      "Material Requirements tool",
      "10 users included",
      "Professional support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    id: "scale" as const,
    name: "Scale",
    monthlyPrice: 2499,
    annualPrice: 1999,
    implFee: 4999,
    description: "For multi-location enterprises and complex process manufacturing.",
    features: [
      "All Growth modules",
      "Multi-entity & multi-warehouse",
      "Financial consolidation",
      "Unlimited users",
      "Enterprise support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
] as const;

// ─── Add-on data ──────────────────────────────────────────────────────────────

const MODULE_ADDONS = [
  { id: "dfii", name: "Material Requirements (DFII)", desc: "Demand forecasting & inventory intelligence", price: 299 },
  { id: "toll", name: "Toll Manufacturing Portal", desc: "Coordinate external toll manufacturers", price: 199 },
  { id: "freight", name: "Freight Intelligence", desc: "Carrier selection & landed cost optimization", price: 149 },
  { id: "consolidation", name: "Advanced Financial Consolidation", desc: "Multi-entity financial rollup & reporting", price: 249 },
  { id: "api", name: "API Access", desc: "Full REST API + webhook access", price: 199 },
];

const SEAT_OPTIONS = [
  { id: "seats5", label: "+5 users", price: 99 },
  { id: "seats10", label: "+10 users", price: 179 },
  { id: "seats_unlimited", label: "Unlimited users", price: 299 },
];

const INTEGRATION_OPTIONS = [
  { id: "sap", label: "SAP Business One", price: 149 },
  { id: "qbo", label: "QuickBooks Online", price: 149 },
  { id: "api_overage", label: "API overage (100K calls/mo)", price: 49 },
  { id: "edi", label: "EDI / Custom Export", price: 299 },
];

const SUPPORT_TIERS = [
  { id: "standard", label: "Standard", desc: "Email + chat · 48hr SLA", price: 0 },
  { id: "professional", label: "Professional", desc: "Phone + chat · 8hr SLA", price: 199 },
  { id: "enterprise", label: "Enterprise", desc: "Dedicated CSM · 2hr SLA", price: 499 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedIntegrations, setSelectedIntegrations] = useState<Set<string>>(new Set());
  const [selectedSupport, setSelectedSupport] = useState("standard");

  function toggleModule(id: string) {
    setSelectedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleIntegration(id: string) {
    setSelectedIntegrations((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-widest text-[#00B477] uppercase mb-3">Pricing</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Build your Agrovus plan
        </h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          Start with a base plan, then add the modules and features your operation actually needs.
        </p>
      </div>

      {/* Monthly / Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual((a) => !a)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B477] ${
            annual ? "bg-[#00B477]" : "bg-muted-foreground/30"
          }`}
          aria-label="Toggle annual billing"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              annual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
          Annual
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {PLANS.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border-2 p-5 ${
                plan.highlight
                  ? "border-[#00B477] shadow-lg shadow-[#00B477]/10"
                  : "border-border"
              } bg-card`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#00B477] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                    Most Popular
                  </span>
                </div>
              )}

              <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-2 mt-1">
                {plan.name}
              </p>

              <div className="mb-2">
                <span className="text-4xl font-bold">${price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>

              <Badge
                className="w-fit mb-4 text-xs bg-[#00B477]/10 text-[#00B477] border border-[#00B477]/30 hover:bg-[#00B477]/10 font-medium"
              >
                + ${plan.implFee.toLocaleString()} one-time impl fee
              </Badge>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {plan.description}
              </p>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <span className="text-[#00B477] mt-0.5 shrink-0 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.cta === "Contact Sales" ? (
                <a
                  href="mailto:sales@agrovus.app"
                  className="w-full inline-flex items-center justify-center rounded-lg border-2 border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Contact Sales
                </a>
              ) : (
                <CheckoutButton
                  plan={plan.id}
                  label={plan.cta}
                  variant={plan.highlight ? "default" : "outline"}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Customize your plan */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-1">Customize your plan</h2>
        <p className="text-xs text-muted-foreground mb-6">
          Add modules, seats, integrations, and support. Selections apply to whichever plan you choose.
        </p>

        {/* Module add-ons */}
        <Section label="Module Add-Ons — Billed Monthly">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MODULE_ADDONS.map((addon) => (
              <AddonCard
                key={addon.id}
                checked={selectedModules.has(addon.id)}
                onToggle={() => toggleModule(addon.id)}
                label={addon.name}
                desc={addon.desc}
                price={addon.price}
              />
            ))}
          </div>
        </Section>

        {/* User seats */}
        <Section label="Additional User Seats — Billed Monthly">
          <div className="grid grid-cols-3 gap-3">
            {SEAT_OPTIONS.map((opt) => (
              <SelectableCard
                key={opt.id}
                selected={selectedSeat === opt.id}
                onSelect={() => setSelectedSeat(selectedSeat === opt.id ? null : opt.id)}
                label={opt.label}
                price={opt.price}
              />
            ))}
          </div>
        </Section>

        {/* Data & integrations */}
        <Section label="Data & Integration Fees — Billed Monthly">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {INTEGRATION_OPTIONS.map((opt) => (
              <AddonCard
                key={opt.id}
                checked={selectedIntegrations.has(opt.id)}
                onToggle={() => toggleIntegration(opt.id)}
                label={opt.label}
                price={opt.price}
              />
            ))}
          </div>
        </Section>

        {/* Support tier */}
        <Section label="Support Tier" last>
          <div className="grid grid-cols-3 gap-3">
            {SUPPORT_TIERS.map((tier) => (
              <SelectableCard
                key={tier.id}
                selected={selectedSupport === tier.id}
                onSelect={() => setSelectedSupport(tier.id)}
                label={tier.label}
                sublabel={tier.desc}
                price={tier.price}
                included={tier.price === 0}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* Fine print */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        All plans include a 14-day free trial · Cancel anytime · Annual plans billed monthly at discounted rate
      </p>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-6 pb-6 border-b border-border"}>
      <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

function AddonCard({
  checked,
  onToggle,
  label,
  desc,
  price,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  desc?: string;
  price: number;
}) {
  return (
    <button
      onClick={onToggle}
      className={`text-left rounded-xl border p-3 transition-colors ${
        checked ? "border-[#00B477] bg-[#00B477]/5" : "border-border hover:border-[#00B477]/40"
      }`}
    >
      <div className="flex items-start gap-2 mb-1">
        <span
          className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center text-[10px] font-bold ${
            checked
              ? "border-[#00B477] bg-[#00B477] text-white"
              : "border-border bg-background"
          }`}
        >
          {checked && "✓"}
        </span>
        <span className="text-xs font-semibold leading-tight">{label}</span>
      </div>
      {desc && <p className="text-[10px] text-muted-foreground leading-snug mb-1.5 pl-6">{desc}</p>}
      <p className="text-xs font-bold text-[#00B477] pl-6">+${price}/mo</p>
    </button>
  );
}

function SelectableCard({
  selected,
  onSelect,
  label,
  sublabel,
  price,
  included = false,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  sublabel?: string;
  price: number;
  included?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-xl border p-3 transition-colors ${
        selected ? "border-[#00B477] bg-[#00B477]/5" : "border-border hover:border-[#00B477]/40"
      }`}
    >
      <p className="text-xs font-semibold mb-0.5">{label}</p>
      {sublabel && <p className="text-[10px] text-muted-foreground mb-1">{sublabel}</p>}
      {included ? (
        <p className="text-xs font-bold text-[#00B477]">Included</p>
      ) : (
        <p className="text-xs font-bold text-[#00B477]">+${price}/mo</p>
      )}
    </button>
  );
}
