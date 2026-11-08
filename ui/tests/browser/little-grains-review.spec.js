import { test, expect } from '@playwright/test';

// Review sessions (5/10/15 minutes over the stalest paths) and the seasonal
// aging of unpractised paths in the garden scene.

const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const row = (rid, title) => ({ id: rid, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
const done = { cards_completed: 2, cards_total: 2, checkpoints_correct: 1, checkpoints_total: 1, questions_correct: 1, questions_total: 1, lessons_completed: 1, lessons_total: 1, started: true, completed: true };

const paths = [
  { ...row(id(11), 'Hockey all time legends'), progress: done, practice: { last_activity_at: '2026-10-14T10:00:00+00:00', days_since: 25, state: 'winter' }, catch_up: { eligible: true, remaining: 0 } },
  { ...row(id(12), 'Legendary dive sites'), progress: done, practice: { last_activity_at: '2026-10-29T10:00:00+00:00', days_since: 10, state: 'autumn' }, catch_up: { eligible: true, remaining: 0 } },
  { ...row(id(13), 'Trail-running races'), progress: done, practice: { last_activity_at: '2026-11-07T10:00:00+00:00', days_since: 1, state: 'fresh' }, catch_up: { eligible: true, remaining: 0 } },
];
const lesson = (pathId, n) => ({ ...row(id(100 + n), `Lesson ${n}`), learning_path_id: pathId, progress: done });

function mockApi(page, { reviewLog = null } = {}) {
  page.route('**/api/learning/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    expect(route.request().headers().authorization).toBe('Bearer fake-jwt');
    if (url.pathname.endsWith('/garden/')) {
      return route.fulfill({
        json: {
          themes: [{
            ...row(id(1), 'Sport'), description: 'Legends and races', progress: done,
            learning_paths: paths.map((p, i) => ({ ...p, lessons: [lesson(p.id, i)] })),
          }],
          rewards: { drops: 120, carrots: 12 }, recent_lessons: [],
        },
      });
    }
    if (url.pathname.endsWith('/review/')) {
      const minutes = url.searchParams.get('minutes');
      if (reviewLog) reviewLog.push(minutes);
      return route.fulfill({
        json: {
          minutes: Number(minutes), eligible: true,
          learning_paths: [{ id: id(11), title: 'Hockey all time legends', theme_title: 'Sport', last_activity_at: '2026-10-14T10:00:00+00:00' }],
          questions: [{
            id: id(201), type: 'multiple_choice', after_card_position: 2,
            prompt: 'Which team did Wayne Gretzky join in 1988?',
            options: [{ id: 'kings', text: 'Los Angeles Kings' }, { id: 'rangers', text: 'New York Rangers' }, { id: 'blues', text: 'St. Louis Blues' }, { id: 'oilers', text: 'Edmonton Oilers' }],
            lesson_title: 'The Great One', learning_path_title: 'Hockey all time legends',
          }],
        },
      });
    }
    if (url.pathname.endsWith('/question-attempts/')) {
      return route.fulfill({
        status: 201,
        json: { attempt_id: '9', question_id: id(201), attempt_type: 'review', correct: true, carrot_earned: false, explanation: 'The trade to the Kings shook the league.', answered_at: '2026-11-08T20:00:00+00:00', correct_answer: null, progress: done, next_step: null },
      });
    }
    if (url.pathname.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], earned_count: 0, new_count: 0, streak: { current: 1 } } });
    return route.fulfill({ json: {} });
  });
}

test('review quest: time choice drives the session size and the quiz runs', async ({ page }) => {
  const reviewLog = [];
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page, { reviewLog });
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await expect(panel.getByRole('heading', { name: 'The Garden' })).toBeVisible();

  await panel.getByRole('button', { name: /Review/ }).click();
  const quest = page.getByRole('dialog', { name: /Review - choose how much time/ });
  await expect(quest.getByRole('heading', { name: 'How much time do you have?' })).toBeVisible();
  await expect(quest.getByRole('button', { name: /5 min/ })).toContainText('10 questions · 1 path');
  await expect(quest.getByRole('button', { name: /10 min/ })).toContainText('20 questions · 2 paths');
  await expect(quest.getByRole('button', { name: /15 min/ })).toContainText('30 questions · 3 paths');
  await page.screenshot({ path: '/tmp/lg-review-quest-desktop.png' });

  await quest.getByRole('button', { name: /5 min/ }).click();
  expect(reviewLog).toEqual(['5']);
  const quiz = page.getByRole('dialog', { name: 'Review · 5 minutes' });
  await expect(quiz.getByText('REVIEW', { exact: true })).toBeVisible();
  await expect(quiz.getByText(/Hockey all time legends · The Great One/)).toBeVisible();
  await quiz.getByLabel(/Los Angeles Kings/).check();
  await quiz.getByRole('button', { name: 'Check answer' }).click();
  await expect(quiz.getByText('That’s right!')).toBeVisible();
  await quiz.getByRole('button', { name: 'Continue →' }).click();
  await expect(quiz.getByText('Quiz complete')).toBeVisible();
  await quiz.getByRole('button', { name: 'Back to the garden' }).click();
});

test('aged paths show their season in the garden, theme and path views', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page);
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await expect(panel.getByRole('heading', { name: 'The Garden' })).toBeVisible();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/tmp/lg-review-garden-seasons.png' });

  // Theme view: winter and autumn paths carry their emoji.
  await panel.getByRole('button', { name: /Sport/ }).click();
  await expect(panel.getByRole('button', { name: /Hockey all time legends/ })).toContainText('❄️');
  await expect(panel.getByRole('button', { name: /Legendary dive sites/ })).toContainText('🍂');
  await expect(panel.getByRole('button', { name: /Trail-running races/ })).not.toContainText('🍂');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/tmp/lg-review-theme-seasons.png' });

  // Path view: the winter path explains itself.
  await panel.getByRole('button', { name: /Hockey all time legends/ }).click();
  await expect(panel.getByText(/Not practised for 25 days/)).toBeVisible();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/tmp/lg-review-path-winter.png' });
});

test('phone: review quest picker and aged garden stay usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page);
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await expect(panel.getByRole('heading', { name: 'The Garden' })).toBeVisible();
  await page.waitForTimeout(900);
  await page.screenshot({ path: '/tmp/lg-review-garden-mobile.png' });

  await panel.getByRole('button', { name: /Review/ }).click();
  const quest = page.getByRole('dialog', { name: /Review - choose how much time/ });
  await expect(quest.getByRole('button', { name: /10 min/ })).toBeInViewport();
  await page.screenshot({ path: '/tmp/lg-review-quest-mobile.png' });
  await quest.getByRole('button', { name: /10 min/ }).click();
  const quiz = page.getByRole('dialog', { name: 'Review · 10 minutes' });
  await expect(quiz.getByText(/Hockey all time legends · The Great One/)).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-review-quiz-mobile.png' });
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});
