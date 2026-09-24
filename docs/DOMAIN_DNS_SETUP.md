# Domain, DNS, & Cloudflare Setup Guide: syntheticperformanceusa.com

This guide is the complete manual for configuring **`syntheticperformanceusa.com`** on Cloudflare, including nameserver delegation, DNS records, SSL/TLS certificates, and professional dealer email forwarding.

---

## Table of Contents
1. [Overview & Architecture](#1-overview--architecture)
2. [Step 1: Add the Domain to Cloudflare](#step-1-add-the-domain-to-cloudflare)
3. [Step 2: Update Nameservers at Your Domain Registrar](#step-2-update-nameservers-at-your-domain-registrar)
4. [Step 3: DNS Records Configuration](#step-3-dns-records-configuration)
5. [Step 4: SSL/TLS Encryption & HTTPS Settings](#step-4-ssltls-encryption--https-settings)
6. [Step 5: Cloudflare Email Routing (`brandon@...`)](#step-5-cloudflare-email-routing)
7. [Step 6: Deploying the Site via Wrangler](#step-6-deploying-the-site-via-wrangler)
8. [Troubleshooting & Verification](#troubleshooting--verification)

---

## 1. Overview & Architecture

Your website runs as a **Cloudflare Worker with Static Assets**. 

Rather than maintaining legacy DNS A/CNAME records pointed at arbitrary IP addresses, this architecture uses Cloudflare's **Worker Custom Domains** (`custom_domain = true` in `wrangler.toml`). 

### What Cloudflare Custom Domains Do Automatically:
* Provisions edge routing for both `syntheticperformanceusa.com` and `www.syntheticperformanceusa.com`.
* Automatically creates and manages the requisite DNS records in your Cloudflare zone.
* Auto-generates and auto-renews free Universal SSL/TLS certificates with zero manual intervention.

### Prerequisites:
* A Cloudflare account (Free plan is 100% sufficient).
* Access to the domain registrar where `syntheticperformanceusa.com` was purchased (e.g., GoDaddy, Namecheap, Google Domains/Squarespace, Porkbun, Cloudflare Registrar).

---

## 2. Step 1: Add the Domain to Cloudflare

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. On the **Websites** page, click the blue **Add a site** button.
3. Enter the root domain: `syntheticperformanceusa.com` and click **Continue**.
4. Select the **Free** plan ($0/month) at the bottom and click **Continue**.
5. Cloudflare will scan for existing DNS records:
   - Click **Continue** past the scan results.
6. Cloudflare will display **two assigned nameservers**. They will look similar to:
   ```text
   ns1.cloudflare.com  (e.g., iris.ns.cloudflare.com)
   ns2.cloudflare.com  (e.g., wade.ns.cloudflare.com)
   ```
   > ⚠️ **Copy down your specific two nameservers**. You will need them in Step 2.

---

## 3. Step 2: Update Nameservers at Your Domain Registrar

You must replace the default nameservers at your domain registrar with the two assigned Cloudflare nameservers.

### Registrar Quick Instructions:

#### GoDaddy
1. Go to **Domain Control Center** &rarr; Select `syntheticperformanceusa.com`.
2. Scroll to **Additional Settings** &rarr; Select **Manage DNS**.
3. In the **Nameservers** section, click **Change**.
4. Select **Enter my own nameservers (advanced)**.
5. Paste Cloudflare's two nameservers and click **Save** (confirm any 2FA/authorization prompts).

#### Namecheap
1. Go to **Domain List** &rarr; Click **Manage** next to `syntheticperformanceusa.com`.
2. Find the **Nameservers** drop-down menu.
3. Change from *Namecheap BasicDNS* to **Custom DNS**.
4. Paste Cloudflare's two nameservers and click the green checkmark (✓) to save.

#### Squarespace / Google Domains
1. Navigate to **Domains** &rarr; Select `syntheticperformanceusa.com`.
2. Click **DNS** &rarr; **Nameservers**.
3. Select **Use custom nameservers**.
4. Paste Cloudflare's two nameservers and save.

#### Porkbun
1. Go to **Domain Management** &rarr; Click **Details** for `syntheticperformanceusa.com`.
2. Click **Edit** next to **Authoritative Nameservers**.
3. Replace existing entries with Cloudflare's two nameservers and click **Submit**.

> ⏳ **Propagation Time**: DNS nameserver changes usually propagate within 15–60 minutes, but can take up to 24 hours depending on TTL. Cloudflare will email you once the domain is active (*"Status: Active"*).

---

## 4. Step 3: DNS Records Configuration

### How Worker Custom Domains Work:
When you run the deployment script (`./deploy.sh`), `wrangler` instructs Cloudflare to attach the Worker directly to `syntheticperformanceusa.com` and `www.syntheticperformanceusa.com`.

Cloudflare will automatically insert the special Worker DNS records into your zone:

| Type | Name | Content / Target | Proxy status | Managed By |
| :--- | :--- | :--- | :--- | :--- |
| **Worker** / **A** | `@` (apex) | `100::` or Worker Binding | Proxied (Orange Cloud) | Cloudflare Workers |
| **Worker** / **CNAME** | `www` | `syntheticperformanceusa.com` | Proxied (Orange Cloud) | Cloudflare Workers |

### Verifying DNS in Cloudflare:
1. In Cloudflare, select `syntheticperformanceusa.com` &rarr; **DNS** &rarr; **Records**.
2. If you see pre-existing conflicting `A` or `CNAME` records for `@` or `www` from a previous host (e.g. pointing to GoDaddy holding pages or Wix/Shopify), **delete them** so Wrangler can provision the Custom Domains cleanly.
3. Under **Workers & Pages** &rarr; `syntheticperformanceusa` &rarr; **Settings** &rarr; **Domains & Routes**, you should see:
   - `syntheticperformanceusa.com` &rarr; Status: **Active**
   - `www.syntheticperformanceusa.com` &rarr; Status: **Active**

---

## 5. Step 4: SSL/TLS Encryption & HTTPS Settings

To ensure zero browser warnings, fast HTTP/2 or HTTP/3 performance, and end-to-end security:

1. In Cloudflare, navigate to **SSL/TLS** &rarr; **Overview**.
2. Set the encryption mode to **Full (strict)** (or **Full**).
3. Navigate to **SSL/TLS** &rarr; **Edge Certificates**:
   - Turn **Always Use HTTPS** &rarr; **ON**.
   - Turn **Automatic HTTPS Rewrites** &rarr; **ON**.
   - Turn **Minimum TLS Version** &rarr; **TLS 1.2**.
   - Turn **Opportunistic Encryption** &rarr; **ON**.

---

## 6. Step 5: Cloudflare Email Routing

You can set up free professional email forwarding for Brandon (e.g., `brandon@syntheticperformanceusa.com` or `info@syntheticperformanceusa.com`) forwarding to his personal inbox (e.g. Gmail or Outlook) without paying for Google Workspace or Microsoft 365.

### Step-by-Step Email Routing Setup:
1. In Cloudflare, select `syntheticperformanceusa.com`.
2. On the left sidebar, click **Email Routing**.
3. Click **Get Started**.
4. **Step 1: Configure Custom Address**:
   - Custom address: `brandon` @ `syntheticperformanceusa.com`
   - Destination address: Brandon's personal email (e.g., `brandonmiller@gmail.com`).
5. **Step 2: Verify Destination Address**:
   - Cloudflare sends a confirmation email to Brandon's personal inbox.
   - Click the verification link in that email.
6. **Step 3: Add DNS Records Automatically**:
   - Cloudflare will prompt: *"Add records automatically"*. Click **Add records and enable**.
   - Cloudflare will automatically inject the necessary `MX` records and `TXT` SPF verification records:
     ```text
     MX  syntheticperformanceusa.com  priority 17  route1.mx.cloudflare.net
     MX  syntheticperformanceusa.com  priority 8   route2.mx.cloudflare.net
     MX  syntheticperformanceusa.com  priority 38  route3.mx.cloudflare.net
     TXT syntheticperformanceusa.com  v=spf1 include:_spf.mx.cloudflare.net ~all
     ```
7. That's it! Any customer clicking the email link on the website will be forwarded directly to Brandon's inbox.

---

## 7. Step 6: Deploying the Site via Wrangler

Once the domain is added to Cloudflare, deploying the site is a single command from any freshly cloned repo:

```bash
# Clone the repository
git clone <YOUR_GIT_REPO_URL> brandonamsoil
cd brandonamsoil

# Run the automated deployment script
./deploy.sh
```

### Deploying Non-Interactively (CI/CD or Automated Script):
If you are deploying from a headless server, GitHub Actions, or terminal without a web browser, export your Cloudflare credentials first:

```bash
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
export CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"

./deploy.sh
```

#### How to create a Cloudflare API Token:
1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens).
2. Click **Create Token** &rarr; Use template **Edit Cloudflare Workers**.
3. Ensure the token has the following permissions:
   - **Account** &rarr; **Workers Scripts** &rarr; **Edit**
   - **Account** &rarr; **Workers KV Storage** &rarr; **Edit**
   - **Zone** &rarr; **Workers Routes** &rarr; **Edit**
   - **Zone** &rarr; **Zone** &rarr; **Read**
   - **Zone** &rarr; **DNS** &rarr; **Edit**
4. Under **Account Resources**, select **All accounts** (or your specific new account).
5. Under **Zone Resources**, select **All zones** (or `syntheticperformanceusa.com`).
6. Click **Continue to summary** &rarr; **Create Token**.
7. Copy the token.

---

## 8. Troubleshooting & Verification

### Checklist for Go-Live:
- [ ] Registrar nameservers point to Cloudflare (e.g. `*.ns.cloudflare.com`).
- [ ] Cloudflare dashboard displays `syntheticperformanceusa.com` as **Active**.
- [ ] `wrangler.toml` contains `custom_domain = true` for both apex and `www`.
- [ ] Deployment succeeded (`./deploy.sh`).
- [ ] Visiting `https://syntheticperformanceusa.com` loads the homepage with a green padlock.
- [ ] Visiting `https://www.syntheticperformanceusa.com` resolves properly.
- [ ] Visiting `https://syntheticperformanceusa.com/go/lookup` redirects to `https://www.amsoil.com/guides/?zo=31977476`.
- [ ] Test email sent to `brandon@syntheticperformanceusa.com` forwards to personal inbox.

### Common Issues & Quick Fixes:

* **Error: `A DNS record with this name already exists`**:
  Go to Cloudflare &rarr; **DNS** &rarr; **Records**, delete any manual `A` or `CNAME` records for `syntheticperformanceusa.com` or `www`, and rerun `./deploy.sh`.

* **Error: `SSL Handshake Failed` / `Error 525`**:
  Make sure SSL/TLS encryption mode in Cloudflare is set to **Full (strict)**. Note that Universal SSL can take 5–15 minutes to generate when a new domain first connects.

* **Redirect Loop (`ERR_TOO_MANY_REDIRECTS`)**:
  Occurs when SSL encryption is set to *Flexible*. Change it to **Full** or **Full (strict)** in Cloudflare **SSL/TLS** settings.
