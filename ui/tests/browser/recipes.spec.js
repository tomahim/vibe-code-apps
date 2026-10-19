import { test, expect } from '@playwright/test';
const path = '/apps/recipes';
const recipes = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1, title: ['Tomato pasta', 'Garden risotto', 'Lemon chicken', 'Roasted vegetables'][i % 4] + ` ${i + 1}`,
  ingredients: [{ name: 'tomato', quantity: '200 g' }, { name: 'pasta', quantity: '150 g' }],
  source_url: 'https://example.com/recipe', image_url: null,
}));
async function mock(page, list = recipes, winner = recipes[23]) {
  await page.route('**/api/apps/recipes/recipes/**', (route) => route.fulfill({ json: { recipes: list } }));
  await page.route('**/api/apps/recipes/random/**', (route) => route.fulfill({ json: winner }));
}

test('gallery opens the wheel even with the legacy admin card; API winner lands with details', async ({ page }) => {
  await mock(page);
  await page.route('**/api/apps/', (route) => route.fulfill({ json: { apps: [{ slug: 'recipes', name: 'Etchebest', href: '/admin/recipes/recipe/', action_label: 'Manage recipes' }] } }));
  await page.goto('/');
  await page.getByRole('button', { name: /Etchebest/ }).click();
  await expect(page).toHaveURL(new RegExp(path));
  await expect(page.getByRole('button', { name: 'Spin the wheel' })).toBeEnabled();
  await expect(page.locator('.recipe-wheel-canvas canvas')).toBeVisible();
  await page.screenshot({ path: '/tmp/etchebest-desktop.png', fullPage: true });
  const displayed = await page.locator('.recipes-wheel-list li').allTextContents();
  const winner = recipes.find((recipe) => !displayed.includes(recipe.title));
  await page.route('**/api/apps/recipes/random/**', (route) => route.fulfill({ json: winner }));
  await page.getByRole('button', { name: 'Spin the wheel' }).click();
  await expect(page.getByRole('button', { name: 'A little suspense' })).toBeDisabled();
  await expect(page.getByRole('heading', { name: winner.title })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.recipes-result')).toContainText('200 g');
  await expect(page.getByRole('link', { name: 'View the recipe' })).toHaveAttribute('href', winner.source_url);
  await expect(page.locator('.recipe-photo-placeholder')).toBeVisible();
  await page.getByText('Recipes on this wheel', { exact: true }).click();
  await expect(page.locator('.recipes-wheel-list li')).toHaveCount(10);
  await expect(page.locator('.recipes-wheel-list li[data-selected]')).toHaveText(winner.title);
  await page.getByRole('button', { name: 'All apps' }).click();
  await expect(page.getByRole('heading', { name: 'Find your next useful tool.' })).toBeVisible();
});

test('AND filters go to both endpoints, repeated slots, clear filters, and no matches', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests = [];
  await page.route('**/api/apps/recipes/**', (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    const list = url.searchParams.get('ingredients') === 'missing' ? [] : recipes.slice(0, 2);
    return route.fulfill({ json: url.pathname.includes('/random/') ? list[1] : { recipes: list } });
  });
  await page.goto(path);
  await page.getByLabel('Ingredients, separated by commas').fill(' Tomato, pasta, tomato ');
  await page.getByRole('button', { name: 'Find recipes' }).click();
  await expect(page.getByText('Using: tomato + pasta')).toBeVisible();
  await page.getByRole('button', { name: 'Spin the wheel' }).click();
  await expect(page.getByRole('heading', { name: recipes[1].title })).toBeVisible();
  expect(requests.filter((url) => url.searchParams.get('ingredients') === 'tomato,pasta')).toHaveLength(2);
  await expect(page.locator('.recipes-wheel-list li')).toHaveCount(10);
  await page.getByLabel('Ingredients, separated by commas').fill('missing');
  await page.getByRole('button', { name: 'Find recipes' }).click();
  await expect(page.getByText('No recipes on the menu.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spin the wheel' })).toBeDisabled();
  await expect(page.getByRole('heading', { name: recipes[1].title })).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Spin the wheel' })).toBeEnabled();
  expect(requests.at(-1).search).toBe('');
});

test('phone layout, photo reveal, broken photos, and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const photo = { ...recipes[0], image_url: '/test-recipe.svg' };
  await mock(page, [photo], photo);
  await page.route('**/test-recipe.svg', (route) => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#d9b276"/></svg>' }));
  await page.goto(path);
  await expect(page.locator('.recipe-photo')).toHaveCount(0);
  await page.getByRole('button', { name: 'Spin the wheel' }).click();
  await expect(page.getByRole('img', { name: photo.title, exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/etchebest-mobile.png', fullPage: true });
  await page.route('**/test-recipe.svg', (route) => route.abort());
  await page.reload();
  await page.getByRole('button', { name: 'Spin the wheel' }).click();
  await expect(page.getByText('Photo unavailable')).toBeVisible();
});

test('list failures retry and random errors never reveal an unrelated recipe', async ({ page }) => {
  await mock(page, recipes.slice(0, 1));
  await page.route('**/api/apps/recipes/recipes/**', (route) => route.fulfill({ status: 503, json: {} }));
  await page.goto(path);
  await expect(page.getByRole('alert')).toContainText('unavailable');
  await page.unroute('**/api/apps/recipes/recipes/**');
  await page.route('**/api/apps/recipes/recipes/**', (route) => route.fulfill({ json: { recipes: recipes.slice(0, 1) } }));
  await page.getByRole('button', { name: 'Try again' }).click();
  await page.route('**/api/apps/recipes/random/**', (route) => route.fulfill({ status: 503, json: {} }));
  await page.getByRole('button', { name: 'Spin the wheel' }).click();
  await expect(page.getByRole('alert')).toContainText('unavailable');
  await expect(page.getByRole('button', { name: 'Spin the wheel' })).toBeEnabled();
  await page.route('**/api/apps/recipes/random/**', (route) => route.fulfill({ status: 404, json: {} }));
  await page.getByRole('button', { name: 'Spin the wheel' }).click();
  await expect(page.getByText('No recipes on the menu.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spin the wheel' })).toBeDisabled();
});

test('WebGL unavailable falls back to a usable wheel', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith('webgl') ? null : original.call(this, type, ...args);
    };
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mock(page, recipes.slice(0, 2), recipes[1]);
  await page.goto(path);
  await expect(page.locator('.recipe-wheel-fallback')).toBeVisible();
  await page.getByRole('button', { name: 'Spin the wheel' }).click();
  await expect(page.getByRole('heading', { name: recipes[1].title })).toBeVisible();
});
