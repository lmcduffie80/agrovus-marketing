"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "agrovus-preview-theme";

const palettes = [
  {
    id: "default",
    name: "Current Brand",
    description: "Today's live green",
    swatch: "#00B477",
  },
  {
    id: "emerald-slate",
    name: "Emerald Slate",
    description: "Sharper emerald + cool slate neutrals",
    swatch: "#12B76A",
  },
  {
    id: "deep-forest",
    name: "Deep Forest Dark",
    description: "Dark-mode hero with a glowing mint accent",
    swatch: "#34D399",
  },
  {
    id: "mint-ink",
    name: "Mint & Ink",
    description: "Fresh mint on deep ink-navy text",
    swatch: "#00C285",
  },
  {
    id: "emerald-gradient",
    name: "Emerald Gradient",
    description: "Emerald → cyan two-tone buttons",
    swatch: "#059669",
  },
  {
    id: "sage-charcoal",
    name: "Sage & Charcoal",
    description: "Muted, boutique sage + charcoal",
    swatch: "#3F9C6D",
  },
] as const;

function applyTheme(themeId: string) {
  if (themeId === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeId);
  }
}

export function ThemeSwitcher() {
  const [active, setActive] = useState<string>("default");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Mirrors the palette already applied by the beforeInteractive script in
    // app/layout.tsx, so this can't cause a hydration mismatch — both the
    // server render and this pre-effect client render start from "default".
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setActive(saved);
  }, []);

  const handleSelect = (themeId: string) => {
    setActive(themeId);
    applyTheme(themeId);
    window.localStorage.setItem(STORAGE_KEY, themeId);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] font-sans">
      {open ? (
        <div className="w-72 rounded-xl border border-border bg-card text-card-foreground shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Color preview</p>
              <p className="text-xs text-muted-foreground">Temporary — for review only</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Collapse color preview switcher"
            >
              Hide
            </button>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {palettes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted",
                  active === p.id && "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "size-6 shrink-0 rounded-full border border-border/50",
                    active === p.id && "ring-2 ring-offset-2 ring-offset-card ring-foreground/30"
                  )}
                  style={{ backgroundColor: p.swatch }}
                  aria-hidden
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground shadow-lg hover:bg-muted transition-colors"
        >
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: palettes.find((p) => p.id === active)?.swatch }}
            aria-hidden
          />
          Colors
        </button>
      )}
    </div>
  );
}
