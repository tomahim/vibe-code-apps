import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
const directory = new URL('../../src/apps/threejs-learning-path/lessons/', import.meta.url);
const chapters = readdirSync(directory).filter((file) => file.endsWith('.json')).map((file) => JSON.parse(readFileSync(new URL(file, directory), 'utf8')));
const path = '/apps/threejs-learning-path';
const storageKey = 'threejs-learning-path:v1';

async function open(page, id = 'hello-scene') {
  await page.goto(`${path}#${id}`);
  await expect(page.locator('.tl-editor-status')).toContainText('Scene running', { timeout: 20000 });
}
async function loadSolution(page) {
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await page.getByRole('button', { name: 'Load solution', exact: true }).click();
  await expect(page.locator('.tl-editor-status')).toContainText('Scene running', { timeout: 10000 });
}
async function edit(page, source) {
  const editor = page.getByRole('textbox', { name: 'Lesson JavaScript editor' });
  await editor.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(source);
}

test('gallery keeps local app when the API responds, and opens the studio', async ({ page }) => {
  await page.route('**/api/apps/', (route) => route.fulfill({ json: { apps: [{ slug: 'livetrail-scrap', name: 'LiveTrail Scraper' }] } }));
  await page.goto('/');
  await page.getByRole('button', { name: /Three.js learning path/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hello, third dimension');
  await expect(page.locator('.tl-editor-status')).toContainText('Scene running');
});

test('editing updates the scene, errors recover, and completion and drafts survive reload', async ({ page }) => {
  await open(page);
  await page.screenshot({ path: '/tmp/threejs-learning-desktop.png', fullPage: true });
  const lesson = chapters[0].lessons[0];
  await edit(page, 'const broken = ;');
  await expect(page.getByRole('alert')).toContainText('Let’s fix that');
  await edit(page, lesson.solution);
  await expect(page.getByRole('button', { name: 'Scene check passed' })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.getByRole('radio', { name: /The camera/ }).click();
  await page.getByRole('button', { name: 'Complete & continue' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A shape needs a surface');
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key))?.completed, storageKey)).toContain('hello-scene');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A shape needs a surface');
  await page.getByRole('button', { name: 'Previous lesson', exact: true }).click();
  await expect(page.locator('.cm-content')).toContainText('#242038');
  await expect(page.locator('.tl-course-progress')).toContainText('1 of 60 lessons');
});

test('manual run does not evaluate edits until Run, and reset restores starter', async ({ page }) => {
  await open(page);
  await page.getByRole('checkbox', { name: 'Auto-run' }).uncheck();
  await edit(page, chapters[0].lessons[0].solution);
  await expect(page.locator('.tl-editor-status')).toContainText('Changes waiting');
  await expect(page.getByRole('button', { name: 'Complete & continue' })).toBeDisabled();
  await page.getByRole('button', { name: /^Run/ }).click();
  await expect(page.getByRole('button', { name: 'Scene check passed' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset lesson code', exact: true }).click();
  await page.getByRole('button', { name: 'Reset code', exact: true }).click();
  await expect(page.locator('.cm-content')).toContainText("new THREE.Color('#10141f')");
  await expect(page.getByRole('button', { name: 'Check my scene' })).toBeVisible();
});

test('mobile, search, and deep links work without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, 'world-finish');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('05 / The final look');
  await page.screenshot({ path: '/tmp/threejs-learning-mobile.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Toggle learning path' }).click();
  await page.getByRole('textbox', { name: 'Find a lesson' }).fill('roughness');
  await page.getByRole('button', { name: /Polished or matte/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Polished or matte?');
  await expect(page.locator('.tl-course-nav')).not.toBeVisible();
});

test('viewer sandbox cannot read parent storage', async ({ page }) => {
  await open(page);
  const frame = page.frames().find((item) => item.url() === 'about:srcdoc');
  expect(await frame.evaluate(() => {
    try { return parent.localStorage.length; } catch (error) { return error.name; }
  })).toBe('SecurityError');
});

test('editing a solved exercise invalidates old results, and leaving the app flushes drafts', async ({ page }) => {
  await open(page);
  await loadSolution(page);
  await page.getByRole('radio', { name: /The camera/ }).click();
  await expect(page.getByRole('button', { name: 'Complete & continue' })).toBeEnabled();
  await edit(page, chapters[0].lessons[0].code);
  await expect(page.getByRole('button', { name: 'Complete & continue' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Check my scene' })).toBeVisible();
  await page.getByRole('button', { name: 'All apps', exact: true }).click();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
  expect(saved.drafts['hello-scene']).toBe(chapters[0].lessons[0].code);
});

for (const chapter of chapters) {
  test(`all starters and solutions work: ${chapter.title}`, async ({ page }) => {
    test.setTimeout(120000);
    for (const lesson of chapter.lessons) {
      await test.step(lesson.title, async () => {
        await open(page, lesson.id);
        await expect(page.getByRole('alert')).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Check my scene' })).toBeVisible();
        await loadSolution(page);
        if (chapter.id === 'interaction') {
          const bounds = await page.locator('.tl-preview-frame').boundingBox();
          await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
          if (lesson.id === 'click') await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        }
        await expect(page.getByRole('button', { name: 'Scene check passed' })).toBeVisible({ timeout: 15000 });
        await expect(page.getByRole('alert')).toHaveCount(0);
        // Moving out of the preview must not erase successful hover/click work.
        await page.mouse.move(10, 10);
        await page.getByRole('radio').nth(lesson.quiz.answer).click();
        await expect(page.getByRole('button', { name: /Complete & continue|Finish learning path/ })).toBeEnabled();
      });
    }
  });
}
