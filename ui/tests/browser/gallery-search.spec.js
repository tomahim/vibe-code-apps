import { test, expect } from '@playwright/test';

for (const viewport of [{ name: 'desktop', width: 1440, height: 1100 }, { name: 'mobile', width: 390, height: 844 }]) {
  test.describe(`gallery search on ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ page }) => {
      await page.route('**/api/apps/', (route) => route.fulfill({ json: { apps: [] } }));
      await page.goto('/');
    });

    test('filters immediately, ignores case and surrounding spaces, and clears', async ({ page }) => {
      const search = page.getByRole('searchbox', { name: 'Search apps' });
      const cards = page.locator('.app-card');
      await expect(cards).toHaveCount(11);
      await expect(page.getByRole('status')).toHaveText('11 apps to explore');
      await page.screenshot({ path: `test-results/gallery-${viewport.name}.png`, fullPage: true });
      // One real keystroke must filter without submitting or leaving the field.
      await search.pressSequentially('v');
      await expect(cards).toHaveCount(9);
      await page.screenshot({ path: `test-results/gallery-${viewport.name}-one-character.png`, fullPage: true });
      await expect(search).toBeFocused();
      await search.fill('  RUST  ');
      await expect(cards).toHaveCount(1);
      await expect(cards).toContainText('Rust learning path');
      await page.screenshot({ path: `test-results/gallery-${viewport.name}-filtered.png`, fullPage: true });
      await page.getByRole('button', { name: 'Clear search', exact: true }).click();
      await expect(cards).toHaveCount(11);
      await expect(search).toBeFocused();
      await expect(search).toHaveValue('');
      await expect(page.getByRole('button', { name: 'Clear search', exact: true })).toHaveCount(0);
      await search.fill('xyz-no-such-tool');
      await expect(cards).toHaveCount(0);
      await expect(page.getByText('No apps found. Try another name, category or keyword.')).toBeVisible();
      await expect(page.getByRole('status')).toContainText('0 apps matching');
      await page.screenshot({ path: `test-results/gallery-${viewport.name}-empty.png`, fullPage: true });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await search.fill('   ');
      await expect(cards).toHaveCount(11);
    });

    test('matches category and description and keeps app navigation', async ({ page }) => {
      const search = page.getByRole('searchbox', { name: 'Search apps' });
      await search.fill('creative coding');
      await expect(page.locator('.app-card')).toHaveCount(2);
      await expect(page.locator('.app-card').filter({hasText:'Three.js learning path'})).toBeVisible();
      await search.fill('compiler feedback');
      await expect(page.locator('.app-card')).toHaveCount(1);
      await page.locator('.app-card').click();
      await expect(page).toHaveURL(/\/apps\/rust-learning-path/);
    });
  });
}

test('search includes API-provided apps and works if the API fails', async ({ page }) => {
  await page.route('**/api/apps/', (route) => route.fulfill({ json: { apps: [{ slug: 'api-tool', name: 'API Tool', description: 'A remote tool', category: 'Utilities' }] } }));
  await page.goto('/');
  await expect(page.locator('.app-card')).toHaveCount(12);
  await page.getByRole('searchbox', { name: 'Search apps' }).fill('utilities');
  await expect(page.locator('.app-card')).toHaveCount(1);
  await expect(page.locator('.app-card')).toContainText('API Tool');
  await page.route('**/api/apps/', (route) => route.fulfill({ status: 500, body: '' }));
  await page.reload();
  await expect(page.locator('.app-card')).toHaveCount(11);
  await page.getByRole('searchbox', { name: 'Search apps' }).fill('rust');
  await expect(page.locator('.app-card')).toHaveCount(1);
});
