import { test, expect } from '@playwright/test';

test('Little Grains is listed in the gallery and redirects to the login page', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/');

  const card = page.getByRole('button', { name: /Little Grains/ });
  await expect(card).toBeVisible();
  await card.click();

  // No session exists yet, so the empty app lands on the login page.
  await page.waitForURL('**/login');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
  // The old explanatory note under the form is gone.
  await expect(page.getByText(/enabled yet/)).toHaveCount(0);
});
