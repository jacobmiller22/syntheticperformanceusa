# Developer Guide: AMSOIL Authorized Dealer Platform

This document is the complete technical reference for developing, maintaining, and deploying Brandon's AMSOIL Authorized Dealer platform (`syntheticperformanceusa.com/`).

---

## 1. System Architecture

The platform is designed around **speed, security, and zero ongoing maintenance**:

```
[ User visits syntheticperformanceusa.com/ ]
                      │
                      ▼
        Cloudflare Workers Edge Network
   (Zero cold start, sub-50ms global TTFB)
                      │
       ┌──────────────┴──────────────┐
       ▼                             ▼
[ Static Asset Route ]       [ /go/* Referral Route ]
HTML5, CSS, AVIF Images     Edge router reads DEALER_ZO
Served from Cloudflare CDN  from Worker Environment
                            Returns HTTP 307 to amsoil.com/?zo=...
```

### Why this architecture has zero maintenance:

1. **No Scraping Pipeline**: Product specs, pricing tiers, and stock status change constantly on `amsoil.com`. By delegating product pages and vehicle lookups to `amsoil.com` through deep links, we never have broken scrapers, blocked IP addresses, or pricing drift.
2. **No Database Dependencies**: There is no SQL database, D1 schema, or ORM to migrate or corrupt.
3. **No External Client-Side API Keys**: No Stripe keys, no CMS APIs, no third-party endpoints that expire or rate-limit.
4. **Instant Global CDN**: Pre-rendered static pages built by Astro are served directly from Cloudflare's edge cache.

---

## 2. Directory Structure

```
├── docs/
│   ├── DEVELOPER_GUIDE.md          # Technical documentation (this file)
│   └── DEALER_HANDBOOK.md          # Non-technical guide for the dealer (Brandon)
├── public/
│   ├── images/
│   │   ├── 34-amsoil-logo-main.avif
│   │   ├── hero-background.avif
│   │   ├── vehicles/               # Equipment icons (AVIF)
│   │   ├── products/               # Product category icons (AVIF)
│   │   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.astro            # Sticky nav, mobile drawer, announcement bar
│   │   ├── Footer.astro            # Dealer legal disclosures & site links
│   │   ├── Hero.astro              # High-impact automotive hero
│   │   ├── VehicleGrid.astro       # 8 equipment lookup cards
│   │   ├── CategoryGrid.astro      # Core lubricant categories
│   │   ├── PreferredCustomerCard.astro # $10 membership value matrix
│   │   ├── WholesaleB2B.astro      # Commercial & Retail account cards
│   │   └── TrustBadges.astro       # Warranty & fulfillment badges
│   ├── config/
│   │   └── dealer.ts               # Dealer constants & link helper
│   ├── layouts/
│   │   └── Layout.astro            # Base HTML, SEO, OpenGraph, JSON-LD schema
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── shop-by-vehicle.astro   # Vehicle lookup guide page
│   │   ├── preferred-customer.astro # Preferred customer ROI & FAQs
│   │   ├── become-a-dealer.astro   # Dealership business opportunity
│   │   ├── commercial-wholesale.astro # Fleet and retail store accounts
│   │   ├── about.astro             # Dealer bio & contact
│   │   ├── privacy.astro           # Legal & affiliate disclosure
│   │   └── 404.astro               # Custom 404 page
│   └── styles/
│       └── global.css              # Tailwind CSS v4 & custom branding
├── worker/
│   ├── index.ts                    # Cloudflare Worker edge router (/go/*)
│   └── tsconfig.json               # Worker TypeScript configuration
├── astro.config.mjs                # Astro configuration
├── package.json                    # Scripts and dependencies
├── tsconfig.json                   # Astro TypeScript configuration
└── wrangler.toml                   # Cloudflare Workers configuration & routes
```

---

## 3. Local Development

### Prerequisites

- Node.js v20+ (tested on Node v24)
- pnpm v9+ (tested on pnpm v12)
- Wrangler CLI (included in `devDependencies`)

### Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Run local Astro development server
pnpm dev
# Opens at http://localhost:4321

# 3. Type-check all Astro components
pnpm check

# 4. Build static distribution files
pnpm build
# Generates static HTML/assets into dist/

# 5. Run full Cloudflare Worker emulation locally (including /go/* routes)
npx wrangler dev
```

---

## 4. How the Dynamic ZO & Edge Routing Works

The Worker script in [`worker/index.ts`](file:///Users/jacobmiller22/projects/brandonamsoil/worker/index.ts) intercepts any request beginning with `/go/`:

### 1. Predefined Clean Routes

- `/go/lookup` &rarr; `https://www.amsoil.com/guides/?zo=${DEALER_ZO}`
- `/go/save25` &rarr; `https://www.amsoil.com/offers/pc/?zo=${DEALER_ZO}`
- `/go/all` &rarr; `https://www.amsoil.com/c/products/1/?zo=${DEALER_ZO}`
- `/go/motor-oil` &rarr; `https://www.amsoil.com/shop/by-product/motor-oil/?zo=${DEALER_ZO}`
- `/go/auto-truck` &rarr; `https://www.amsoil.com/c/car-truck/104/?zo=${DEALER_ZO}`
- `/go/dealer` &rarr; `https://www.amsoil.com/become-a-dealer/?zo=${DEALER_ZO}`
- `/go/commercial` &rarr; `https://www.amsoil.com/business-opportunities/commercial-accounts/?zo=${DEALER_ZO}`
- `/go/retail` &rarr; `https://www.amsoil.com/account-application/retail/?zo=${DEALER_ZO}`

### 2. Custom Destination Queries (`/go?to=...`)

You can link to any page on `amsoil.com` by passing a `to` parameter:

- `/go?to=/c/marine/111/`
- `/go?to=https://www.amsoil.com/p/amsoil-signature-series-5w-30-synthetic-motor-oil-asl/`

**Open Redirect Protection**: The worker validates that the destination strictly begins with `/` or has a hostname ending in `amsoil.com`. Any malicious external redirect attempts will be rejected with HTTP 400.

---

## 5. Changing Dealer Information (Zero-Rebuild)

You can change Brandon's ZO number, phone, or name in **three ways**:

### Method A: Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) &rarr; **Workers & Pages**.
2. Click on **`brandonamsoil`**.
3. Go to **Settings** &rarr; **Variables and Secrets**.
4. Edit the `DEALER_ZO` value.
5. Click **Deploy**. All `/go/*` outbound links instantly route with the new dealer number!

### Method B: Via Wrangler CLI

```bash
# Update the environment variable
CLOUDFLARE_API_TOKEN="<token>" npx wrangler secret put DEALER_ZO
```

### Method C: In `wrangler.toml`

Update the `[vars]` block and deploy:

```toml
[vars]
DEALER_ZO = "7654321"
DEALER_NAME = "Brandon Miller"
```

---

## 6. Cloudflare Deployment Reference

- **Cloudflare Account ID**: `6290c7cd5d9834b6f16e06b4ed67e663`
- **Cloudflare Zone ID**: `5d7e44ca52908e077d3808080930bd69` (`jacobmiller22.com`)
- **Target Domain**: `syntheticperformanceusa.com/`
- **Wrangler Route**:
  ```toml
  routes = [
    { pattern = "syntheticperformanceusa.com//*", zone_id = "5d7e44ca52908e077d3808080930bd69" }
  ]
  ```

### Deployment Command

```bash
export CLOUDFLARE_API_TOKEN="<YOUR_TOKEN>"
export CLOUDFLARE_ACCOUNT_ID="6290c7cd5d9834b6f16e06b4ed67e663"

# Build static assets & deploy worker
pnpm run build
npx wrangler deploy
```

---

## 7. Adding New Categories or Outbound Routes

To add a new friendly redirect route (e.g. `/go/racing`):

1. Open [`worker/index.ts`](file:///Users/jacobmiller22/projects/brandonamsoil/worker/index.ts).
2. Add the route key and target AMSOIL URL to `ROUTE_MAP`:
   ```typescript
   "racing": "https://www.amsoil.com/c/racing-oils/105/"
   ```
3. Run `npx wrangler deploy`.
