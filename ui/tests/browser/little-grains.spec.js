import { test, expect } from '@playwright/test';

const id = {
  theme: 'aee95ca0-881c-48b6-9c33-28666497f2b6', path: '7bcf5984-280f-4555-aabb-fa2404fda355',
  lesson: 'ef40c724-a882-4798-949b-1bf950471d9b', card: '8f8b4671-3e2d-4c7f-a3c7-eb207401bb40', question: 'd5494bfe-ef7b-44aa-b2ad-898ea6424a50',
};
const row = (id, title) => ({ id, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
function mockApi(page, lessonCount = 1) {
  let read = false, answered = false;
  const progress = () => ({ cards_completed: Number(read), cards_total: 1, checkpoints_correct: Number(answered), checkpoints_total: 1, lessons_completed: Number(answered), lessons_total: 1, started: read, completed: answered });
  page.route('**/api/learning/**', route => {
    expect(route.request().headers().authorization).toBe('Bearer fake-jwt');
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: { themes: [{ ...row(id.theme, 'Language'), description: 'Everyday language', progress: progress(), learning_paths: [{ ...row(id.path, 'Early Childhood English'), progress: progress(), lessons: Array.from({ length: lessonCount }, (_, i) => ({ ...row(i ? `lesson-${i}` : id.lesson, i ? `Everyday phrase ${i + 1}` : 'Bath time and care'), progress: progress() })) }] }], rewards: { drops: Number(read) + Number(answered) * 105, carrots: Number(answered) } } });
    if (url.pathname.endsWith(`/lessons/${id.lesson}/`)) return route.fulfill({ json: { theme: row(id.theme, 'Language'), learning_path: row(id.path, 'Early Childhood English'), lesson: { ...row(id.lesson, 'Bath time and care'), progress: progress() }, cards: [{ id: id.card, position: 1, title: 'Warm water', body_markdown: 'The bath water is **warm**.', illustration_url: '', completed_at: read ? '2026-10-28T10:00:00Z' : null }], questions: [{ id: id.question, prompt: 'What is the water like?', options: [{ id: 'warm', text: 'Warm' }, { id: 'cold', text: 'Cold' }], completed: answered }], next_step: !read ? { type: 'card', id: id.card } : !answered ? { type: 'question', id: id.question } : null } });
    if (url.pathname.endsWith(`/cards/${id.card}/complete/`)) { read = true; return route.fulfill({ status: 201, json: { created: true } }); }
    if (url.pathname.endsWith('/question-attempts/')) { answered = JSON.parse(route.request().postData()).answer === 'warm'; return route.fulfill({ status: 201, json: { correct: answered, explanation: 'Warm means pleasantly heated.' } }); }
    if (url.pathname.endsWith('/leaderboard/')) return route.fulfill({ json: { rows: [{ rank: 1, name: 'Learner', score: 106, is_self: true }], self: { rank: 1, score: 106, is_self: true } } });
  });
}

test('Little Grains requires sign-in', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/');
  await page.getByRole('button', { name: /Little Grains/ }).click();
  await page.waitForURL('**/login?next=/apps/little-grains');
});

test('garden, lesson progress and leaderboard use the API', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page);
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await expect(panel.getByRole('heading', { name: 'The Garden' })).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-garden-desktop.png' });
  await panel.getByRole('button', { name: /Language/ }).click();
  await panel.getByRole('button', { name: /Early Childhood English/ }).click();
  await expect(panel.getByRole('heading', { name: 'Early Childhood English' })).toBeVisible();
  await panel.getByRole('button', { name: /Bath time and care/ }).click();
  await panel.getByRole('button', { name: /Start lesson/ }).click();
  const reader = page.getByRole('dialog', { name: 'Bath time and care' });
  await expect(reader.getByText('The bath water is')).toBeVisible();
  await reader.getByRole('button', { name: /I’ve read this card/ }).click();
  await expect(reader.getByText('What is the water like?')).toBeVisible();
  await reader.getByLabel('Warm', { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer' }).click();
  await expect(reader.getByText('That’s right! +1 carrot')).toBeVisible();
  await reader.getByRole('button', { name: 'Continue →' }).click();
  await expect(reader.getByText('Lesson in bloom')).toBeVisible();
  await reader.getByRole('button', { name: 'Back to the garden' }).click();
  await page.getByRole('button', { name: 'Open leaderboard' }).click();
  await expect(page.getByRole('dialog', { name: 'Leaderboard' }).getByText('Learner')).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-desktop.png' });
});

test('expired token is cleared', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'stale-jwt'));
  await page.route('**/api/learning/garden/', route => route.fulfill({ status: 401, json: { error: 'Expired' } }));
  await page.goto('/apps/little-grains');
  await page.waitForURL('**/login?next=/apps/little-grains');
  expect(await page.evaluate(() => localStorage.getItem('genious_token'))).toBeNull();
});

test('phone garden keeps the path list and leaderboard usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page, 17);
  await page.goto('/apps/little-grains');
  await expect(page.locator('.lg-mobile .lg-panel').getByRole('heading', { name: 'The Garden' })).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-garden-mobile.png' });
  await page.locator('.lg-panel').getByRole('button', { name: /Language/ }).click();
  await page.locator('.lg-panel').getByRole('button', { name: /Early Childhood English/ }).click();
  await expect(page.locator('.lg-panel').getByRole('heading', { name: 'Early Childhood English' })).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-path-mobile.png' });
  await page.getByRole('button', { name: 'Open leaderboard' }).click();
  await expect(page.getByRole('dialog', { name: 'Leaderboard' }).getByText('Learner')).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-mobile.png' });
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});
