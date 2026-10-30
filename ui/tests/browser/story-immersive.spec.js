import { test, expect } from '@playwright/test';

const shot = (name) => `/downloads/${name}.png`;
async function openImmersive(page, bookName = /Read The Printer/) {
  await page.route('**/api/apps/', r => r.fulfill({ json: { apps: [] } }));
  await page.goto('/apps/story-shelf');
  await page.getByRole('button', { name: bookName }).first().click();
  await page.getByRole('button', { name: 'Immersive 3D' }).click();
  await expect(page.locator('.ss-immersive canvas')).toHaveAttribute('data-ready', 'true');
}

test.setTimeout(150000);
test('immersive mode: closed book, opening, bending page turns, rising model, switch back', async ({ page, browserName }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await openImmersive(page);
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-open', 'false');
  await page.waitForTimeout(600);
  await page.screenshot({ path: shot(`${browserName}-immersive-closed`) });
  await page.getByRole('button', { name: /Open The Printer/ }).click();
  await expect.poll(async () => Number(await page.locator('.ss-immersive').getAttribute('data-open-t')), { timeout: 20000 }).toBeGreaterThan(.55);
  await page.screenshot({ path: shot(`${browserName}-immersive-opening`) });
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-open', 'true', { timeout: 30000 });
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-model', 'true', { timeout: 30000 });
  await page.screenshot({ path: shot(`${browserName}-immersive-page1`) });
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect.poll(async () => Number(await page.locator('.ss-immersive').getAttribute('data-flip-t')), { timeout: 20000 }).toBeGreaterThan(.45);
  await page.screenshot({ path: shot(`${browserName}-immersive-flip`) });
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-shown', '1', { timeout: 30000 });
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-model', 'true', { timeout: 30000 });
  await page.screenshot({ path: shot(`${browserName}-immersive-page2`) });
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-shown', '0', { timeout: 30000 });
  await page.getByRole('button', { name: 'Go to page 3' }).click();
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-shown', '2', { timeout: 40000 });
  // Switching back keeps the page and shows the readable CSS book.
  await page.getByRole('button', { name: 'Readable', exact: true }).click();
  await expect(page.getByText('Page 3 of 5', { exact: true })).toBeVisible();
  await expect(page.locator('.ss-story-illustration')).toBeVisible();
  expect(errors).toEqual([]);
});

test('immersive mode: click right page turns, and mode persists', async ({ page }) => {
  await openImmersive(page, /Read Mary/);
  await page.getByRole('button', { name: /Open Mary/ }).click();
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-model', 'true', { timeout: 30000 });
  const box = await page.locator('.ss-immersive canvas').boundingBox();
  await page.mouse.click(box.x + box.width * .64, box.y + box.height * .62);
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-shown', '1', { timeout: 30000 });
  await page.reload();
  await page.getByRole('button', { name: /Read Mary/ }).click();
  await expect(page.getByRole('button', { name: 'Immersive 3D' })).toHaveAttribute('aria-pressed', 'true');
});

test('immersive mobile layout shows the page text below the book', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openImmersive(page, /Read The Acorn/);
  await page.getByRole('button', { name: /Open The Acorn/ }).click();
  await expect(page.locator('.ss-immersive')).toHaveAttribute('data-model', 'true', { timeout: 30000 });
  await expect(page.locator('.ss-immersive-text')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: shot(`${browserName}-immersive-mobile`), fullPage: true });
});

test('immersive falls back to readable mode without WebGL', async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
  await page.route('**/api/apps/', r => r.fulfill({ json: { apps: [] } }));
  await page.goto('/apps/story-shelf');
  await page.getByRole('button', { name: /Read Mary/ }).click();
  await page.getByRole('button', { name: 'Immersive 3D' }).click();
  await expect(page.getByText('Immersive 3D needs WebGL')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Readable', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
