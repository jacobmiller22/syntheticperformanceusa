# Brandon's AMSOIL Authorized Dealer Website

> High-performance, zero-maintenance AMSOIL Authorized Dealer web platform deployed on Cloudflare Workers with Static Assets.

**Live Domain**: [`https://brandonsoil.jacobmiller22.com`](https://brandonsoil.jacobmiller22.com)

---

## Quick Reference & Documentation

* 🛠️ **[Developer Guide](docs/DEVELOPER_GUIDE.md)**: Architecture, local setup, Cloudflare deployment, and edge routing.
* 📖 **[Dealer Handbook](docs/DEALER_HANDBOOK.md)**: Non-technical manual for Brandon on how the site makes money, AMSOIL G4000 rules, and marketing tips.
* 🔧 **[Content Editor Guide](docs/CONTENT_EDITOR_GUIDE.md)**: Brandon's step-by-step field manual for editing text, replacing images, and publishing updates.
* 📋 **[Pending Configuration & TODOs](docs/PENDING_CONFIG.md)**: Tracker for remaining placeholder values and pending dealer assets.

---

## Features

* **⚡ Blazing Fast**: Pure static HTML/CSS pre-rendered with Astro v5 & Tailwind CSS v4, served from Cloudflare's global edge network (sub-50ms TTFB).
* **🔄 Zero Ongoing Maintenance**: No product database, no brittle scraping scripts, and no API rate limits. All product lookups and checkouts route to `amsoil.com`.
* **🎯 Dynamic ZO Attribution**: Outbound links route through `/go/*` edge redirects, dynamically appending the dealer's ZO referral code (`?zo=...`) from Cloudflare environment variables.
* **📱 Mobile-First Design**: Optimized for automotive enthusiasts, fleet managers, and retail customers on any screen size.
* **🛡️ Compliant with AMSOIL G4000**: Includes required Independent Dealer disclaimers, trademark attributions, and direct factory-fulfillment notices.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start local dev server
pnpm dev

# Typecheck & Build
pnpm check
pnpm build

# Deploy to Cloudflare Workers
CLOUDFLARE_API_TOKEN="<TOKEN>" npx wrangler deploy
```
