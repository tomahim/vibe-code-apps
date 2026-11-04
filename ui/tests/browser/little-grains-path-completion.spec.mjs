import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.setViewportSize({ width: 390, height: 844 }); });
const url = '/apps/little-grains/theme/life/path/baby/lesson/lesson/card/card';
async function fixture(page, { completed = false, quiz = false, partial = false } = {}) {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'path-celebration-fixture'));
  let read = quiz || completed, answered = completed;
  const progress = () => ({ completed: completed || (read && answered && !partial), cards_completed: Number(read), cards_total: 1, checkpoints_correct: Number(answered), checkpoints_total: 1, questions_correct: Number(answered), questions_total: 1, lessons_completed: Number(read && answered), lessons_total: 1, lessons_fully_read: Number(read) });
  await page.route('**/api/learning/**', async route => {
    const p = new URL(route.request().url()).pathname;
    if (p.endsWith('/health/')) return route.fulfill({ json: { status: 'ok' } });
    if (p.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], new_count: 0 } });
    if (p.endsWith('/garden/')) return route.fulfill({ json: { themes: [{ id: 'life', title: 'Life & Society', learning_paths: [{ id: 'baby', title: "A baby's first year through science", progress: progress(), catch_up: { eligible: read, remaining: 1 }, lessons: [{ id: 'lesson', title: 'Small steps', position: 1, progress: progress() }] }] }], rewards: { drops: answered ? 107 : 0, carrots: Number(answered) } } });
    if (p.endsWith('/open/')) return route.fulfill({ json: {} });
    if (p.endsWith('/complete/')) { read = true; return route.fulfill({ json: {} }); }
    if (p.endsWith('/question-attempts/')) { answered = true; return route.fulfill({ json: { correct: true, carrot_earned: !completed, explanation: 'Correct.', next_step: null } }); }
    const question = { id: 'question', type: 'multiple_choice', lesson_title: 'Small steps', after_card_position: 1, prompt: 'What grows?', options: [{ id: 'a', text: 'Knowledge' }, { id: 'b', text: 'Nothing' }] };
    if (p.endsWith('/catch-up/')) return route.fulfill({ json: { questions: [question] } });
    return route.fulfill({ json: { theme: { id: 'life', title: 'Life & Society' }, learning_path: { id: 'baby', title: "A baby's first year through science" }, lesson: { id: 'lesson', title: 'Small steps', position: 1, progress: progress() }, cards: [{ id: 'card', title: 'A little every day', body_markdown: 'Small steps make a difference.', position: 1, completed_at: read || completed ? '2026-11-04T07:00:00Z' : null }], questions: [question], next_step: !read ? { type: 'card', id: 'card' } : !answered ? { type: 'question', id: 'question' } : null } });
  });
}
async function answer(page) {
  await page.locator('.grains-options label').filter({ hasText: 'Knowledge' }).click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByText(/That’s right/)).toBeVisible();
  await page.getByRole('button', { name: 'Continue →', exact: true }).click();
}
for (const size of [{ width: 390, height: 844 }, { width: 320, height: 568 }, { width: 760, height: 900 }]) {
  test(`whole path celebration follows lesson completion at ${size.width}`, async ({ page }) => {
    await page.setViewportSize(size);
    await fixture(page);
    await page.goto(url);
    await page.getByRole('button', { name: /read this card/ }).click();
    await expect(page.locator('.grains-path-complete')).toHaveCount(0);
    await answer(page);
    await expect(page.getByText('Lesson finished!')).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Your knowledge is in full bloom.' })).toBeVisible({ timeout: 10000 });
    const celebration = page.locator('.grains-path-complete');
    await expect(celebration).toContainText('+100');
    await expect(celebration).toContainText("A baby's first year through science");
    await expect(page.getByRole('button', { name: 'Back to my garden' })).toBeFocused();
    await page.waitForTimeout(2500);
    await expect(page.getByRole('button', { name: 'Back to my garden' })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(size.width);
    await page.screenshot({ path: `/tmp/lg-path-complete-${size.width}.png` });
    if (size.width === 760) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: '/tmp/lg-path-complete-desktop.png' });
    }
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Back to my garden' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(celebration).toHaveCount(0);
  });
}
test('existing completed path replay never repeats the 100-Drop celebration', async ({ page }) => {
  await fixture(page, { completed: true });
  await page.goto(url.replace('/card/card', '/question/question'));
  await answer(page);
  await expect(page.getByText('Lesson reviewed!')).toBeVisible();
  await page.getByRole('button', { name: 'Close lesson' }).click();
  await expect(page.locator('.grains-path-complete')).toHaveCount(0);
});
test('reading a lesson does not claim path completion with unanswered questions elsewhere', async ({ page }) => {
  await fixture(page, { partial: true });
  await page.goto(url);
  await page.getByRole('button', { name: /read this card/ }).click();
  await answer(page);
  await expect(page.getByText('Lesson finished!')).toBeVisible();
  await page.getByRole('button', { name: 'Close lesson' }).click();
  await expect(page.locator('.grains-path-complete')).toHaveCount(0);
});
test('Practice quiz can finish a path, reduced motion still shows the result', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await fixture(page, { quiz: true });
  await page.goto('/apps/little-grains/theme/life/path/baby');
  await page.getByRole('button', { name: /Practice/ }).click();
  await answer(page);
  await page.getByRole('button', { name: 'Back to the garden' }).click();
  await expect(page.locator('.grains-path-complete')).toBeVisible();
  await expect(page.locator('.grains-path-burst')).toBeHidden();
  await expect(page.locator('.grains-path-reward')).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Back to my garden' }).click();
  await expect(page.locator('.grains-path-complete')).toHaveCount(0);
});
