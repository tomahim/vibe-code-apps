import { test, expect } from '@playwright/test';

const path = 'atomic-lessons/themes/tech-and-ai/index.md';
const description = 'Short, sourced lessons about technology and artificial intelligence.';
const theme = { key: path, path, kind: 'theme', change: 'added', title: 'Tech & AI', description,
  body: '', breadcrumbs: ['Tech & AI'], parse_error: null, patch: '+description: ' + description };

for (const width of [390, 1280]) {
  test(`theme description can be edited and committed at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.addInitScript(() => localStorage.setItem('genious_token', 'test-token'));
    let current = { ...theme };
    let head = 'reviewed-head';
    let edit;
    await page.route('**/api/apps/content-review/prs', route => route.fulfill({ json: {
      pull_requests: [{ number: 169, title: 'Add How ChatGPT works', head_ref: 'codex/content', content_changes: { files: 1, added: 1, modified: 0, removed: 0 } }],
    } }));
    await page.route('**/api/apps/content-review/prs/169', route => route.fulfill({ json: {
      pr: { number: 169, title: 'Add How ChatGPT works', head_ref: 'codex/content', head_sha: head },
      units: [current], other_changes: [], summary: { added: 1, modified: 0, removed: 0 },
    } }));
    await page.route('**/api/apps/content-review/prs/169/edits', async route => {
      edit = route.request().postDataJSON();
      current = { ...current, ...edit.changes };
      head = 'saved-head';
      await route.fulfill({ status: 201, json: { unit: current, head_sha: head, commit: { sha: head } } });
    });
    await page.goto('/apps/content-review');
    await page.getByRole('button', { name: /#169 Add How ChatGPT works/ }).click();
    await expect(page.locator('.unit-description')).toHaveText(description);
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    const field = page.getByLabel('Description', { exact: true });
    await expect(field).toHaveValue(description);
    await expect(page.getByLabel('Title', { exact: true })).toHaveCount(0);
    await expect(page.getByLabel('Intro text')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Save as commit' })).toBeDisabled();
    await field.fill('Clear explanations about technology and AI.');
    await page.screenshot({ path: `/tmp/theme-edit/theme-editor-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Save as commit' }).click();
    await expect(page.getByText('Committed to the pull request branch', { exact: true })).toBeVisible();
    expect(edit).toEqual({ path, head_sha: 'reviewed-head', changes: { description: 'Clear explanations about technology and AI.' } });
    await expect(page.locator('.unit-description')).toHaveText('Clear explanations about technology and AI.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
