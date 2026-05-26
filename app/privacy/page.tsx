import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">
        Agrovus collects only the information necessary to provide its services. We do not sell your
        data. Payment processing is handled securely by Stripe.
      </p>
      <p className="text-muted-foreground">
        For questions, contact us at{" "}
        <a href="mailto:privacy@agrovus.app" className="text-[#00B477] hover:underline">
          privacy@agrovus.app
        </a>
        .
      </p>
      <div className="mt-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
