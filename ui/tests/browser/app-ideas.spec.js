import { test, expect } from '@playwright/test';

const path = '/apps/app-ideas';
const slug = '048-hindsight-league';
const name = 'Hindsight League';
const card = (page) => page.locator('.idea-card').filter({ hasText: name });
// Existing swipe/rating scenarios exercise the mobile default.
test.use({ viewport: { width: 390, height: 844 } });
// Exit the full-screen swipe deck to reach tabs and the grid.
// The List button exists both on the deck top bar and in the list toolbar.
const exitSwipe = (page) => page.getByRole('button', { name: 'List', exact: true }).click();

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
  await exitSwipe(page);
  await expect(card(page)).toBeVisible();
  await card(page).getByRole('button', { name: '1 star', exact: true }).click();
  await expect(card(page)).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(card(page)).toHaveCount(0);
  await exitSwipe(page);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await expect(card(page)).toBeVisible();
  await page.screenshot({ path: '/tmp/idea-ratings-archive.png', fullPage: true });
  await card(page).getByRole('button', { name: 'Clear rating, back to Inbox' }).click();
  await page.reload();
  await exitSwipe(page);
  await expect(card(page)).toBeVisible();
  await card(page).getByRole('button', { name: '3 stars', exact: true }).click();
  await page.getByRole('button', { name: /^Promising/ }).click();
  await expect(card(page)).toBeVisible();
  await page.reload();
  await exitSwipe(page);
  await page.getByRole('button', { name: /^Promising/ }).click();
  await expect(card(page).getByRole('button', { name: '3 stars, tap to clear' })).toHaveAttribute('aria-pressed', 'true');
});

test('current GitHub rating moves an already-rated idea out of Inbox after reload', async ({ page }) => {
  const values = await ratings(page, { [slug]: 1 });
  await page.goto(path);
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.locator('.idea-card')).toHaveCount(0); // swipe deck shows no grid cards
  await exitSwipe(page);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await expect(card(page)).toBeVisible();
  values[slug] = 3; // Another device changed GitHub, no UI rebuild.
  await page.reload();
  await exitSwipe(page);
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
  await exitSwipe(page);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await expect(card(page)).toBeVisible();
});

test('failed save rolls the current rating back', async ({ page }) => {
  await ratings(page, { [slug]: 1 });
  await page.route('**/api/app-ideas/*/rate', (route) => route.fulfill({ status: 502, json: { error: 'save failed' } }));
  await page.goto(path);
  await exitSwipe(page);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await card(page).getByRole('button', { name: '3 stars', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('save failed');
  await expect(card(page).getByRole('button', { name: '1 star, tap to clear' })).toHaveAttribute('aria-pressed', 'true');
});

test('Promising holds only 3 stars; 2 stars wait in Improve or drop with its cap', async ({ page }) => {
  await ratings(page, { '048-hindsight-league': 3, '046-favor-market': 2 });
  await page.goto(path);
  await exitSwipe(page);
  await page.getByRole('button', { name: /^Promising/ }).click();
  await expect(page.locator('.idea-card').first()).toContainText(name);
  await expect(page.locator('.idea-card')).toHaveCount(1); // Favor Market (2 stars) is not here
  await page.getByRole('button', { name: /^Improve or drop/ }).click();
  await expect(page.locator('.idea-card').first()).toContainText('Favor Market');
  await expect(page.getByRole('button', { name: /^Improve or drop/ })).toContainText('1/30');
});

test('Skip passes to the next idea without rating and the card comes back', async ({ page }) => {
  const fs = await import('node:fs/promises');
  const dir = new URL('../../src/apps/app-ideas/ideas/', import.meta.url);
  const slugs = (await fs.readdir(dir)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')).sort();
  const [first, second] = slugs; // deck deals oldest first
  const rest = Object.fromEntries(slugs.slice(2).map((s) => [s, 1]));
  let rated = false;
  await page.route('**/api/app-ideas/ratings', (route) => route.fulfill({ json: { ratings: rest } }));
  await page.route('**/api/app-ideas/*/rate', (route) => { rated = true; return route.fulfill({ json: { committed: true } }); });
  await page.goto(path);
  const deck = page.locator('.swipe-deck');
  await deck.waitFor();
  await expect(deck.locator('.swipe-card-name')).toHaveText(/./);
  const firstName = await deck.locator('.swipe-card-name').textContent();
  await expect(deck.locator('.swipe-hint-right')).toHaveText('Skip →');
  await deck.press('ArrowRight'); // swipe right = skip
  const secondName = await deck.locator('.swipe-card-name').textContent();
  expect(secondName).not.toEqual(firstName);
  await expect(deck.locator('.swipe-progress')).toHaveText('2 ideas left'); // nothing rated
  expect(rated).toBe(false);
  await deck.press('ArrowRight');
  await expect(deck.locator('.swipe-card-name')).toHaveText(firstName); // back of the deck
  expect(rated).toBe(false);
});

test('a full Improve or drop tab (30) blocks a new 2 stars with an explanation', async ({ page }) => {
  const fs = await import('node:fs/promises');
  const dir = new URL('../../src/apps/app-ideas/ideas/', import.meta.url);
  const slugs = (await fs.readdir(dir)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
  const full = Object.fromEntries(slugs.slice(0, 30).map((slug) => [slug, 2]));
  await ratings(page, full);
  await page.goto(path);
  const deck = page.locator('.swipe-deck');
  await deck.waitFor();
  const firstName = await deck.locator('.swipe-card-name').textContent();
  await deck.press('ArrowLeft'); // swipe left = 2 stars
  await expect(page.getByRole('alert')).toContainText('Improve or drop is full (30)');
  await expect(deck.locator('.swipe-card-name')).toHaveText(firstName); // card stays
  await deck.press('ArrowUp'); // other ratings still work
  await expect(deck.locator('.swipe-card-name')).not.toHaveText(firstName);
});

test('Inbox swipe deck: keys rate, details expands, back returns', async ({ page }) => {
  await ratings(page, {});
  await page.goto(path); // Inbox defaults to swipe mode
  const deck = page.locator('.swipe-deck');
  await expect(deck).toBeVisible();
  await expect(page.locator('.idea-card')).toHaveCount(0); // no grid in swipe mode
  const firstName = await deck.locator('.swipe-card-name').textContent();
  await expect(deck.locator('.swipe-card-pitch')).not.toBeEmpty();
  await expect(deck.locator('.star-rating')).toHaveCount(0); // only pitch + details, no star row
  await deck.getByRole('button', { name: 'Details' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('CREATIVE CONCEPT');
  await page.getByRole('button', { name: 'Back to the idea cards' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(deck.locator('.swipe-card-name')).toHaveText(firstName); // back to the same card
  await expect(deck.locator('.swipe-hint-left')).toHaveText('← 2 stars');
  await deck.press('ArrowUp'); // swipe up = 3 stars
  await expect(deck.locator('.swipe-card-name')).not.toHaveText(firstName); // deck advances
  await exitSwipe(page);
  await page.getByRole('button', { name: /^Promising/ }).click();
  await expect(page.locator('.idea-card').first()).toContainText(firstName);
});

test('Inbox swipe deck: a pointer swipe down archives the card', async ({ page }) => {
  await ratings(page, {});
  await page.goto(path);
  const deckCard = page.locator('.swipe-card');
  await expect(deckCard).toBeVisible();
  const firstName = await deckCard.locator('.swipe-card-name').textContent();
  const box = await deckCard.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx, cy + 200, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('.swipe-card-name')).not.toHaveText(firstName);
  await exitSwipe(page);
  await page.getByRole('button', { name: /^Archive/ }).click();
  await expect(page.locator('.idea-card').first()).toContainText(firstName);
});

for (const [width, mode] of [[390, 'swipe'], [700, 'swipe'], [701, 'list'], [1440, 'list']]) {
  test(`Inbox defaults to ${mode} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await ratings(page);
    await page.goto(path);
    await expect(page.locator(mode === 'swipe' ? '.swipe-deck' : '.ideas-grid')).toBeVisible();
    if (width === 390 || width === 1440) await page.screenshot({ path: `/tmp/ideas-default-${width}.png` });
    if (mode === 'swipe') {
      await expect(page.locator('.swipe-deck')).toBeVisible();
      await page.getByRole('button', { name: 'List', exact: true }).click();
      await expect(page.locator('.ideas-grid')).toBeVisible();
    } else {
      await expect(page.locator('.ideas-grid')).toBeVisible();
      await page.getByRole('button', { name: 'Swipe', exact: true }).click();
      await expect(page.locator('.swipe-deck')).toBeVisible();
    }
    await page.reload();
    await expect(page.locator(mode === 'swipe' ? '.swipe-deck' : '.ideas-grid')).toBeVisible();
  });
}

test('automatic default follows resize until a manual choice, which survives tabs and resize', async ({ page }) => {
  await ratings(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path);
  await expect(page.locator('.ideas-grid')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.swipe-deck')).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.ideas-grid')).toBeVisible();
  await page.getByRole('button', { name: 'Swipe', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.swipe-deck')).toBeVisible();
  await page.getByRole('button', { name: 'List', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.ideas-grid')).toBeVisible();
  await page.getByRole('button', { name: /^Promising/ }).click();
  await page.getByRole('button', { name: /^Inbox/ }).click();
  await expect(page.locator('.ideas-grid')).toBeVisible();
});
