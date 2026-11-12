import { test, expect } from '@playwright/test';

test('login signs in, stores the token and returns to the gallery', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.route('**/api/auth/login', route => {
    const body = route.request().postDataJSON();
    expect(body).toEqual({ email: 'someone@example.com', password: 'hunter2' });
    route.fulfill({ json: { token: 'fake-jwt', user: { email: 'someone@example.com', first_name: 'Thomas', last_name: 'Bolt' } } });
  });

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();

  await page.getByLabel('Email').fill('someone@example.com');
  await page.getByLabel('Password').fill('hunter2');
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForURL(url => url.pathname === '/');
  expect(await page.evaluate(() => localStorage.getItem('genious_token'))).toBe('fake-jwt');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('genious_user')));
  expect(stored).toEqual({ email: 'someone@example.com', first_name: 'Thomas', last_name: 'Bolt' });
});

test('login shows an error and stays put when credentials are rejected', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.route('**/api/auth/login', route =>
    route.fulfill({ status: 401, json: { error: 'Wrong email or password.' } }));

  await page.goto('/login');
  await page.getByLabel('Email').fill('someone@example.com');
  await page.getByLabel('Password').fill('wrong');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('alert')).toHaveText('Wrong email or password.');
  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate(() => localStorage.getItem('genious_token'))).toBeNull();
});
