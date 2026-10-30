import { test, expect } from '@playwright/test';
const path = '/artifacts/2026-10-30-repo-factory';
async function ready(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(path);
  const f = page.frameLocator('iframe');
  await expect(f.locator('#loading')).toBeHidden();
  await f.locator('canvas').evaluate(() => window.__factory.ready());
  return { f, errors };
}
const settle = (page, ms = 1400) => page.waitForTimeout(ms);

test('factory replays the baked history to completion with real counts', async ({ page }) => {
  const { f, errors } = await ready(page);
  await expect(page.locator('iframe')).toHaveAttribute('sandbox', 'allow-scripts');
  await settle(page, 2500);
  await page.screenshot({ path: '/downloads/factory-desktop-start.png' });
  await f.locator('canvas').evaluate(() => window.__factory.scrubTo(0.62));
  await settle(page);
  await page.screenshot({ path: '/downloads/factory-desktop-mid.png' });
  const mid = await f.locator('canvas').evaluate(() => window.__factory.state);
  expect(mid.merged).toBeGreaterThan(80);
  expect(mid.repo).toBe('tomahim/vibe-code-apps');
  await f.locator('canvas').evaluate(() => window.__factory.finish());
  await settle(page, 600);
  const end = await f.locator('canvas').evaluate(() => window.__factory.state);
  expect(end.merged).toBe(181);
  expect(end.gears).toBe(181);
  expect(end.supplies).toBe(180);
  expect(end.finale).toBe(true);
  await expect(f.locator('#stat-date')).toHaveText('30 Oct 2026');
  await expect(f.locator('#stat-merged')).toHaveText('181');
  await page.screenshot({ path: '/downloads/factory-desktop-final.png' });
  expect(errors).toEqual([]);
});

test('transport controls: pause, restart, speed, scrub date', async ({ page }) => {
  const { f, errors } = await ready(page);
  await f.locator('#play').click();
  await expect(f.locator('#play')).toHaveText('▶');
  await f.locator('#speed').click();
  await expect(f.locator('#speed')).toHaveText('2×');
  await f.locator('#restart').click();
  await expect(f.locator('#play')).toHaveText('⏸');
  const s1 = await f.locator('canvas').evaluate(() => window.__factory.state);
  expect(s1.EP).toBeLessThan(8);
  expect(s1.merged).toBe(0);
  await f.locator('#today').click();
  await expect(f.locator('#stat-merged')).toHaveText('181');
  expect(errors).toEqual([]);
});

test('phone layout: no overflow, compact stats, reduced motion starts paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  const { f, errors } = await ready(page);
  await expect(f.locator('#play')).toHaveText('▶');
  await settle(page, 900);
  await page.screenshot({ path: '/downloads/factory-mobile-start.png' });
  expect(await f.locator('body').evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await f.locator('canvas').evaluate(() => window.__factory.scrubTo(0.55));
  await settle(page, 800);
  await page.screenshot({ path: '/downloads/factory-mobile-mid.png' });
  await f.locator('canvas').evaluate(() => window.__factory.finish());
  await settle(page, 600);
  await page.screenshot({ path: '/downloads/factory-mobile-final.png' });
  const end = await f.locator('canvas').evaluate(() => window.__factory.state);
  expect(end.merged).toBe(181);
  expect(errors).toEqual([]);
});

test('gate dialog opens, validates input, reports errors honestly', async ({ page }) => {
  const { f, errors } = await ready(page);
  await f.locator('#open-gate').click();
  await expect(f.locator('#gate')).toBeVisible();
  await f.locator('#gate-input').fill('not a repo');
  await f.locator('#gate-go').click();
  await expect(f.locator('#gate-msg')).toContainText('owner/repo');
  await f.locator('#gate-cancel').click();
  await expect(f.locator('#gate')).toBeHidden();
  expect(errors).toEqual([]);
});
