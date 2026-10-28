import { test, expect } from '@playwright/test';

const id = {
  theme: 'aee95ca0-881c-48b6-9c33-28666497f2b6', path: '7bcf5984-280f-4555-aabb-fa2404fda355',
  lesson: 'ef40c724-a882-4798-949b-1bf950471d9b', card: '8f8b4671-3e2d-4c7f-a3c7-eb207401bb40', card2: '925a9b78-0546-44bf-a8bb-bb02fb6d7aca', question: 'd5494bfe-ef7b-44aa-b2ad-898ea6424a50', alternative: 'a4260aa0-b45b-47e0-b5d7-d869b00e20c3',
};
const row = (id, title) => ({ id, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
function mockApi(page, lessonCount = 1, { recentLessons = [], twoCards = false } = {}) {
  let read = false, readSecond = false, answered = false, wrong = false;
  const progress = () => ({ cards_completed: Number(read) + Number(readSecond), cards_total: twoCards ? 2 : 1, checkpoints_correct: Number(answered), checkpoints_total: 1, lessons_completed: Number(answered), lessons_total: 1, started: read, completed: answered });
  page.route('**/api/learning/**', route => {
    expect(route.request().headers().authorization).toBe('Bearer fake-jwt');
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: { themes: [{ ...row(id.theme, 'Language'), description: 'Everyday language', progress: progress(), learning_paths: [{ ...row(id.path, 'Early Childhood English'), progress: progress(), lessons: Array.from({ length: lessonCount }, (_, i) => ({ ...row(i ? `lesson-${i}` : id.lesson, i ? `Everyday phrase ${i + 1}` : 'Bath time and care'), progress: progress() })) }] }], rewards: { drops: Number(read) + Number(readSecond) + Number(answered) * 105, carrots: Number(answered) }, recent_lessons: recentLessons } });
    if (url.pathname.endsWith(`/lessons/${id.lesson}/`)) return route.fulfill({ json: { theme: row(id.theme, 'Language'), learning_path: row(id.path, 'Early Childhood English'), lesson: { ...row(id.lesson, 'Bath time and care'), progress: progress() }, cards: [{ id: id.card, position: 1, title: 'Warm water', body_markdown: 'The bath water is **warm**.', illustration_url: '', completed_at: read ? '2026-10-28T10:00:00Z' : null }, ...(twoCards ? [{ id: id.card2, position: 2, title: 'Dry gently', body_markdown: 'Use a **soft towel**.', illustration_url: '', completed_at: readSecond ? '2026-10-28T10:01:00Z' : null }] : [])], questions: [{ id: wrong ? id.alternative : id.question, after_card_position: twoCards ? 2 : 1, prompt: wrong ? 'How should the water feel?' : 'What is the water like?', options: [{ id: 'warm', text: 'Warm' }, { id: 'cold', text: 'Cold' }], completed: answered }], next_step: !read ? { type: 'card', id: id.card } : twoCards && !readSecond ? { type: 'card', id: id.card2 } : !answered ? { type: 'question', id: wrong ? id.alternative : id.question } : null } });
    if (url.pathname.endsWith(`/lessons/${id.lesson}/open/`)) return route.fulfill({ json: { lesson_id: id.lesson } });
    if (url.pathname.endsWith(`/cards/${id.card}/complete/`)) { read = true; return route.fulfill({ status: 201, json: { created: true } }); }
    if (url.pathname.endsWith(`/cards/${id.card2}/complete/`)) { readSecond = true; return route.fulfill({ status: 201, json: { created: true } }); }
    if (url.pathname.endsWith('/question-attempts/')) { answered = JSON.parse(route.request().postData()).answer === 'warm'; wrong = !answered; return route.fulfill({ status: 201, json: { correct: answered, explanation: 'Warm means pleasantly heated.', next_step: answered ? null : { type: 'question', id: id.alternative } } }); }
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

test('a wrong answer opens another question at the checkpoint', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page);
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await panel.getByRole('button', { name: /Language/ }).click();
  await panel.getByRole('button', { name: /Early Childhood English/ }).click();
  await panel.getByRole('button', { name: /Bath time and care/ }).click();
  await panel.getByRole('button', { name: /Start lesson/ }).click();
  const reader = page.getByRole('dialog', { name: 'Bath time and care' });
  await reader.getByRole('button', { name: /I’ve read this card/ }).click();
  await reader.getByLabel('Cold', { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer' }).click();
  await expect(reader.getByText('Not quite. Let’s try another question.')).toBeVisible();
  await reader.getByRole('button', { name: 'Try another question' }).click();
  await expect(reader.getByText('How should the water feel?')).toBeVisible();
  await expect(reader.getByText('What is the water like?')).toHaveCount(0);
});

test('the garden, theme and path offer three recent lesson shortcuts', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  const recentLessons = [
    { id: id.lesson, title: 'Bath time and care', learning_path_title: 'Early Childhood English', next_step: { type: 'card', id: id.card }, progress: { cards_completed: 0, cards_total: 1 } },
    { id: 'a654dd23-dedf-43c7-957a-a370cae1aae3', title: 'Morning greetings', learning_path_title: 'Early Childhood English', next_step: { type: 'question' }, progress: { cards_completed: 2, cards_total: 2 } },
    { id: '23d492be-bcac-4d53-9987-6c16a18dc7c8', title: 'Going for a walk', learning_path_title: 'Early Childhood English', next_step: { type: 'card' }, progress: { cards_completed: 1, cards_total: 3 } },
  ];
  mockApi(page, 1, { recentLessons });
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await expect(panel.locator('.lg-recent button')).toHaveCount(3);
  await page.screenshot({ path: '/tmp/little-grains-recent-desktop.png' });
  await panel.getByRole('button', { name: 'Continue Bath time and care' }).click();
  await expect(page.getByRole('dialog', { name: 'Bath time and care' }).getByText('Warm water')).toBeVisible();
  await page.getByRole('dialog', { name: 'Bath time and care' }).getByRole('button', { name: 'Close lesson' }).click();
  await panel.getByRole('button', { name: /Language/ }).click();
  await expect(panel.locator('.lg-recent button')).toHaveCount(3);
  await panel.getByRole('button', { name: /Early Childhood English/ }).click();
  await expect(panel.locator('.lg-recent button')).toHaveCount(3);
});

test('previous cards are read-only and return to the current step', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page, 1, { twoCards: true });
  let firstCardCompletions = 0;
  page.on('request', (request) => { if (request.url().endsWith(`/cards/${id.card}/complete/`)) firstCardCompletions++; });
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await panel.getByRole('button', { name: /Language/ }).click();
  await panel.getByRole('button', { name: /Early Childhood English/ }).click();
  await panel.getByRole('button', { name: /Bath time and care/ }).click();
  await panel.getByRole('button', { name: /Start lesson/ }).click();
  const reader = page.getByRole('dialog', { name: 'Bath time and care' });
  await reader.getByRole('button', { name: /I’ve read this card/ }).click();
  await expect(reader.getByText('Dry gently')).toBeVisible();
  await reader.getByRole('button', { name: 'Previous card' }).click();
  await expect(reader.getByText('Warm water')).toBeVisible();
  await expect(reader.getByText('ALREADY READ')).toBeVisible();
  await expect(reader.getByRole('button', { name: /I’ve read this card/ })).toHaveCount(0);
  await page.screenshot({ path: '/tmp/little-grains-previous-card.png' });
  await reader.getByRole('button', { name: 'Return to next step' }).click();
  await expect(reader.getByText('Dry gently')).toBeVisible();
  expect(firstCardCompletions).toBe(1);
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
