import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { exercisesFor } from '../../src/apps/rust-learning-path/checks.js';
const root = new URL('../../src/apps/rust-learning-path/lessons/', import.meta.url);
const lessons = readdirSync(root).filter((name) => name.endsWith('.json')).flatMap((name) => JSON.parse(readFileSync(new URL(name, root), 'utf8')).lessons);
const path = '/apps/rust-learning-path';
const ok = (stdout = 'Hello, Rust!\n') => ({ success: true, stdout, stderr: '' });
async function edit(page, code) {
  const editor = page.getByRole('textbox', { name: 'Lesson Rust editor' });
  await editor.focus(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText(code);
}
async function loadSolution(page) {
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await page.getByRole('button', { name: 'Load solution', exact: true }).click();
}

test('gallery opens Rust, manual run completes only matching code, edits revoke completion', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/apps/', (route) => route.fulfill({ json: { apps: [] } }));
  await page.route('**/api/apps/rust/run', (route) => { requests++; return route.fulfill({ json: ok(route.request().postDataJSON().code.includes('Hello, Rust!') ? 'Hello, Rust!\n' : 'Hello, world!\n') }); });
  await page.goto('/'); await page.getByRole('button', { name: /Rust learning path/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hello, Rust!');
  expect(requests).toBe(0);
  await page.getByRole('button', { name: /Run code/ }).click();
  await expect(page.getByRole('status')).toContainText('Not quite yet');
  await expect(page.getByRole('button', { name: 'Next lesson' })).toBeDisabled();
  await loadSolution(page);
  expect(requests).toBe(1);
  await page.getByRole('textbox', { name: 'Lesson Rust editor' }).focus();
  await page.keyboard.press('ControlOrMeta+Enter');
  await expect(page.getByRole('status')).toContainText('Check passed');
  await expect(page.getByRole('button', { name: 'Next lesson' })).toBeEnabled();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '1');
  await edit(page, 'fn main() {}');
  await expect(page.getByRole('button', { name: 'Next lesson' })).toBeDisabled();
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
  await page.getByRole('button', { name: 'Reset code', exact: true }).click();
  await expect(page.getByRole('textbox')).toContainText('Hello, world!');
});

test('all lesson checks and both ownership steps work; tests stay outside the editor', async ({ page }) => {
  let request;
  await page.route('**/api/apps/rust/run', (route) => {
    request = route.request().postDataJSON();
    const code = request.code;
    let result = ok(code.includes('let mut') ? '10\n' : code.includes('text.clone()') ? '5\n5\n' : 'Hello, Rust!\n');
    if (request.mode === 'test') result = ok('test result: ok. 3 passed; 0 failed;');
    else if (code.includes('let other = text;')) result = { success: false, stdout: '', stderr: 'error[E0382]: borrow of moved value: `text`\n --> src/main.rs:4:20' };
    return route.fulfill({ json: result });
  });
  await page.goto(path);
  for (const lesson of lessons) {
    await page.getByRole('navigation').getByRole('button', { name: new RegExp(lesson.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).click();
    for (const exercise of exercisesFor(lesson)) {
      await loadSolution(page);
      await page.getByRole('button', { name: /Run code/ }).click();
      await expect(page.getByRole('status')).toContainText('Check passed');
      if (exercise.check.type === 'tests') {
        expect(request.mode).toBe('test'); expect(request.code).toContain('#[test]');
        await expect(page.getByRole('textbox')).not.toContainText('#[test]');
      }
      if (exercise.check.type === 'compile_error') {
        await page.getByRole('button', { name: 'Jump to line 4, column 20' }).click();
        await expect(page.getByRole('textbox')).toBeFocused();
        await expect(page.getByRole('progressbar')).toHaveAttribute('value', '3');
        await page.getByRole('button', { name: 'Repair the move' }).click();
      }
    }
  }
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '4');
  await expect(page.getByText('All four lessons complete. Keep building!')).toBeVisible();
});

test('unavailable, rate-limited and timed-out runs recover without losing edits', async ({ page }) => {
  let status = 429;
  await page.route('**/api/apps/rust/run', (route) => route.fulfill({ status, json: status === 200 ? ok() : { error: status === 429 ? 'Too many runs. Wait a minute before trying again.' : 'The Rust run timed out.' } }));
  await page.goto(path); await loadSolution(page);
  for (const failure of [429, 504]) {
    status = failure;
    await page.getByRole('button', { name: /Run code/ }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('textbox')).toContainText('Hello, Rust!');
    await expect(page.getByRole('button', { name: 'Next lesson' })).toBeDisabled();
  }
  status = 200;
  await page.getByRole('button', { name: /Run code/ }).click();
  await expect(page.getByRole('status')).toContainText('Check passed');
});

test('editing or switching lessons cancels in-flight results', async ({ page }) => {
  let release;
  await page.route('**/api/apps/rust/run', async (route) => { await new Promise((resolve) => { release = resolve; }); await route.fulfill({ json: ok() }).catch(() => {}); });
  await page.goto(path); await loadSolution(page);
  await page.getByRole('button', { name: /Run code/ }).click();
  await expect(page.getByRole('button', { name: 'Running…' })).toBeDisabled();
  await edit(page, 'fn main() {}'); release();
  await expect(page.getByRole('button', { name: /Run code/ })).toBeEnabled();
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Next lesson' })).toBeDisabled();
  await page.getByRole('button', { name: /Run code/ }).click();
  await expect(page.getByRole('button', { name: 'Running…' })).toBeDisabled();
  await page.getByRole('navigation').getByRole('button', { name: /Make room for change/ }).click();
  release();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make room for change');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0');
});

test('client timeout restores the Run button and keeps the draft', async ({ page }) => {
  let release;
  await page.clock.install();
  await page.route('**/api/apps/rust/run', async (route) => { await new Promise((resolve) => { release = resolve; }); await route.fulfill({ json: ok() }).catch(() => {}); });
  await page.goto(path); await loadSolution(page);
  await page.getByRole('button', { name: /Run code/ }).click();
  await expect(page.getByRole('button', { name: 'Running…' })).toBeDisabled();
  await page.clock.fastForward(12001);
  await expect(page.getByRole('alert')).toContainText('timed out');
  await expect(page.getByRole('button', { name: /Run code/ })).toBeEnabled();
  await expect(page.getByRole('textbox')).toContainText('Hello, Rust!');
  release();
});

for (const width of [1440, 390]) test(`Rust workspace is usable at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.route('**/api/apps/rust/run', (route) => route.fulfill({ json: ok() }));
  await page.goto(`${path}#hello-world`);
  await expect(page.getByRole('textbox')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.locator('.cm-editor').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
  if (width === 390) {
    const symbol = page.getByRole('button', { name: 'Insert &' });
    await symbol.click();
    await expect(page.getByRole('textbox')).toContainText('&');
    const box = await symbol.boundingBox(); expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await loadSolution(page);
  await page.getByRole('button', { name: /Run code/ }).click();
  await expect(page.getByRole('status')).toContainText('Check passed');
  await page.screenshot({ path: `/tmp/rust-learning-${width}.png`, fullPage: true });
  await edit(page, 'fn main() {\n    // ' + 'long_code'.repeat(150) + '\n}');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
