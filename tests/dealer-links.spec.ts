import { test, expect } from '@playwright/test';
import { dealerConfig } from '../src/config/dealer';

/**
 * All production routes to crawl for link verification
 */
const SITE_PAGES = [
  '/',
  '/shop-by-vehicle',
  '/preferred-customer',
  '/become-a-dealer',
  '/commercial-wholesale',
  '/about',
  '/privacy',
  '/404',
];

/**
 * Known predefined slugs in worker/index.ts ROUTE_MAP
 */
const EXPECTED_ROUTE_MAP_SLUGS = [
  // Main CTAs & Tools
  'lookup',
  'vehicle-lookup',
  'save25',
  'pc',
  'preferred-customer',
  'dealer',
  'become-dealer',
  'wholesale',
  'commercial',
  'retail',
  'free-catalog',
  'catalog',
  'login',
  'register',
  'all-products',
  'all',
  // Product categories
  'motor-oil',
  'transmission-fluid',
  'filtration',
  'filters',
  'fuel-additives',
  'gear-lube',
  'grease',
  'hydraulic-oil',
  'compressor-oil',
  'other-products',
  'clothing',
  'literature',
  // Equipment categories
  'auto-truck',
  'motorcycle',
  'atv-utv',
  'atv',
  'utv',
  'marine',
  'snowmobile',
  'heavy-duty',
  'dirt-bike',
  'small-engine',
];

test.describe('AMSOIL Dealer Number (ZO) Verification', () => {
  const EXPECTED_ZO = dealerConfig.zoNumber;

  test('dealer configuration should have a valid, non-empty ZO number', async () => {
    expect(EXPECTED_ZO).toBeDefined();
    expect(EXPECTED_ZO.length).toBeGreaterThan(0);
    // Ensure ZO contains only digits or valid identifier
    expect(/^\d+$/.test(EXPECTED_ZO)).toBe(true);
  });

  test.describe('Crawl All Pages: Verify All Links to AMSOIL Include Dealer ZO', () => {
    for (const pagePath of SITE_PAGES) {
      test(`should verify all outbound & referral links on page: ${pagePath}`, async ({ page, request }) => {
        await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

        // Extract all <a> tags from the rendered DOM
        const links = await page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll('a'));
          return anchors
            .map(a => ({
              href: a.getAttribute('href') || '',
              text: (a.textContent || '').trim().replace(/\s+/g, ' '),
              outerHTML: a.outerHTML,
            }))
            .filter(link => link.href.length > 0);
        });

        // Filter links: direct amsoil links vs /go referral links
        const directAmsoilLinks = links.filter(l => l.href.includes('amsoil.com'));
        const referralLinks = links.filter(l => l.href.startsWith('/go'));

        // 1. Direct AMSOIL Links: MUST contain ?zo= or &zo= matching EXPECTED_ZO
        for (const directLink of directAmsoilLinks) {
          const parsedUrl = new URL(directLink.href);
          const zoParam = parsedUrl.searchParams.get('zo');
          expect(
            zoParam,
            `Direct link to amsoil.com on ${pagePath} is missing ?zo=${EXPECTED_ZO}! Element: ${directLink.outerHTML}`
          ).toBe(EXPECTED_ZO);
        }

        // 2. Referral /go/* Links: MUST return HTTP 307 redirecting to amsoil.com with ?zo=EXPECTED_ZO
        const checkedHrefs = new Set<string>();
        for (const refLink of referralLinks) {
          if (checkedHrefs.has(refLink.href)) continue;
          checkedHrefs.add(refLink.href);

          const response = await request.get(refLink.href, { maxRedirects: 0 });
          expect(
            response.status(),
            `Referral route ${refLink.href} on ${pagePath} did not return redirect status!`
          ).toBe(307);

          const locationHeader = response.headers()['location'];
          expect(
            locationHeader,
            `Referral route ${refLink.href} on ${pagePath} missing Location header!`
          ).toBeDefined();

          const redirectUrl = new URL(locationHeader);
          expect(
            redirectUrl.hostname.endsWith('amsoil.com'),
            `Referral route ${refLink.href} does not redirect to amsoil.com! Redirected to: ${locationHeader}`
          ).toBe(true);

          const zoParam = redirectUrl.searchParams.get('zo');
          expect(
            zoParam,
            `Referral route ${refLink.href} redirect destination missing correct zo=${EXPECTED_ZO}! Destination: ${locationHeader}`
          ).toBe(EXPECTED_ZO);
        }
      });
    }
  });

  test.describe('Worker Edge Route Map (/go/*) Full Coverage', () => {
    for (const slug of EXPECTED_ROUTE_MAP_SLUGS) {
      test(`route /go/${slug} must 307 redirect to amsoil.com with zo=${EXPECTED_ZO}`, async ({ request }) => {
        const response = await request.get(`/go/${slug}`, { maxRedirects: 0 });
        expect(response.status()).toBe(307);

        const location = response.headers()['location'];
        expect(location).toBeDefined();

        const redirectUrl = new URL(location);
        expect(redirectUrl.hostname.endsWith('amsoil.com')).toBe(true);
        expect(redirectUrl.searchParams.get('zo')).toBe(EXPECTED_ZO);
      });
    }
  });

  test.describe('Dynamic Query Redirects and Fallbacks', () => {
    test('/go root should fallback to amsoil.com homepage with dealer ZO', async ({ request }) => {
      const response = await request.get('/go', { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      const location = response.headers()['location'];
      expect(location).toBe(`https://www.amsoil.com/?zo=${EXPECTED_ZO}`);
    });

    test('/go/unknown-route should fallback safely to amsoil.com with dealer ZO', async ({ request }) => {
      const response = await request.get('/go/unknown-custom-slug', { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      const location = response.headers()['location'];
      expect(location).toBe(`https://www.amsoil.com/?zo=${EXPECTED_ZO}`);
    });

    test('/go?to=relative/path should append dealer ZO to official amsoil destination', async ({ request }) => {
      const response = await request.get('/go?to=/c/marine/111/', { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      const location = response.headers()['location'];
      expect(location).toBe(`https://www.amsoil.com/c/marine/111/?zo=${EXPECTED_ZO}`);
    });

    test('/go?to=full-amsoil-url should append dealer ZO', async ({ request }) => {
      const target = 'https://www.amsoil.com/shop/by-product/motor-oil/';
      const response = await request.get(`/go?to=${encodeURIComponent(target)}`, { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      const location = response.headers()['location'];
      expect(location).toBe(`${target}?zo=${EXPECTED_ZO}`);
    });

    test('/go?to=malicious-domain should be blocked by open redirect protection (HTTP 400)', async ({ request }) => {
      const response = await request.get('/go?to=https://evil-phishing-site.com', { maxRedirects: 0 });
      expect(response.status()).toBe(400);
      const body = await response.text();
      expect(body).toContain('Invalid redirect destination');
    });
  });

});
