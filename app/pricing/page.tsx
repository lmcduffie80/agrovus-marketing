import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckoutButton } from "./CheckoutButton";

const plans = [
  {
    id: "starter" as const,
    name: "Starter",
    description: "For small ag businesses getting organized.",
    price: 499,
    implFee: 999,
    highlight: false,
    features: [
      "CRM & sales pipeline",
      "Inventory management",
      "Basic production tracking",
      "Invoicing & AR",
      "Customer portal",
      "Email support",
    ],
  },
  {
    id: "growth" as const,
    name: "Growth",
    description: "For growing teams that need more horsepower.",
    price: 1199,
    implFee: 1999,
    highlight: true,
    features: [
      "Everything in Starter",
      "Multi-location inventory",
      "Full work order management",
      "Bank feed integration",
      "AI document parsing",
      "Priority support",
    ],
  },
  {
    id: "scale" as const,
    name: "Scale",
    description: "For complex operations with multiple entities.",
    price: 2499,
    implFee: 4999,
    highlight: false,
    features: [
      "Everything in Growth",
      "Multi-entity / subsidiaries",
      "Advanced AI workflows",
      "Custom reporting",
      "Dedicated onboarding",
      "Phone & priority support",
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
      {/* Header */}
      <div className="text-center mb-14">
        <Badge className="mb-4 bg-[#00B477]/10 text-[#00B477] border-[#00B477]/20 hover:bg-[#00B477]/10">
          Simple, transparent pricing
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Plans that grow with you
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          All plans include a{" "}
          <span className="font-medium text-foreground">14-day free trial</span>{" "}
          on your license. The one-time implementation fee is charged at signup
          to secure your onboarding slot.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col border-2 transition-shadow ${
              plan.highlight
                ? "border-[#00B477] shadow-lg shadow-[#00B477]/10"
                : "border-border shadow-sm"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#00B477] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader className="pb-4 pt-8">
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                + ${plan.implFee.toLocaleString()} one-time implementation fee
              </p>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <span className="text-[#00B477] mt-0.5 shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-4">
              <CheckoutButton
                plan={plan.id}
                label="Get Started"
                variant={plan.highlight ? "default" : "outline"}
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Fine print */}
      <p className="mt-10 text-center text-xs text-muted-foreground max-w-lg mx-auto">
        The implementation fee is charged immediately and covers your dedicated
        onboarding. Your 14-day free trial begins on the license — no license
        charge until the trial ends. Cancel anytime.
      </p>
    </div>
  );
}
