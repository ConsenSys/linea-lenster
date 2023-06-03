import { APP_NAME } from '@lenster/data/constants';
import { expect, test } from '@playwright/test';
import { PRERENDER_BASE_URL } from 'test/constants';

test.beforeEach(async ({ page }) => {
  await page.goto(`${PRERENDER_BASE_URL}/posts/0x03-0x13`);
});

test.skip('should have page title', async ({ page }) => {
  await expect(page).toHaveTitle(`Post by @yoginth.lens • ${APP_NAME}`);
});

test.skip('should have publication', async ({ page }) => {
  await expect(page.getByTestId('publication-0x03-0x13')).toContainText(
    'gm frens 👋'
  );
});

test.skip('should have comment feed', async ({ page }) => {
  await expect(page.getByTestId('comment-feed')).toBeVisible();
});
