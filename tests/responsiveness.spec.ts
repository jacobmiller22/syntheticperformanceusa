import { test, expect } from '@playwright/test';

/**
 * Multi-device viewport matrix representing common real-world screen categories
 */
const DEVICE_VIEWPORTS = [
  { name: 'Mobile Small (iPhone SE 1st Gen / Galaxy S5)', width: 320, height: 568 },
  { name: 'Mobile Compact (iPhone SE 2nd/3rd Gen)', width: 375, height: 667 },
  { name: 'Mobile Standard (iPhone 13/14)', width: 390, height: 844 },
  { name: 'Mobile Android (Google Pixel 7)', width: 412, height: 915 },
  { name: 'Mobile Large (iPhone 14/15 Pro Max)', width: 430, height: 932 },
  { name: 'Tablet Portrait (iPad Mini)', width: 768, height: 1024 },
  { name: 'Tablet Landscape (iPad Air / Pro)', width: 1024, height: 768 },
  { name: 'Desktop Laptop (MacBook 13)', width: 1280, height: 800 },
  { name: 'Desktop Full HD (1080p Monitor)', width: 1920, height: 1080 },
  { name: 'Desktop Ultra Wide (1440p / 2K Display)', width: 2560, height: 1440 },
];

/**
 * All production-built static routes
 */
const SITE_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/shop-by-vehicle', name: 'Shop by Vehicle' },
  { path: '/preferred-customer', name: 'Preferred Customer' },
  { path: '/become-a-dealer', name: 'Become a Dealer' },
  { path: '/commercial-wholesale', name: 'Commercial & Fleet Wholesale' },
  { path: '/about', name: 'About Brandon' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/404', name: '404 Page' },
];

test.describe('Responsiveness Across Device Viewports', () => {
  for (const device of DEVICE_VIEWPORTS) {
    test.describe(`${device.name} [${device.width}x${device.height}]`, () => {
      
      for (const pageInfo of SITE_PAGES) {
        test(`should have zero horizontal overflow on ${pageInfo.name} (${pageInfo.path})`, async ({ page }) => {
          await page.setViewportSize({ width: device.width, height: device.height });
          const response = await page.goto(pageInfo.path, { waitUntil: 'domcontentloaded' });
          expect([200, 404]).toContain(response?.status());

          // Verify no horizontal overflow causing horizontal scrollbar
          const overflow = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const winWidth = window.innerWidth;
            const bodyWidth = document.body.scrollWidth;
            return {
              scrollWidth: Math.max(docWidth, bodyWidth),
              clientWidth: winWidth,
              hasOverflow: Math.max(docWidth, bodyWidth) > winWidth + 1,
            };
          });

          expect(
            overflow.hasOverflow,
            `Horizontal overflow detected on ${pageInfo.path} at viewport ${device.width}px! (scrollWidth: ${overflow.scrollWidth}, clientWidth: ${overflow.clientWidth})`
          ).toBe(false);

          // Header logo and H1 heading should always be rendered and visible
          const logo = page.locator('header img[alt="AMSOIL"]');
          await expect(logo).toBeVisible();

          const h1 = page.locator('h1');
          await expect(h1).toBeVisible();

          // Footer should always be present and visible
          const footer = page.locator('footer');
          await expect(footer).toBeVisible();
        });
      }

      test(`should correctly adapt navigation drawer vs desktop navbar on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const hamburgerBtn = page.locator('#mobile-menu-button');
        const mobileDrawer = page.locator('#mobile-menu');
        const desktopNav = page.locator('nav.hidden.xl\\:flex');

        if (device.width < 1280) {
          // Under xl breakpoint: Mobile hamburger must be visible, desktop nav hidden
          await expect(hamburgerBtn).toBeVisible();
          await expect(desktopNav).toBeHidden();

          // Mobile drawer should initially be hidden
          await expect(mobileDrawer).toBeHidden();

          // Clicking hamburger button should open the mobile drawer
          await hamburgerBtn.click();
          await expect(mobileDrawer).toBeVisible();

          // Verify nav links inside mobile drawer are visible
          const drawerLinks = mobileDrawer.locator('a');
          const drawerLinkCount = await drawerLinks.count();
          expect(drawerLinkCount).toBeGreaterThanOrEqual(6);

          // Clicking hamburger button again should collapse the drawer
          await hamburgerBtn.click();
          await expect(mobileDrawer).toBeHidden();
        } else {
          // At or above xl breakpoint: Desktop nav must be visible, mobile drawer & hamburger hidden
          await expect(desktopNav).toBeVisible();
          await expect(hamburgerBtn).toBeHidden();
          await expect(mobileDrawer).toBeHidden();
        }
      });

      test(`should render images within viewport boundaries without distortion on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        // Verify that all images on the page have width <= viewport width
        const imageOverflows = await page.evaluate((viewportWidth) => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs
            .map(img => {
              const rect = img.getBoundingClientRect();
              return {
                src: img.getAttribute('src'),
                width: rect.width,
                right: rect.right,
                exceedsViewport: rect.width > viewportWidth + 2,
              };
            })
            .filter(i => i.exceedsViewport);
        }, device.width);

        expect(
          imageOverflows,
          `Found images exceeding viewport width on ${device.name}: ${JSON.stringify(imageOverflows)}`
        ).toHaveLength(0);
      });

      test(`should ensure primary call-to-action buttons have valid touch/click areas on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        // Vehicle lookup button in Hero
        const heroLookupBtn = page.locator('main a[href="/go/lookup"]').first();
        await expect(heroLookupBtn).toBeVisible();
        const btnBox = await heroLookupBtn.boundingBox();
        expect(btnBox).not.toBeNull();
        if (btnBox) {
          expect(btnBox.width).toBeGreaterThan(120);
          expect(btnBox.height).toBeGreaterThanOrEqual(36);
        }
      });

    });
  }
});
