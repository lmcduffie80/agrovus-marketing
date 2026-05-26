import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="text-6xl mb-2">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome to Agrovus!
        </h1>
        <p className="text-muted-foreground text-lg">
          You&apos;re all set. Check your email for onboarding instructions —
          our team will be in touch within one business day to schedule your
          implementation call.
        </p>
        <p className="text-sm text-muted-foreground">
          Your 14-day free trial starts today. No license charge until the trial ends.
        </p>
        <div className="pt-2">
          <a href="https://agrovus.app/login">
            <Button
              size="lg"
              className="bg-[#00B477] hover:bg-[#009962] text-white"
            >
              Go to your account →
            </Button>
          </a>
        </div>
        <div className="pt-2">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
