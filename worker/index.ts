/**
 * Cloudflare Worker for Brandon's AMSOIL Authorized Dealer Site
 * Handles:
 * 1. Fast static asset delivery via Cloudflare CDN (env.ASSETS)
 * 2. Dynamic outbound referral redirects (/go/*) with dealer ZO attribution
 * 3. Open redirect protection
 */

import type { ExecutionContext, Fetcher } from "@cloudflare/workers-types";

export interface Env {
  ASSETS: Fetcher;
  DEALER_ZO?: string;
  DEALER_NAME?: string;
  DEALER_EMAIL?: string;
  DEALER_LOCATION?: string;
}

const DEFAULT_ZO = "31977476";

// Pre-mapped high-converting destinations on amsoil.com
const ROUTE_MAP: Record<string, string> = {
  // Main CTAs & Tools
  lookup: "https://www.amsoil.com/guides/",
  "vehicle-lookup": "https://www.amsoil.com/guides/",
  save25: "https://www.amsoil.com/offers/pc/",
  pc: "https://www.amsoil.com/offers/pc/",
  "preferred-customer": "https://www.amsoil.com/offers/pc/",
  dealer: "https://www.amsoil.com/become-a-dealer/",
  "become-dealer": "https://www.amsoil.com/become-a-dealer/",
  wholesale: "https://www.amsoil.com/business-opportunities/",
  commercial:
    "https://www.amsoil.com/business-opportunities/commercial-accounts/",
  retail: "https://www.amsoil.com/account-application/retail/",
  "free-catalog": "https://www.amsoil.com/free-catalog/",
  catalog: "https://www.amsoil.com/free-catalog/",
  login: "https://www.amsoil.com/login/",
  register: "https://www.amsoil.com/register/",
  "all-products": "https://www.amsoil.com/c/products/1/",
  all: "https://www.amsoil.com/c/products/1/",

  // Product categories
  "motor-oil": "https://www.amsoil.com/shop/by-product/motor-oil/",
  "transmission-fluid":
    "https://www.amsoil.com/shop/by-product/transmission-fluid/",
  filtration:
    "https://www.amsoil.com/shop/by-product/filters-and-by-pass-systems/",
  filters:
    "https://www.amsoil.com/shop/by-product/filters-and-by-pass-systems/",
  "fuel-additives": "https://www.amsoil.com/shop/by-product/fuel-additives/",
  "gear-lube": "https://www.amsoil.com/shop/by-product/gear-lube/",
  grease: "https://www.amsoil.com/shop/by-product/grease/",
  "hydraulic-oil": "https://www.amsoil.com/shop/by-product/hydraulic-oil/",
  "compressor-oil": "https://www.amsoil.com/shop/by-product/compressor-oil/",
  "other-products": "https://www.amsoil.com/shop/by-product/other-products/",
  clothing: "https://www.amsoil.com/shop/by-product/clothing-and-merchandise/",
  literature: "https://www.amsoil.com/shop/by-product/literature/",

  // Equipment categories
  "auto-truck": "https://www.amsoil.com/c/car-truck/104/",
  motorcycle: "https://www.amsoil.com/shop/by-equipment/motorcycles/",
  "atv-utv": "https://www.amsoil.com/shop/by-equipment/atv-and-utv/",
  atv: "https://www.amsoil.com/shop/by-equipment/atv-and-utv/",
  utv: "https://www.amsoil.com/shop/by-equipment/atv-and-utv/",
  marine: "https://www.amsoil.com/c/marine/111/",
  snowmobile: "https://www.amsoil.com/shop/by-equipment/snowmobiles/",
  "heavy-duty": "https://www.amsoil.com/c/heavy-duty-diesel-equipment/112/",
  "dirt-bike": "https://www.amsoil.com/shop/by-equipment/dirt-bikes/",
  "small-engine": "https://www.amsoil.com/AmsoilLookups/SmallEngineLookup.aspx",
};

function buildReferralUrl(targetUrl: string, zo: string): string {
  const separator = targetUrl.includes("?") ? "&" : "?";
  return `${targetUrl}${separator}zo=${encodeURIComponent(zo)}`;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const zoNumber = env.DEALER_ZO || DEFAULT_ZO;

    // Handle outbound referral redirects: /go/:route
    if (url.pathname.startsWith("/go/") || url.pathname === "/go") {
      const slug = url.pathname.replace(/^\/go\/?/, "").toLowerCase();

      // Check predefined friendly routes
      if (slug && ROUTE_MAP[slug]) {
        const destination = buildReferralUrl(ROUTE_MAP[slug], zoNumber);
        return Response.redirect(destination, 307);
      }

      // Check query param redirect: /go?to=...
      const customTo = url.searchParams.get("to");
      if (customTo) {
        // Security check: Only allow safe amsoil.com destinations (prevent open redirect vulnerabilities)
        try {
          let target: string;
          if (customTo.startsWith("/")) {
            target = `https://www.amsoil.com${customTo}`;
          } else {
            const parsed = new URL(customTo);
            if (!parsed.hostname.endsWith("amsoil.com")) {
              return new Response(
                "Invalid redirect destination: must be amsoil.com",
                { status: 400 },
              );
            }
            target = customTo;
          }
          const destination = buildReferralUrl(target, zoNumber);
          return Response.redirect(destination, 307);
        } catch {
          return new Response("Malformed redirect URL", { status: 400 });
        }
      }

      // Fallback if /go or /go/unknown is requested
      return Response.redirect(
        buildReferralUrl("https://www.amsoil.com/", zoNumber),
        307,
      );
    }

    // Serve static assets from Cloudflare edge
    return env.ASSETS.fetch(request);
  },
};
