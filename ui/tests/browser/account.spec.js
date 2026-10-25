import { test, expect } from '@playwright/test';

const USER = { email: 'someone@example.com', first_name: 'Thomas', last_name: 'Bolt' };

function signInStorage(page) {
  return page.addInitScript((user) => {
    localStorage.setItem('genious_token', 'fake-jwt');
    localStorage.setItem('genious_user', JSON.stringify(user));
  }, USER);
}

test('signed-in header shows the circled first-name initial, with profile and logout in the menu', async ({ page }) => {
  await signInStorage(page);
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/');

  // No "Log in" link while signed in; the avatar shows the first-name initial.
  await expect(page.getByRole('link', { name: 'Log in' })).toHaveCount(0);
  const avatar = page.getByRole('button', { name: 'Open your account menu' });
  await expect(avatar).toHaveText('T');

  await avatar.click();
  await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Log out' })).toBeVisible();

  // Profile page shows first and last name.
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  await page.waitForURL('**/profile');
  await expect(page.getByRole('heading', { name: 'Your profile.' })).toBeVisible();
  await expect(page.locator('.profile-field').filter({ hasText: 'First name' })).toContainText('Thomas');
  await expect(page.locator('.profile-field').filter({ hasText: 'Last name' })).toContainText('Bolt');

  // Logout clears the session and the header goes back to "Log in".
  await page.getByRole('button', { name: 'Open your account menu' }).click();
  await page.getByRole('menuitem', { name: 'Log out' }).click();
  await page.waitForURL('**/');
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('genious_token'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('genious_user'))).toBeNull();
});

test('the profile page redirects signed-out visitors to login', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/profile');
  await page.waitForURL('**/login');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
});

test('signed-out header still offers the plain Log in link', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open your account menu' })).toHaveCount(0);
});
