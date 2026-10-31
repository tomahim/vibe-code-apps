import { test, expect } from '@playwright/test';

// The night-shift scene compiles many shaders on first render; under software
// WebGL (CI / headless swiftshader) the main thread can stall for tens of
// seconds, so give these tests headroom beyond the default 30s.
test.setTimeout(90000);
const path = '/artifacts/2026-10-30-repo-factory';

// Every factory (home included) now loads live from the anonymous GitHub API,
// so the tests stub api.github.com with a small deterministic fixture.
const REPO = {
  full_name: 'tomahim/vibe-code-apps',
  created_at: '2026-03-07T10:00:00Z',
  pushed_at: '2026-10-31T09:00:00Z',
};
const PRS = [
  { number: 3, title: 'Third machine', user: { login: 'tomahim' }, created_at: '2026-10-28T08:00:00Z', merged_at: '2026-10-29T18:00:00Z', closed_at: '2026-10-29T18:00:00Z', head: { ref: 'third' } },
  { number: 1, title: 'First machine', user: { login: 'tomahim' }, created_at: '2026-10-20T08:00:00Z', merged_at: '2026-10-21T18:00:00Z', closed_at: '2026-10-21T18:00:00Z', head: { ref: 'first' } },
  { number: 2, title: 'Unmerged idea', user: { login: 'tomahim' }, created_at: '2026-10-25T08:00:00Z', merged_at: null, closed_at: '2026-10-26T18:00:00Z', head: { ref: 'idea' } },
  { number: 4, title: 'Second machine', user: { login: 'ghosty' }, created_at: '2026-10-26T08:00:00Z', merged_at: '2026-10-27T18:00:00Z', closed_at: '2026-10-27T18:00:00Z', head: { ref: 'second' } },
];
async function stubGithub(page) {
  await page.route('https://api.github.com/**', (route) => {
    const url = route.request().url();
    if (url.includes('/pulls')) return route.fulfill({ json: PRS });
    return route.fulfill({ json: REPO });
  });
}
async function ready(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await stubGithub(page);
  await page.goto(path);
  const f = page.frameLocator('iframe');
  await expect(f.locator('#loading')).toBeHidden();
  await f.locator('canvas').evaluate(() => window.__factory.ready());
  return { f, errors };
}
const settle = (page, ms = 1400) => page.waitForTimeout(ms);

test('home factory loads live and replays merged PRs to completion', async ({ page }) => {
  const { f, errors } = await ready(page);
  await expect(page.locator('iframe')).toHaveAttribute('sandbox', 'allow-scripts');
  await expect(f.locator('#factory-sub')).toContainText('live from GitHub');
  await settle(page, 2500);
  await page.screenshot({ path: '/downloads/factory-desktop-start.png' });
  await f.locator('canvas').evaluate(() => window.__factory.scrubTo(0.62));
  await settle(page);
  await page.screenshot({ path: '/downloads/factory-desktop-mid.png' });
  const mid = await f.locator('canvas').evaluate(() => window.__factory.state);
  expect(mid.repo).toBe('tomahim/vibe-code-apps');
  expect(mid.home).toBe(true);
  await f.locator('canvas').evaluate(() => window.__factory.finish());
  await settle(page, 600);
  const end = await f.locator('canvas').evaluate(() => window.__factory.state);
  expect(end.merged).toBe(3);           // only merged PRs replay
  expect(end.gears).toBe(3);
  expect(end.supplies).toBe(0);         // no direct-commit supply runs in live mode
  expect(end.finale).toBe(true);
  await expect(f.locator('#stat-date')).toHaveText('29 Oct 2026');
  await expect(f.locator('#stat-merged')).toHaveText('3');
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
  await expect(f.locator('#stat-merged')).toHaveText('3');
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
  expect(end.merged).toBe(3);
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

test('a failed live load shows an honest error with a working retry', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('https://api.github.com/**', (route) => route.fulfill({
    status: 403,
    headers: { 'x-ratelimit-reset': '1900000000' },
    json: { message: 'API rate limit exceeded' },
  }));
  await page.goto(path);
  const f = page.frameLocator('iframe');
  await expect(f.locator('#loading')).toBeHidden();
  await expect(f.locator('#error')).toBeVisible();
  await expect(f.locator('#error')).toContainText('rate limit');
  await page.unroute('https://api.github.com/**');
  await stubGithub(page);
  await f.locator('#error-retry').click();
  await expect(f.locator('#error')).toBeHidden();
  await f.locator('canvas').evaluate(() => window.__factory.ready());
  const s = await f.locator('canvas').evaluate(() => window.__factory.state);
  expect(s.repo).toBe('tomahim/vibe-code-apps');
  expect(s.total).toBe(6);              // open+merge events for the 3 merged PRs
  expect(errors).toEqual([]);
});
