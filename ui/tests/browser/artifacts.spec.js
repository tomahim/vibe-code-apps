import { test, expect } from '@playwright/test';

const artifactPath = '/artifacts/2026-10-23-devflow';

test('gallery and archive share artwork and theme; search, filters, navigation work', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Genious Tools home' })).toBeVisible();
  const galleryColor = await page.locator('.gallery-page').evaluate(node => getComputedStyle(node).backgroundColor);
  await expect(page.locator('.collection-artwork')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search apps' }).fill('Rust');
  await expect(page.locator('.app-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Artifacts', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Artifacts.' })).toBeVisible();
  expect(await page.locator('.artifacts-page').evaluate(node => getComputedStyle(node).backgroundColor)).toBe(galleryColor);
  await expect(page.locator('.collection-artwork')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search the collection' }).fill('DARK workspace');
  await page.getByRole('button', { name: 'dashboard', exact: true }).click();
  await page.getByRole('combobox', { name: 'Added', exact: true }).selectOption('2026');
  await page.getByRole('combobox', { name: 'Sort by' }).selectOption('oldest');
  await expect(page.locator('.artifact-list > li')).toHaveCount(1);
  await page.getByRole('searchbox').fill('not-an-experiment');
  await expect(page.getByRole('heading', { name: 'No experiments found.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.artifact-list > li')).toHaveCount(1);
  await page.screenshot({ path: '/tmp/artifacts-desktop.png', fullPage: true });
  await page.getByRole('link', { name: /DevFlow/ }).click();
  await expect(page).toHaveURL(new RegExp(`${artifactPath}$`));
  await page.reload();
  await expect(page.frameLocator('iframe').getByRole('heading', { name: 'PR Dashboard', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'All artifacts' }).click();
  await page.getByRole('link', { name: 'Back to the tools' }).click();
  await page.screenshot({ path: '/tmp/gallery-desktop.png', fullPage: true });
});

test('standalone dashboard runs in the sandbox with working filters, dialogs and sections', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1250 });
  await page.goto(artifactPath);
  const frame = page.frameLocator('iframe');
  await expect(frame.locator('#review-summary')).toHaveText('Showing 10 of 23 PRs to review');
  await expect(page.locator('iframe')).toHaveAttribute('sandbox', 'allow-scripts');
  await page.screenshot({ path: '/tmp/devflow-desktop.png', fullPage: true });
  await frame.locator('.expand-reviews').first().click();
  await expect(frame.locator('#pr-rows tr')).toHaveCount(23);
  await frame.getByRole('button', { name: '#4821 Add caching layer for user service' }).click();
  await expect(frame.getByRole('dialog')).toBeVisible();
  await frame.getByRole('button', { name: 'Close PR details' }).click();
  await frame.getByRole('combobox', { name: 'Repository', exact: true }).selectOption('frontend');
  await expect(frame.locator('#pr-rows tr')).toHaveCount(4);
  await frame.getByRole('combobox', { name: 'Team', exact: true }).selectOption('Platform');
  await expect(frame.locator('#review-summary')).toHaveText('Showing 0 of 0 PRs to review');
  await frame.getByRole('combobox', { name: 'Repository', exact: true }).selectOption('');
  await frame.getByRole('combobox', { name: 'Team', exact: true }).selectOption('');
  await frame.getByRole('combobox', { name: 'Time Range' }).selectOption('1');
  await expect(frame.locator('#review-stat')).toHaveText('15');
  await frame.getByRole('link', { name: 'Leaderboard', exact: true }).click();
  await expect(frame.locator('#leaderboard')).toBeVisible();
  await expect(frame.locator('iframe')).toHaveCount(0);
  await frame.getByRole('button', { name: 'Settings', exact: true }).click();
  await frame.getByLabel('Compact rows').check();
  await frame.getByRole('button', { name: 'Close settings' }).click();
  await expect(frame.locator('body')).toHaveClass('compact');
  expect(errors).toEqual([]);
});

test('mobile pages fit the viewport and unknown artifacts have a recovery link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  for (const [path, name] of [['/', 'gallery'], ['/artifacts', 'artifacts'], [artifactPath, 'devflow']]) {
    await page.goto(path);
    if (name === 'devflow') await expect(page.frameLocator('iframe').locator('#review-stat')).toHaveText('23');
    else await expect(page.locator('.collection-artwork')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (name === 'devflow') expect(await page.frameLocator('iframe').locator('body').evaluate(node => node.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `/tmp/${name}-mobile.png`, fullPage: true });
  }
  await page.goto('/artifacts/missing');
  await expect(page.getByRole('heading', { name: 'Artifact not found.' })).toBeVisible();
  await page.getByRole('link', { name: 'Browse all artifacts' }).click();
  await expect(page).toHaveURL(/\/artifacts$/);
});
