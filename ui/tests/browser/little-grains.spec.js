import { test, expect } from '@playwright/test';

test('Little Grains is listed in the gallery and redirects visitors to the login page', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/');

  const card = page.getByRole('button', { name: /Little Grains/ });
  await expect(card).toBeVisible();
  await card.click();

  // No stored token, so the app sends the visitor to sign in.
  await page.waitForURL('**/login');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
});

test('a signed-in visitor sees their lessons as cards', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.route('**/api/apps/little-grains/lessons', route => {
    expect(route.request().headers()['authorization']).toBe('Bearer fake-jwt');
    route.fulfill({
      json: {
        lessons: [
          { id: 1, title: 'Why tiny lessons win' },
          { id: 2, title: 'Spaced repetition in five minutes' },
        ],
      },
    });
  });

  await page.goto('/apps/little-grains');
  await expect(page.getByRole('heading', { name: 'Your lessons for today.' })).toBeVisible();
  await expect(page.getByText('Why tiny lessons win')).toBeVisible();
  await expect(page.getByText('Spaced repetition in five minutes')).toBeVisible();
});

test('an expired token is dropped and the visitor is sent back to login', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'stale-jwt'));
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.route('**/api/apps/little-grains/lessons', route =>
    route.fulfill({ status: 401, json: { error: 'Your session expired. Sign in again.' } }));

  await page.goto('/apps/little-grains');
  await page.waitForURL('**/login');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('genious_token'))).toBeNull();
});
