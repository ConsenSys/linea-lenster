import { APP_NAME } from '@lenster/data/constants';
import { expect, test } from '@playwright/test';
import { WEB_BASE_URL } from 'test/constants';

test.describe('Publication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${WEB_BASE_URL}/posts/0x0d-0x01`);
  });

  test.skip('should have publication title', async ({ page }) => {
    await expect(page).toHaveTitle(`Post by @alainnicolas • ${APP_NAME}`);
  });

  test.skip('should have publication', async ({ page }) => {
    const publication = page.getByTestId('publication-0x0d-0x01');
    await expect(publication).toBeVisible();
  });

  test.describe('Publication header', () => {
    test.skip('should have profile', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('@alainnicolas');
    });

    test.skip('should have menu', async ({ page }) => {
      const publicationMenu = page.getByTestId('publication-0x0d-0x01-menu');
      await publicationMenu.click();
      const localeSelectorMenuItems = page.getByTestId(
        'publication-0x0d-0x01-menu-items'
      );
      await expect(localeSelectorMenuItems).toContainText('Report Post');
      await expect(localeSelectorMenuItems).toContainText('Permalink');
      await expect(localeSelectorMenuItems).toContainText('Translate');
    });
  });

  test.describe('Publication body', () => {
    test.skip('should have body', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('gm frens 👋');
    });
  });

  test.describe('Publication meta', () => {
    test.skip('should have meta', async ({ page }) => {
      const publication = page.getByTestId('publication-0x0d-0x01');
      await expect(publication).toContainText('Posted via Lenster');
      await expect(publication).toContainText('May 18, 2022');
    });
  });

  test.describe('Publication stats', () => {
    test.skip('should have comment stats', async ({ page }) => {
      const publicationCommentStats = page
        .getByTestId('publication-0x0d-0x01')
        .getByTestId('comment-stats');
      await expect(publicationCommentStats).toContainText('Comments');
    });

    test.skip('should have mirror stats', async ({ page }) => {
      const publicationMirrorStats = page
        .getByTestId('publication-0x0d-0x01')
        .getByTestId('mirror-stats');
      await expect(publicationMirrorStats).toContainText('Mirror');

      // click mirror stats and check if it opens mirror modal
      await publicationMirrorStats.click();
      const mirrorsModal = page.getByTestId('mirrors-modal');
      await expect(mirrorsModal).toBeVisible();
    });

    test.skip('should have like stats', async ({ page }) => {
      const publicationLikeStats = page
        .getByTestId('publication-0x0d-0x01')
        .getByTestId('like-stats');
      await expect(publicationLikeStats).toContainText('Likes');

      // click like stats and check if it opens likes modal
      await publicationLikeStats.click();
      const likesModal = page.getByTestId('likes-modal');
      await expect(likesModal).toBeVisible();
    });

    test.skip('should have collect stats', async ({ page }) => {
      const publicationCollectStats = page
        .getByTestId('publication-0x0d-0x01')
        .getByTestId('collect-stats');
      await expect(publicationCollectStats).toContainText('Collects');

      // click collect stats and check if it opens collectors modal
      await publicationCollectStats.click();
      const collectorsModal = page.getByTestId('collectors-modal');
      await expect(collectorsModal).toBeVisible();
    });

    test.skip('should have comments feed', async ({ page }) => {
      await expect(page.getByTestId('comments-feed')).toBeVisible();
    });

    test.skip('should have none relevant feed', async ({ page }) => {
      await expect(page.getByTestId('none-relevant-feed')).toBeVisible();
    });
  });
});
