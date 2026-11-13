import { test, expect } from '@playwright/test';
const destination = 'https://vibe-music-https.tailfd1cee.ts.net/apps/music-library';
for (const scenario of ['offline catalog', 'legacy API destination']) {
  test(`music card uses private HTTPS with ${scenario}`, async ({ page }) => {
    await page.route('**/api/apps/', route => scenario === 'offline catalog'
      ? route.abort()
      : route.fulfill({ json: { apps: [
          { slug: 'music-library', name: 'Music generation library', href: '/apps/music-library' },
          { slug: 'story-shelf', name: 'The Story Room' },
        ] } }));
    await page.route(destination, route => route.fulfill({ contentType: 'text/html', body: '<h1>Expected music destination</h1>' }));
    await page.goto('/');
    await page.locator('.app-card').filter({ hasText: 'The Story Room' }).click();
    await expect(page).toHaveURL(/\/apps\/story-shelf$/);
    await page.goto('/');
    await page.locator('.app-card').filter({ hasText: 'Music generation library' }).click();
    await expect(page).toHaveURL(destination);
    await expect(page.getByRole('heading', { name: 'Expected music destination' })).toBeVisible();
  });
}
test('music card search and favorites keep working', async ({ page }) => {
  await page.route('**/api/apps/', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Add Music generation library to favorites' }).click();
  await page.locator('#app-search').fill('music');
  await expect(page.locator('.app-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Remove Music generation library from favorites' })).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: '/tmp/gallery-music-https.png', fullPage: true });
});
