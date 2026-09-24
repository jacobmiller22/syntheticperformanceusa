# Brandon's AMSOIL Authorized Dealer Website

> High-performance, zero-maintenance AMSOIL Authorized Dealer web platform deployed on Cloudflare Workers with Static Assets.

**Production Domain**: [`https://syntheticperformanceusa.com`](https://syntheticperformanceusa.com)  
**Preview / Subdomain**: [`https://www.syntheticperformanceusa.com`](https://www.syntheticperformanceusa.com)

---

## Quick Reference & Documentation

- 🌐 **[Domain & DNS Setup Guide](docs/DOMAIN_DNS_SETUP.md)**: Cloudflare zone onboarding, nameservers, DNS records, SSL/TLS, and email forwarding.
- 🛠️ **[Developer Guide](docs/DEVELOPER_GUIDE.md)**: Architecture, local setup, Cloudflare deployment, and edge routing.
- 📖 **[Dealer Handbook](docs/DEALER_HANDBOOK.md)**: Non-technical manual for Brandon on how the site makes money, AMSOIL G4000 rules, and marketing tips.
- 🔧 **[Content Editor Guide](docs/CONTENT_EDITOR_GUIDE.md)**: Brandon's step-by-step field manual for editing text, replacing images, and publishing updates.
- 📋 **[Pending Configuration & TODOs](docs/PENDING_CONFIG.md)**: Tracker for remaining placeholder values and pending dealer assets.

---

## Features

- **⚡ Blazing Fast**: Pure static HTML/CSS pre-rendered with Astro v5 & Tailwind CSS v4, served from Cloudflare's global edge network (sub-50ms TTFB).
- **🔄 Zero Ongoing Maintenance**: No product database, no brittle scraping scripts, and no API rate limits. All product lookups and checkouts route to `amsoil.com`.
- **🎯 Dynamic ZO Attribution**: Outbound links route through `/go/*` edge redirects, dynamically appending the dealer's ZO referral code (`?zo=...`) from Cloudflare environment variables.
- **📱 Mobile-First Design**: Optimized for automotive enthusiasts, fleet managers, and retail customers on any screen size.
- **🛡️ Compliant with AMSOIL G4000**: Includes required Independent Dealer disclaimers, trademark attributions, and direct factory-fulfillment notices.

---

## Quick Start (Fresh Clone to Production)

```bash
# 1. Clone repository
git clone <REPO_URL> brandonamsoil
cd brandonamsoil

# 2. Run the automated deployment script
./deploy.sh
```

Or for local development:

```bash
# Install dependencies
pnpm install

# Start local dev server
pnpm dev

# Typecheck & Build
pnpm check
pnpm build

# Deploy directly via npm script
pnpm run deploy:prod
```
