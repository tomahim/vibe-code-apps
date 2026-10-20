import { test, expect } from '@playwright/test';

const path = '/apps/app-ideas';
const slug = '048-hindsight-league';
const name = 'Hindsight League';
const card = (page) => page.locator('.idea-card').filter({ hasText: name });

async function ratings(page, initial = {}) {
  const values = { ...initial };
  await page.route('**/api/app-ideas/ratings', (route) => route.fulfill({ json: { ratings: values } }));
  await page.route('**/api/app-ideas/*/rate', async (route) => {
    values[route.request().url().split('/').at(-2)] = route.request().postDataJSON().rating;
    await route.fulfill({ json: { committed: true } });
  });
  return values;
}

test('a saved vote survives refresh without a new bundle, including clear and promising sort', async ({ page }) => {
  await ratings(page, {}); // API is authoritative, including when the bundled md has rating 1.
  await page.goto(path);
  await expect(card(page)).toBeVisible();
  await card(page).getByRole('button', { name: '1 star', exact: true }).click();
  await expect(card(page)).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(card(page)).toHaveCount(0);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await expect(card(page)).toBeVisible();
  await page.screenshot({ path: '/tmp/idea-ratings-archive.png', fullPage: true });
  await card(page).getByRole('button', { name: 'Clear rating, back to Inbox' }).click();
  await page.reload();
  await expect(card(page)).toBeVisible();
  await card(page).getByRole('button', { name: '3 stars', exact: true }).click();
  await page.getByRole('button', { name: /^Promising/ }).click();
  await expect(card(page)).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /^Promising/ }).click();
  await expect(card(page).getByRole('button', { name: '3 stars, tap to clear' })).toHaveAttribute('aria-pressed', 'true');
});

test('current GitHub rating moves an already-rated idea out of Inbox after reload', async ({ page }) => {
  const values = await ratings(page, { [slug]: 1 });
  await page.goto(path);
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(card(page)).toHaveCount(0);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await expect(card(page)).toBeVisible();
  values[slug] = 3; // Another device changed GitHub, no UI rebuild.
  await page.reload();
  await page.getByRole('button', { name: /^Promising/ }).click();
  await expect(card(page)).toBeVisible();
});

test('loading and errors do not masquerade as stale Inbox; retry recovers', async ({ page }) => {
  await page.route('**/api/app-ideas/ratings', (route) => route.fulfill({ status: 502, json: { error: 'GitHub unavailable' } }));
  await page.goto(path);
  await expect(page.getByRole('status')).toContainText('Could not load current ratings');
  await expect(page.locator('.idea-card')).toHaveCount(0);
  await ratings(page, { [slug]: 1 });
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await expect(card(page)).toBeVisible();
});

test('failed save rolls the current rating back', async ({ page }) => {
  await ratings(page, { [slug]: 1 });
  await page.route('**/api/app-ideas/*/rate', (route) => route.fulfill({ status: 502, json: { error: 'save failed' } }));
  await page.goto(path);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await card(page).getByRole('button', { name: '3 stars', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('save failed');
  await expect(card(page).getByRole('button', { name: '1 star, tap to clear' })).toHaveAttribute('aria-pressed', 'true');
});

test('Promising sorts by live ratings rather than bundled ratings', async ({ page }) => {
  await ratings(page, { '048-hindsight-league': 3, '046-favor-market': 2 });
  await page.goto(path);
  await page.getByRole('button', { name: /^Promising/ }).click();
  await expect(page.locator('.idea-card').first()).toContainText(name);
  await expect(page.locator('.idea-card').nth(1)).toContainText('Favor Market');
});
