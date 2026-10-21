import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('app-ideas skip button screenshot', async ({ page }) => {
  await page.route('**/api/app-ideas/ratings', (route) => route.fulfill({ json: { ratings: {} } }));
  await page.route('**/api/app-ideas/*/rate', (route) => route.fulfill({ json: { committed: true } }));
  await page.goto('/apps/app-ideas');
  const deck = page.locator('.swipe-deck');
  await deck.waitFor();
  await expect(deck.getByRole('button', { name: 'Skip: next idea, no rating' })).toBeVisible();
  await page.screenshot({ path: '/tmp/shot3-skip.png' });
});
