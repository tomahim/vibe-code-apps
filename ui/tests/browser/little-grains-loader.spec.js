import { test, expect } from '@playwright/test';

// Cold-start loader and keep-alive heartbeat, against a controllable health
// fixture. No live account, API or database is used.
// Window overrides (__GRAINS_HEALTH_* / __GRAINS_KEEP_AWAKE_MS__) make the
// retry loop fast; __grainsVisibility fakes tab visibility.
async function fixture(page, { maxAttempts = 4, retryMs = 300, keepAwakeMs = 80 } = {}) {
  const state = { calls: 0, failCount: 0 };
  await page.addInitScript(([max, retry, keep]) => {
    localStorage.setItem('genious_token', 'loader-fixture');
    window.__GRAINS_HEALTH_MAX_ATTEMPTS__ = max;
    window.__GRAINS_HEALTH_RETRY_MS__ = retry;
    window.__GRAINS_KEEP_AWAKE_MS__ = keep;
    window.__grainsVisibility = 'visible';
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => window.__grainsVisibility });
  }, [maxAttempts, retryMs, keepAwakeMs]);
  await page.route('**/api/learning/health/', route => {
    state.calls += 1;
    if (state.failCount > 0) { state.failCount -= 1; return route.fulfill({ status: 503, json: { status: 'error', database: 'unreachable' } }); }
    return route.fulfill({ json: { status: 'ok', database: 'ok' } });
  });
  await page.route('**/api/learning/garden/', route => route.fulfill({ json: { themes: [], rewards: {}, recent_lessons: [] } }));
  return state;
}

const setVisibility = (page, value) => page.evaluate((next) => {
  window.__grainsVisibility = next;
  document.dispatchEvent(new Event('visibilitychange'));
}, value);

test('loader waits out a sleeping api, then loads the garden', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await fixture(page, { maxAttempts: 6, retryMs: 300 });
  state.failCount = 3;
  await page.goto('/apps/little-grains');
  const loader = page.locator('.grains-loader');
  await expect(loader).toBeVisible();
  await expect(loader.getByRole('heading')).toHaveText(/waking up/i);
  await expect(loader.locator('.grains-carton')).toBeVisible();
  await expect(page.getByText('Your garden is ready')).toBeVisible({ timeout: 10000 });
  await expect(loader).toHaveCount(0);
  expect(state.calls).toBeGreaterThanOrEqual(4); // 3 failed attempts + the successful one
});

test('exhausted retries show Try again, which recovers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await fixture(page, { maxAttempts: 3, retryMs: 60 });
  state.failCount = 9999;
  await page.goto('/apps/little-grains');
  await expect(page.getByText('The garden is taking too long to wake up.')).toBeVisible({ timeout: 10000 });
  const retry = page.getByRole('button', { name: 'Try again' });
  await expect(page.locator('.grains-loader')).toHaveCSS('opacity', '1'); // Past the fade-in delay, so the shot is real.
  await page.addStyleTag({ content: '.grains-carton-fill{animation:none!important;height:38px!important;opacity:1!important}' }); // Freeze a real mid-fill frame for a stable capture.
  await page.screenshot({ path: '/tmp/lg-loader-exhausted.png' });
  state.failCount = 0;
  await retry.click();
  await expect(page.getByText('Your garden is ready')).toBeVisible({ timeout: 10000 });
});

test('waking loader is mobile-friendly and shows the filling carton', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await fixture(page, { maxAttempts: 50, retryMs: 300 });
  state.failCount = 9999;
  await page.goto('/apps/little-grains');
  const loader = page.locator('.grains-loader');
  await expect(loader).toBeVisible();
  await expect(loader.getByText(/attempt 1/)).toBeVisible();
  await expect(loader).toHaveCSS('opacity', '1'); // Past the fade-in delay, so the shot is real.
  await page.addStyleTag({ content: '.grains-carton-fill{animation:none!important;height:38px!important;opacity:1!important}' }); // Freeze a real mid-fill frame for a stable capture.
  await page.screenshot({ path: '/tmp/lg-loader-waking.png' });
  // No sideways scrolling, carton stays centered.
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect(state.calls).toBeGreaterThan(0);
});

test('keep-alive pings every interval while visible, pauses when hidden', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await fixture(page, { maxAttempts: 2, retryMs: 50, keepAwakeMs: 80 });
  await page.goto('/apps/little-grains');
  await expect(page.getByText('Your garden is ready')).toBeVisible({ timeout: 10000 });
  const readyCalls = state.calls;
  await expect.poll(() => state.calls, { timeout: 3000 }).toBeGreaterThan(readyCalls + 2);
  await setVisibility(page, 'hidden');
  const hiddenCalls = state.calls;
  await page.waitForTimeout(300);
  expect(state.calls).toBeLessThanOrEqual(hiddenCalls + 1); // one in-flight ping may land
  await setVisibility(page, 'visible');
  await expect.poll(() => state.calls, { timeout: 3000 }).toBeGreaterThan(hiddenCalls + 1);
});

test('the carton is the only loader through the whole startup', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await fixture(page, { maxAttempts: 4, retryMs: 200 });
  state.failCount = 2; // spend a moment in the waking phase
  // Hold the garden response back so the data-loading phase is observable.
  let releaseGarden;
  const gardenGate = new Promise((resolve) => { releaseGarden = resolve; });
  await page.route('**/api/learning/garden/', async (route) => {
    await gardenGate;
    return route.fulfill({ json: { themes: [], rewards: {}, recent_lessons: [] } });
  });
  await page.goto('/apps/little-grains');
  const loader = page.locator('.grains-loader');
  await expect(loader).toBeVisible(); // waking phase: carton plus messages
  await expect(loader).toHaveCount(1);
  await expect(loader.getByText(/attempt/)).toBeVisible();
  // Api awake, garden fetch still in flight: the same loader, now bare.
  await expect(loader.getByText(/attempt/)).toHaveCount(0, { timeout: 5000 });
  await expect(loader).toHaveCount(1);
  await expect(loader.locator('.grains-carton')).toBeVisible();
  await expect(page.getByText(/opening the garden/i)).toHaveCount(0);
  await expect(page.getByText(/planting your garden/i)).toHaveCount(0);
  releaseGarden();
  await expect(page.getByText('Your garden is ready')).toBeVisible({ timeout: 10000 });
  await expect(loader).toHaveCount(0);
});
