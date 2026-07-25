import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";

const THEME_PREVIEW_SCRIPT = `
(function () {
  try {
    var t = window.localStorage.getItem("agrovus-preview-theme");
    if (t && t !== "default") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Agrovus — ERP Built for Agriculture",
  description:
    "The all-in-one ERP platform for ag manufacturers and distributors. CRM, inventory, production, finance, and AI — purpose-built for the industry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Applies any saved preview palette before first paint to avoid a flash. */}
        <Script id="theme-preview-init" strategy="beforeInteractive">
          {THEME_PREVIEW_SCRIPT}
        </Script>
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex h-16 items-center justify-between">
            {/* Logo — wider render so the icon + wordmark both read clearly */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/agrovus-logo.svg"
                alt="Agrovus"
                width={160}
                height={32}
                priority
                style={{ height: 32, width: "auto" }}
              />
            </Link>

            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/pricing"
                className="btn-gradient-primary inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Get Started
              </Link>
              <a
                href="https://agrovus.app/login"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
            <div className="flex flex-col sm:flex-row gap-8 justify-between mb-8">
              <div>
                <Image
                  src="/agrovus-logo.svg"
                  alt="Agrovus"
                  width={140}
                  height={28}
                  style={{ height: 28, width: "auto" }}
                />
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  ERP built for agriculture — from seed to shelf.
                </p>
              </div>
              <div className="flex gap-12 text-sm">
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-foreground mb-1">Features</p>
                  <Link href="/features/crm" className="text-muted-foreground hover:text-foreground transition-colors">CRM & Sales</Link>
                  <Link href="/features/inventory" className="text-muted-foreground hover:text-foreground transition-colors">Inventory</Link>
                  <Link href="/features/production" className="text-muted-foreground hover:text-foreground transition-colors">Production</Link>
                  <Link href="/features/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & AR</Link>
                  <Link href="/features/ai" className="text-muted-foreground hover:text-foreground transition-colors">AI Workflows</Link>
                  <Link href="/features/portal" className="text-muted-foreground hover:text-foreground transition-colors">Customer Portal</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-foreground mb-1">Company</p>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                  <a href="mailto:support@agrovus.app" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-6 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Agrovus. All rights reserved.
            </div>
          </div>
        </footer>

        <ThemeSwitcher />
      </body>
    </html>
  );
}
