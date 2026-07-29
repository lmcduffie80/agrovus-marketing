import type { NextConfig } from "next";

// The commerce storefront (public catalog/cart/checkout + tenant-admin
// dashboard) lives in the separate Agrovus-erp app, not this repo — see
// docs/superpowers/specs/2026-07-27-agrovus-commerce-design.md in Agrovus-erp.
// store.agrovus.com is served by proxying every request on that host to
// Agrovus-erp's production deployment (Next.js Multi-Zones pattern: see
// node_modules/next/dist/docs/01-app/02-guides/multi-zones.md).
const STORE_ORIGIN = process.env.STORE_ORIGIN || "https://agrovus.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: "store.agrovus.com" }],
          destination: `${STORE_ORIGIN}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
