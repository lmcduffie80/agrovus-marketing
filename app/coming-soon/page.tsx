import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Agrovus — Coming Soon",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-lg w-full text-center space-y-6">
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
          Under construction
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          We&apos;re building something new.
        </h1>
        <p className="text-muted-foreground text-lg">
          Agrovus is putting the finishing touches on our site. Check back
          soon — or reach out if you&apos;d like a preview.
        </p>
        <p className="text-sm text-muted-foreground">
          <a
            href="mailto:support@agrovus.app"
            className="hover:text-foreground transition-colors underline underline-offset-4"
          >
            support@agrovus.app
          </a>
        </p>
      </div>
    </div>
  );
}
