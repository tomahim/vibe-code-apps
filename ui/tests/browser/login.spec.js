import { test, expect } from '@playwright/test';

test('login page is reachable from the header and attempting to log in does nothing', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.waitForURL('**/login');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();

  const apiCalls = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/')) apiCalls.push(request.url());
  });

  await page.getByLabel('Email').fill('someone@example.com');
  await page.getByLabel('Password').fill('hunter2');
  await page.getByRole('button', { name: 'Log in' }).click();

  // No-op submit: same page, values untouched, no API call fired.
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Email')).toHaveValue('someone@example.com');
  await expect(page.getByLabel('Password')).toHaveValue('hunter2');
  expect(apiCalls).toEqual([]);
});
