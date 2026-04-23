import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-carousel-edit';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Initial render', () => {
  test('Renders 2 slides by default', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.slides).toHaveCount(2);
    await expect(edit.slideAt(0)).toContainText('Slide 1');
    await expect(edit.slideAt(1)).toContainText('Slide 2');
    await expect(edit.addSlideBtn).toBeVisible();
  });
});

test.describe('Slide management', () => {
  test('Adds a new slide', async ({ page }) => {
    const edit = new Edit(page);
    await edit.addSlideBtn.click();
    await expect(edit.slides).toHaveCount(3);
    await expect(edit.slideAt(2)).toContainText('Slide 3');
  });

  test('Deletes a slide', async ({ page }) => {
    const edit = new Edit(page);
    await edit.slideHeader(0).hover();
    await edit.deleteBtn(0).click();
    await edit.confirmationDialog
      .getByRole('button', { name: 'Confirm' })
      .click();
    await expect(edit.slides).toHaveCount(1);
  });
});

test.describe('Readonly mode', () => {
  test('Hides add/delete controls', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.addSlideBtn).not.toBeVisible();
    await edit.slideHeader(0).hover();
    await expect(edit.deleteBtn(0)).not.toBeVisible();
  });
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
