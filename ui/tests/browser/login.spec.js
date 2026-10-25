import { test, expect } from '@playwright/test';

test('login signs in, stores the token and lands on Little Grains lessons', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.route('**/api/auth/login', route => {
    const body = route.request().postDataJSON();
    expect(body).toEqual({ email: 'someone@example.com', password: 'hunter2' });
    route.fulfill({ json: { token: 'fake-jwt', user: { email: 'someone@example.com', first_name: 'Thomas', last_name: 'Bolt' } } });
  });
  const lessonsCalls = [];
  await page.route('**/api/apps/little-grains/lessons', route => {
    lessonsCalls.push(route.request().headers()['authorization']);
    route.fulfill({ json: { lessons: [{ id: 1, title: 'One tiny lesson' }] } });
  });

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();

  await page.getByLabel('Email').fill('someone@example.com');
  await page.getByLabel('Password').fill('hunter2');
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForURL('**/apps/little-grains');
  await expect(page.getByText('One tiny lesson')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('genious_token'))).toBe('fake-jwt');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('genious_user')));
  expect(stored).toEqual({ email: 'someone@example.com', first_name: 'Thomas', last_name: 'Bolt' });
  // StrictMode runs the effect twice in dev; every call must carry the token.
  expect(lessonsCalls.length).toBeGreaterThan(0);
  expect(new Set(lessonsCalls)).toEqual(new Set(['Bearer fake-jwt']));
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
