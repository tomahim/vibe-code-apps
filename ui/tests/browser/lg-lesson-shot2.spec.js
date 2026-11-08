test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
import { test, expect } from '@playwright/test';

// Practising with a lesson selected on a path scopes the quiz to that
// lesson's questions only (Thomas, 2026-11-08).

const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const row = (rid, title) => ({ id: rid, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
const done = { cards_completed: 2, cards_total: 2, checkpoints_correct: 1, checkpoints_total: 1, questions_correct: 1, questions_total: 1, lessons_completed: 1, lessons_total: 2, started: true, completed: false };
const unread = { cards_completed: 0, cards_total: 2, checkpoints_correct: 0, checkpoints_total: 0, questions_correct: 0, questions_total: 1, lessons_completed: 0, lessons_total: 2, started: false, completed: false };

function mockApi(page, { quizLog }) {
  page.route('**/api/learning/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (url.pathname.endsWith('/garden/')) {
      return route.fulfill({
        json: {
          themes: [{
            ...row(id(1), 'Sport'), description: 'Legends and races', progress: done,
            learning_paths: [{
              celebrated: true,
              ...row(id(11), 'Hockey all time legends'), progress: done,
              practice: { last_activity_at: '2026-11-07T10:00:00+00:00', days_since: 1, state: 'fresh' },
              catch_up: { eligible: true, remaining: 1 },
              lessons: [
                { ...row(id(101), 'The Great One'), learning_path_id: id(11), progress: done },
                { ...row(id(102), 'The Dynasty Years'), learning_path_id: id(11), progress: unread },
              ],
            }],
          }],
          rewards: { drops: 120, carrots: 12 }, recent_lessons: [],
        },
      });
    }
    if (url.pathname.endsWith('/catch-up/')) {
      const lessonParam = url.searchParams.get('lesson');
      quizLog.push(lessonParam);
      if (lessonParam === id(102)) {
        // The unread lesson scopes to an empty, ineligible pool.
        return route.fulfill({ json: { learning_path_id: id(11), eligible: false, remaining: 0, questions: [] } });
      }
      return route.fulfill({
        json: {
          learning_path_id: id(11), eligible: true, remaining: 0,
          questions: [{
            id: id(201), type: 'multiple_choice', after_card_position: 2,
            prompt: 'Which team did Wayne Gretzky join in 1988?',
            options: [{ id: 'kings', text: 'Los Angeles Kings' }, { id: 'rangers', text: 'New York Rangers' }],
            lesson_title: 'The Great One', learning_path_title: 'Hockey all time legends',
          }],
        },
      });
    }
    if (url.pathname.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], earned_count: 0, new_count: 0, streak: { current: 1 } } });
    return route.fulfill({ json: {} });
  });
}

test('practice with a lesson selected asks the API for that lesson only', async ({ page }) => {
  const quizLog = [];
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page, { quizLog });
  await page.goto('/apps/little-grains');

  // Open the theme, then the path, then select the first lesson.
  const panel = page.locator('.lg-panel');
  await panel.getByRole('button', { name: /Sport/ }).click();
  await expect(panel.getByRole('heading', { name: 'Sport' })).toBeVisible();
  await panel.getByRole('button', { name: /Hockey all time legends/ }).click();
  await expect(panel.getByRole('heading', { name: 'Hockey all time legends' })).toBeVisible();
  await panel.locator('.lg-lessons').getByRole('button', { name: /The Great One/ }).click();

  // Practice now scopes to the selected lesson.
  await page.locator('.lg-practice-card, .lg-practice-pill').getByRole('button').click();
  const quiz = page.getByRole('dialog', { name: /Practice quiz/ });
  await expect(quiz.getByText(/Hockey all time legends · The Great One/)).toBeVisible();
  expect(quizLog.length).toBeGreaterThan(0);
  expect(quizLog[quizLog.length - 1]).toBe(id(101));
  await quiz.getByRole('button', { name: 'Close quiz' }).click();

  // Deselect the lesson: practice goes back to the whole path.
  await panel.locator('.lg-lessons').getByRole('button', { name: /The Great One/ }).click();
  await page.locator('.lg-practice-card, .lg-practice-pill').getByRole('button').click();
  await expect(page.getByRole('dialog', { name: /Practice quiz/ })).toBeVisible();
  expect(quizLog[quizLog.length - 1]).toBeNull();
  await page.getByRole('dialog', { name: /Practice quiz/ }).getByRole('button', { name: 'Close quiz' }).click();

  // Selecting the unread lesson must NOT fall back to the whole path: the
  // quiz opens scoped and explains the cards must be read first.
  await panel.locator('.lg-lessons').getByRole('button', { name: /The Dynasty Years/ }).click();
  await page.locator('.lg-practice-card, .lg-practice-pill').getByRole('button').click();
  const scoped = page.getByRole('dialog', { name: /Practice quiz/ });
  await expect(scoped.getByText('Read every card of The Dynasty Years first to practice its questions.')).toBeVisible();
  await expect(scoped.getByText(/Which team did Wayne Gretzky join/)).toHaveCount(0);
  expect(quizLog[quizLog.length - 1]).toBe(id(102));
  await page.screenshot({ path: '/tmp/lg-lesson-practice-mobile.png' });
});
