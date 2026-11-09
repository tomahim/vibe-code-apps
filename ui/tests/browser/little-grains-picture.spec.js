import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// Real repo pictures and credits, but no live user data or progress writes.
const files = {
  photo: 'atomic-lessons/themes/life-and-society/baby-first-year-science/04-vision-first-year/cards/01_a-blurry-start.md',
  figure: 'atomic-lessons/themes/plongee-niveau-4-partie-1/p5-comprendre-la-saturation-et-la-desaturation/05-les-periodes/cards/03_une-progression-par-moities.md',
};
function loadCard(file) {
  const full = resolve('..', file), raw = readFileSync(full, 'utf8');
  const [, meta, body] = raw.split('---');
  const field = name => meta.match(new RegExp(`^${name}: (.*)$`, 'm'))?.[1].replace(/^["']|["']$/g, '');
  return { id: field('id'), position: 1, title: field('title'), body_markdown: body.trim(),
    illustration_path: file, illustration_url: '/picture-preview.jpg',
    illustration_srcset: [{ url: '/picture-preview.jpg', width: 640 }, { url: '/picture-largest.jpg', width: 1600 }],
    illustration_alt: field('image_alt'), illustration_caption: field('image_caption'), illustration_credit: field('image_credit'), illustration_license: field('image_license'), illustration_source_url: field('image_source_url'),
    image: resolve(dirname(full), field('image')) };
}
async function fixture(page, kind, replay = false) {
  const card = loadCard(files[kind]);
  await page.addInitScript(() => localStorage.setItem('genious_token', 'picture-fixture'));
  await page.route('**/picture-*.jpg', route => route.fulfill({ contentType: 'image/jpeg', body: readFileSync(card.image) }));
  await page.route('**/api/learning/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (path.endsWith('/garden/')) return route.fulfill({ json: { themes: [], rewards: {} } });
    if (path.endsWith('/open/')) return route.fulfill({ json: {} });
    return route.fulfill({ json: {
      theme: { id: 'theme', title: 'Theme' }, learning_path: { id: 'path', title: 'Path' },
      lesson: { id: 'lesson', position: 1, title: 'Picture lesson', introduction_markdown: '', progress: { cards_completed: replay ? 1 : 0, cards_total: 2, checkpoints_correct: 0 } },
      cards: [{ ...card, completed_at: replay ? '2026-11-09T07:00:00Z' : null }, { id: 'next', position: 2, title: 'Next card', body_markdown: 'Next.' }], questions: [], next_step: { type: 'card', id: replay ? 'next' : card.id },
    } });
  });
  await page.goto(`/apps/little-grains/theme/theme/path/path/lesson/lesson/card/${card.id}`);
  return card;
}

for (const size of [{ width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }, { width: 1440, height: 1000 }]) {
  for (const kind of ['photo', 'figure']) {
    test(`${kind} opens in place and closes without losing the lesson at ${size.width}x${size.height}`, async ({ page, context }) => {
      await page.setViewportSize(size);
      const card = await fixture(page, kind, kind === 'photo');
      const trigger = page.getByRole('button', { name: 'Enlarge picture' });
      await expect(trigger).toBeVisible({ timeout: 15000 });
      await expect(trigger.locator('img')).toHaveCSS('object-fit', kind === 'figure' ? 'contain' : 'cover');
      await expect(page.getByText('View full size')).toHaveCount(0);
      await trigger.scrollIntoViewIfNeeded();
      const url = page.url();
      const scroll = await page.locator('.grains-reader-content').evaluate(el => el.scrollTop);
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: 'Enlarged picture', exact: true });
      await expect(dialog).toBeVisible();
      const close = dialog.getByRole('button', { name: 'Close picture' });
      await expect(close).toBeFocused();
      await expect(close).toBeInViewport();
      expect(await close.boundingBox()).toMatchObject({ width: 44, height: 44 });
      await expect(dialog.locator('img')).toHaveAttribute('src', '/picture-largest.jpg');
      await expect(dialog.locator('img')).toHaveCSS('object-fit', 'contain');
      await expect.poll(() => dialog.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(dialog.locator('figcaption')).toContainText(card.illustration_credit);
      if (card.illustration_source_url) await expect(dialog.getByRole('link')).toHaveAttribute('href', card.illustration_source_url);
      expect(context.pages()).toHaveLength(1);
      expect(page.url()).toBe(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(size.width);
      await page.screenshot({ path: `/tmp/picture-${kind}-${size.width}.png` });
      // Keyboard focus stays inside the native modal.
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('Tab');
        expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      }
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(page.getByRole('dialog', { name: 'Picture lesson', exact: true })).toBeVisible();
      await expect(trigger).toBeFocused();
      expect(await page.locator('.grains-reader-content').evaluate(el => el.scrollTop)).toBe(scroll);
      await trigger.press('Enter');
      await expect(dialog).toBeVisible();
      await close.click();
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      expect(page.url()).toBe(url);
      await page.screenshot({ path: `/tmp/picture-${kind}-${size.width}-closed.png` });
    });
  }
}

test('desktop backdrop dismisses the picture, not the lesson', async ({ page }) => {
  await fixture(page, 'photo');
  await page.getByRole('button', { name: 'Enlarge picture' }).click();
  await page.mouse.click(2, 2);
  await expect(page.getByRole('dialog', { name: 'Enlarged picture', exact: true })).not.toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Picture lesson', exact: true })).toBeVisible();
});
