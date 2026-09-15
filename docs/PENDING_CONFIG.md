# Pending Dealer Configuration & Remaining TODOs

This document tracks all placeholder fields and pending configurations for Brandon's AMSOIL Authorized Dealer platform (`brandonsoil.jacobmiller22.com`).

---

## 🟢 Completed Configuration

- [x] **AMSOIL Dealer ZO Number**: Configured with Brandon's real AMSOIL account ID: **`31977476`**
  - Updated in `src/config/dealer.ts`
  - Updated in `wrangler.toml`
  - Updated in `worker/index.ts`
  - Updated in `docs/DEALER_HANDBOOK.md`

All outbound `/go/*` links, vehicle lookups, Preferred Customer signups, and catalog views now directly credit **ZO #31977476** on `amsoil.com`.

---

## 🟡 High-Priority Contact & Identity Information (Temporary / Pending True Values)

| Item | Current Temporary Value | Target Files | Description / Action Needed |
| :--- | :--- | :--- | :--- |
| **Dealer Phone Number** | `(555) 321-4567` | • `src/config/dealer.ts`<br>• `wrangler.toml`<br>• `.dev.vars.example` | Provide Brandon's actual customer contact phone number. Displayed in header mobile drawer, footer, contact section, and Schema.org data. |
| **Dealer Contact Email** | `brandon@brandonsoil.jacobmiller22.com` | • `src/config/dealer.ts`<br>• `wrangler.toml`<br>• `.dev.vars.example` | Provide Brandon's active email address, or configure Cloudflare Email Routing to forward `brandon@...` to his personal inbox. |
| **Dealer Full Legal Name** | `Brandon Miller` | • `src/config/dealer.ts`<br>• `wrangler.toml`<br>• Site disclaimers | Verify exact full name matching AMSOIL dealer registration records for compliance. |
| **Dealership / Business Name** | `Brandon's Synthetic Oil` | • `src/config/dealer.ts`<br>• Site header & footer | Confirm if Brandon has a formal DBA or preferred operating name (e.g., *Brandon's Synthetic Lubricants* or *Brandon Miller - Authorized Independent AMSOIL Dealer*). |
| **Service Territory / Local Base** | `Serving Customers Nationwide (US & Canada)` | • `src/config/dealer.ts`<br>• `wrangler.toml`<br>• `src/pages/about.astro` | Specify Brandon's home city/region (e.g., *"Serving [City, State] & Customers Nationwide"*). Improves regional trust and local conversion. |

---

## 🌐 Domain & Hosting Infrastructure

- [ ] **Custom Domain Decision**:
  - **Current**: Running on Jacob's subdomain `https://brandonsoil.jacobmiller22.com`.
  - **Decision Needed**: Will Brandon purchase and run on his own custom domain (e.g. `brandonsyntheticoil.com`), or remain on the current subdomain?
  - **If custom domain chosen**: Update `siteUrl` in `src/config/dealer.ts`, create Cloudflare DNS zone, and update `routes` in `wrangler.toml`.
- [ ] **Cloudflare CI/CD Secrets (Optional)**:
  - If automated deployments are managed via GitHub Actions or an independent Cloudflare account, populate `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in repo repository secrets (see `.env.example`).

---

## 🎨 Branding, Personalization & SEO Enhancements

- [ ] **Personal Bio & Story (`src/pages/about.astro`)**:
  - Currently contains generic boilerplate text about lubrication expertise.
  - *Action*: Gather a brief 2-3 paragraph background on Brandon (vehicles/equipment he works on, racing/off-roading/towing background, why he became an AMSOIL dealer).
- [ ] **Dealer Headshot / Vehicle Photo**:
  - Currently no personal image exists on the About page.
  - *Action*: Add an authentic photo of Brandon, his truck, garage, or equipment into `public/images/` and display on `src/pages/about.astro`.
- [ ] **Social Media Profiles (Optional)**:
  - Add links to Brandon's Facebook business page, Instagram handle, or automotive YouTube channel to the Header and Footer components if desired.
- [ ] **Web Analytics (Optional)**:
  - Add Google Analytics 4 (`G-XXXXXXXXXX`) or Cloudflare Web Analytics beacon script to `src/layouts/Layout.astro` to monitor page visitors and conversion rates.
- [ ] **Local SEO Address (Optional)**:
  - Add city, state, and postal code to the `AutoPartsStore` Schema.org JSON-LD structured data in `src/layouts/Layout.astro` if Brandon wants to rank locally for *"AMSOIL dealer near me"*.

---

## 🛠️ How to Update Values in Bulk

When true values are provided, update them in these two central configuration files:

1. **Static Frontend**: `src/config/dealer.ts`
2. **Cloudflare Worker Runtime**: `wrangler.toml` (under the `[vars]` block) or directly via Cloudflare Dashboard → **Workers & Pages** → **brandonamsoil** → **Settings** → **Variables and Secrets**.
