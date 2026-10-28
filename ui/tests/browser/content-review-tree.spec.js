import { test, expect } from '@playwright/test';

const crumbs = ['Tech & AI', 'How ChatGPT works'];
const u = (key, kind, title, breadcrumbs) => ({ key, path: key, kind, change: 'added', title, description: '', body: 'x', breadcrumbs, parse_error: null, patch: '+x' });
const units = [
  u('p', 'learning_path', 'How ChatGPT works', ['Tech & AI']),
  u('l1', 'lesson', 'Inside a neural network', crumbs),
  u('l1c1', 'card', 'Card one', [...crumbs, 'Inside a neural network']),
  u('l1q1', 'question', 'Which layer comes first?', [...crumbs, 'Inside a neural network']),
  u('l1c2', 'card', 'Card two', [...crumbs, 'Inside a neural network']),
  u('l2', 'lesson', 'Putting meaning into numbers', crumbs),
  u('l2c1', 'card', 'Card one', [...crumbs, 'Putting meaning into numbers']),
  u('l3c1', 'card', 'Card only', [...crumbs, 'Unchanged lesson']),
];

for (const width of [390, 1280]) {
  test(`review tree nests cards under lessons at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(() => localStorage.setItem('genious_token', 'test-token'));
    await page.route('**/api/apps/content-review/prs', route => route.fulfill({ json: {
      pull_requests: [{ number: 169, title: 'Add How ChatGPT works', head_ref: 'x', content_changes: { files: 8, added: 8, modified: 0, removed: 0 } }] } }));
    await page.route('**/api/apps/content-review/prs/169', route => route.fulfill({ json: {
      pr: { number: 169, title: 'Add How ChatGPT works', head_ref: 'x', head_sha: 'h' },
      units, other_changes: [], summary: { added: 8, modified: 0, removed: 0 } } }));
    await page.goto('/apps/content-review');
    await page.getByRole('button', { name: /#169 Add How ChatGPT works/ }).click();
    const lesson = page.locator('.tree-kind-lesson').first();
    const card = page.locator('.tree-kind-card').first();
    await expect(lesson).toBeVisible();
    const lx = (await lesson.boundingBox()).x;
    const cx = (await card.boundingBox()).x;
    expect(cx).toBeGreaterThan(lx);
    await page.locator('.unit-tree').screenshot({ path: `/tmp/tree-${width}.png` });
  });
}
