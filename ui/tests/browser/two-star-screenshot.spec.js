import { test, expect } from '@playwright/test';

test('app-ideas two-star lifecycle screenshots', async ({ page }) => {
  await page.addInitScript(() => {
    const store = {};
    Object.defineProperty(window, 'localStorage', { value: {
      getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }, clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
      key: (i) => Object.keys(store)[i] ?? null, get length() { return Object.keys(store).length; },
    }, configurable: true });
  });
  const fs = await import('node:fs/promises');
  const dir = new URL('../../src/apps/app-ideas/ideas/', import.meta.url);
  const slugs = (await fs.readdir(dir)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
  const full = Object.fromEntries(slugs.slice(0, 30).map((s) => [s, 2]));
  await page.route('**/api/app-ideas/ratings', (route) => {
    if (route.request().method() === 'GET') route.fulfill({ json: { ratings: full } });
    else route.fulfill({ json: { ok: true } });
  });
  await page.route('**/api/app-ideas/*/rate', (route) => route.fulfill({ json: { committed: true } }));
  await page.goto('/apps/app-ideas');
  const deck = page.locator('.swipe-deck');
  await deck.waitFor();
  await deck.press('ArrowLeft');
  await expect(page.getByRole('alert')).toContainText('Improve or drop is full');
  await page.screenshot({ path: '/tmp/shot2-cap.png' });
  await page.getByRole('button', { name: 'List' }).click();
  await expect(page.locator('.ideas-grid').first()).toBeVisible();
  await page.getByRole('button', { name: /^Improve or drop/ }).click();
  await page.screenshot({ path: '/tmp/shot2-improve.png' });
});
