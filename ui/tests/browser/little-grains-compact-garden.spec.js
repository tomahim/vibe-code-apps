import { test, expect } from '@playwright/test';

// Synthetic progress and rewards only. No production API or database access.
const progress = { cards_completed: 2, cards_total: 10, lessons_completed: 0, lessons_total: 1, questions_correct: 0, questions_total: 1, started: true, completed: false };
const row = (id, title) => ({ id, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
const titles = ['Energy', 'Language', 'Life & Society', 'Sport', 'Tech & AI', 'Diving N4 #1', 'Diving N4 #2'];
async function setup(page) {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  await page.route('**/api/learning/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (path.endsWith('/garden/')) return route.fulfill({ json: {
      themes: titles.map((title, i) => ({ ...row(i === 5 ? 'bd957ab9-8aa7-4f8c-970f-c858f4cbec04' : i === 6 ? 'e0fecbd7-085e-4f6e-8fdb-afd4f52a3f8b' : `theme-${i}`, title), progress, learning_paths: [{ ...row(`path-${i}`, 'A learning path'), progress, lessons: [{ ...row(`lesson-${i}`, 'First lesson'), progress }] }] })),
      rewards: { drops: 1284, carrots: 212 }, recent_lessons: [],
    } });
    if (path.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], earned_count: 0, new_count: 0 } });
    return route.fulfill({ json: {} });
  });
  await page.goto('/apps/little-grains');
}
for (const mobile of [true, false]) {
  test(`${mobile ? 'mobile' : 'desktop'}: compact garden and preserved navigation`, async ({ page, browserName }) => {
    test.setTimeout(90000);
    await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
    await setup(page);
    const root = page.locator('.lg-root');
    await expect(root).toBeVisible();
    await expect(root.locator('.lg-crumbs')).toBeHidden();
    await expect(root.locator('.lg-stats .info, .lg-stats [data-reward] small')).toHaveCount(0);
    await expect(root.locator('[data-reward="drops"]')).toHaveAccessibleName('1284 Drops. How Drops are earned');
    await expect(root.locator('[data-reward="carrots"]')).toHaveAccessibleName('212 Carrots. How Carrots are earned');
    await expect(root.locator('.lg-zoom')).toHaveCount(mobile ? 0 : 1);
    await expect(root.locator('.lg-hint')).toHaveCount(mobile ? 0 : 1);
    const tiles = root.locator('.lg-tiles [data-theme]');
    await expect(tiles).toHaveCount(7);
    await expect(root.locator('.lg-tiles small')).toHaveCount(0);
    const first = await tiles.nth(0).boundingBox(), second = await tiles.nth(1).boundingBox();
    expect(first.y).toBe(second.y);
    expect(second.x).toBeGreaterThan(first.x);
    await expect(root.locator('.lg-tiles .bar i').first()).toHaveAttribute('style', 'width:20%');
    if (mobile && browserName === 'chromium') {
      // Native touch events exercise OrbitControls, not the removed buttons.
      await expect.poll(() => root.evaluate(el => el.__garden.ready())).toBe(true);
      const cdp = await page.context().newCDPSession(page);
      const targetBefore = await root.evaluate(el => el.__garden.controls.target.toArray());
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 240 }] });
      for (let x = 200; x <= 250; x += 10) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 240 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect.poll(() => root.evaluate(el => el.__garden.controls.target.toArray())).not.toEqual(targetBefore);
      const distanceBefore = await root.evaluate(el => el.__garden.camera.position.distanceTo(el.__garden.controls.target));
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 160, y: 240 }, { x: 220, y: 240 }] });
      for (let d = 10; d <= 40; d += 10) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 160 - d, y: 240 }, { x: 220 + d, y: 240 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect.poll(() => root.evaluate(el => el.__garden.camera.position.distanceTo(el.__garden.controls.target))).not.toBe(distanceBefore);
      await root.evaluate(el => el.__garden.applyView());
      await root.locator('.lg-handle').click();
    }
    await page.screenshot({ path: `/tmp/lg-compact-${mobile ? 'mobile' : 'desktop'}-fixture.png` });
    // Chips still open the explanation, despite losing their inline info dots.
    await root.locator('[data-reward="drops"]').click();
    await expect(page.getByRole('heading', { name: 'How Drops are earned' })).toBeVisible();
    await page.getByRole('button', { name: 'Close reward information' }).click();
    await tiles.nth(3).click();
    await expect(root.locator('.lg-crumbs')).toBeVisible();
    await expect(root.locator('.lg-crumbs [data-go="garden"]')).toBeVisible();
    await expect(root.locator('.lg-crumbs [data-go="theme"]')).toHaveText('Sport');
    await root.locator('[data-path="0"]').click();
    await expect(root.locator('.lg-crumbs [data-go="path"]')).toHaveText('A learning path');
    await page.screenshot({ path: `/tmp/lg-compact-${mobile ? 'mobile' : 'desktop'}-path-fixture.png` });
    await root.locator('.lg-crumbs [data-go="garden"]').click();
    await expect(root.locator('.lg-crumbs')).toBeHidden();
    await expect(root.locator('.lg-tiles')).toBeVisible();
  });
}
