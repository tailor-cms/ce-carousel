import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-carousel-display';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Default state', () => {
  test('Renders the carousel', async ({ page }) => {
    const display = new Display(page);
    await expect(display.carousel).toBeVisible();
  });
});

test.describe('Custom slides', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      embeds: {},
      items: {
        a: { id: 'a', body: {}, position: 1 },
        b: { id: 'b', body: {}, position: 2 },
        c: { id: 'c', body: {}, position: 3 },
      },
      height: 300,
    });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Renders a VCarousel with items', async ({ page }) => {
    const display = new Display(page);
    await expect(display.carousel).toBeVisible();
    // VCarousel lazy-renders; pagination dots reflect slide count
    await expect(display.carousel.locator('.v-btn--icon')).toHaveCount(3);
  });
});
