import { test, expect } from '@playwright/test';

// The weekly Challenge: shared draw, 30s per question with auto-advance,
// ranking locked until both players finished (Thomas, 2026-11-08).

const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const row = (rid, title) => ({ id: rid, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
const done = { cards_completed: 2, cards_total: 2, checkpoints_correct: 1, checkpoints_total: 1, questions_correct: 1, questions_total: 1, lessons_completed: 1, lessons_total: 1, started: true, completed: true };

function mockApi(page, { answers, seconds = 8 }) {
  page.route('**/api/learning/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (url.pathname.endsWith('/garden/')) {
      return route.fulfill({
        json: {
          themes: [{
            ...row(id(1), 'Sport'), description: 'Legends', progress: done,
            learning_paths: [{ celebrated: true, ...row(id(11), 'Hockey all time legends'), progress: done, practice: { last_activity_at: '2026-11-07T10:00:00+00:00', days_since: 1, state: 'fresh' }, catch_up: { eligible: true, remaining: 0 }, lessons: [{ ...row(id(101), 'The Great One'), learning_path_id: id(11), progress: done }] }],
          }],
          rewards: { drops: 120, carrots: 12 }, recent_lessons: [],
        },
      });
    }
    if (url.pathname.endsWith('/challenge/history/')) {
      return route.fulfill({ json: { weeks: [{ week_key: '2026-W44', size: 10, me: { answered: 10, correct: 7, finished: true }, ranking: [{ name: 'Thomas', correct: 7, is_self: true, rank: 1 }, { name: 'Aurore', correct: 5, is_self: false, rank: 2 }] }] } });
    }
    if (url.pathname.endsWith('/challenge/answers/')) {
      answers.push(route.request().postDataJSON());
      const mine = { answered: answers.length, correct: answers.filter((a) => a.answer === 'kings').length, finished: answers.length >= 2 };
      return route.fulfill({ status: 201, json: { question_id: id(201), correct: answers[answers.length - 1].answer === 'kings', carrot_earned: false, explanation: 'x', correct_answer: null, me: mine, ranking: null } });
    }
    if (url.pathname.endsWith('/challenge/')) {
      return route.fulfill({
        json: {
          week_key: '2026-W45', size: 2, seconds_per_question: seconds,
          me: { answered: 0, correct: 0, finished: false }, ranking: null,
          questions: [
            { id: id(201), type: 'multiple_choice', after_card_position: 2, prompt: 'Which team did Wayne Gretzky join in 1988?', options: [{ id: 'kings', text: 'Los Angeles Kings' }, { id: 'rangers', text: 'New York Rangers' }], lesson_title: 'The Great One', learning_path_title: 'Hockey all time legends', answered: false },
            { id: id(202), type: 'multiple_choice', after_card_position: 2, prompt: 'How many Stanley Cups did the Oilers win in the 80s?', options: [{ id: 'five', text: 'Five' }, { id: 'four', text: 'Four' }], lesson_title: 'The Dynasty Years', learning_path_title: 'Hockey all time legends', answered: false },
          ],
        },
      });
    }
    if (url.pathname.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], earned_count: 0, new_count: 0, streak: { current: 1 } } });
    return route.fulfill({ json: {} });
  });
}

test('challenge: intro with history, timed questions, auto-advance, locked ranking', async ({ page }) => {
  const answers = [];
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page, { answers });
  await page.goto('/apps/little-grains');

  // The float now offers Review or Challenge, with its own icons.
  const float = page.locator('.lg-review-float');
  await expect(float.getByRole('button', { name: /review/i })).toBeVisible();
  const entry = float.getByRole('button', { name: /challenge/i });
  await expect(entry).toBeVisible();

  // Intro: the duel's rules and last week's result.
  await entry.click();
  const dialog = page.getByRole('dialog', { name: 'Weekly challenge' });
  await expect(dialog.getByRole('heading', { name: "This week's duel" })).toBeVisible();
  await expect(dialog.getByText('2026-W44')).toBeVisible();

  // Question 1: answered in time. Question 2: the mock clock runs out and
  // the answer is recorded empty (wrong) by auto-advance. No mid-quiz
  // screenshot: capturing the WebGL canvas takes seconds under the runner
  // and would eat the mock clock.
  await dialog.getByRole('button', { name: 'Take the challenge' }).click();
  await expect(dialog.getByText('Question 1 of 2')).toBeVisible();
  await dialog.locator('label', { hasText: 'Los Angeles Kings' }).click();
  await dialog.getByRole('button', { name: 'Lock it in →' }).click();
  await expect(dialog.getByText('Question 2 of 2')).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Challenge complete' })).toBeVisible({ timeout: 20000 });
  expect(answers.map((a) => a.answer)).toEqual(['kings', '']);
  await expect(dialog.getByText('1 of 2 correct')).toBeVisible();
  await expect(dialog.getByText(/ranking unlocks once both players/i)).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-challenge-done-desktop.png' });
});

test('phone: challenge entry pill and duel intro stay usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const answers = [];
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page, { answers, seconds: 30 });
  await page.goto('/apps/little-grains');
  const pill = page.locator('button.lg-challenge-pill');
  await expect(pill).toBeVisible();
  await pill.click();
  const dialog = page.getByRole('dialog', { name: 'Weekly challenge' });
  await expect(dialog.getByRole('heading', { name: "This week's duel" })).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-challenge-intro-mobile.png' });
  await dialog.getByRole('button', { name: 'Take the challenge' }).click();
  await expect(dialog.getByText('Question 1 of 2')).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-challenge-question-mobile.png' });
});

test('ten-question flow: timer, auto-advance, completion and ranking reveal', async ({ page }) => {
  test.setTimeout(120000);
  const answers = [];
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  const questions = Array.from({ length: 10 }, (_, i) => ({
    id: id(300 + i), type: 'multiple_choice', after_card_position: 1,
    prompt: `General knowledge question ${i + 1}?`,
    options: [{ id: 'a', text: `Right ${i + 1}` }, { id: 'b', text: `Wrong ${i + 1}` }],
    lesson_title: `Lesson ${i + 1}`, learning_path_title: 'Hockey all time legends', answered: false,
  }));
  page.route('**/api/learning/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (url.pathname.endsWith('/garden/')) {
      return route.fulfill({
        json: {
          themes: [{ ...row(id(1), 'Sport'), description: 'L', progress: done, learning_paths: [{ celebrated: true, ...row(id(11), 'Hockey all time legends'), progress: done, practice: { last_activity_at: '2026-11-07T10:00:00+00:00', days_since: 1, state: 'fresh' }, catch_up: { eligible: true, remaining: 0 }, lessons: [{ ...row(id(101), 'The Great One'), learning_path_id: id(11), progress: done }] }] }],
          rewards: { drops: 120, carrots: 12 }, recent_lessons: [],
        },
      });
    }
    if (url.pathname.endsWith('/challenge/history/')) return route.fulfill({ json: { weeks: [] } });
    if (url.pathname.endsWith('/challenge/answers/')) {
      answers.push(route.request().postDataJSON());
      const finished = answers.length >= 10;
      return route.fulfill({
        status: 201,
        json: {
          question_id: id(300), correct: answers[answers.length - 1].answer === 'a', carrot_earned: answers[answers.length - 1].answer === 'a', explanation: 'x', correct_answer: null,
          me: { answered: answers.length, correct: answers.filter((a) => a.answer === 'a').length, finished },
          // Both players done by the time I finish: the ranking reveals.
          ranking: finished ? [{ name: 'Aurore', correct: 5, is_self: false, rank: 1 }, { name: 'Thomas', correct: 2, is_self: true, rank: 2 }] : null,
        },
      });
    }
    if (url.pathname.endsWith('/challenge/')) {
      return route.fulfill({ json: { week_key: '2026-W45', size: 10, seconds_per_question: 3, me: { answered: 0, correct: 0, finished: false }, ranking: null, questions } });
    }
    if (url.pathname.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], earned_count: 0, new_count: 0, streak: { current: 1 } } });
    return route.fulfill({ json: {} });
  });
  await page.goto('/apps/little-grains');
  await page.locator('.lg-review-float').getByRole('button', { name: /challenge/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Weekly challenge' });
  await expect(dialog.getByText('10 questions picked at random from the general-knowledge paths')).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-challenge-intro10-desktop.png' });
  await dialog.getByRole('button', { name: 'Take the challenge' }).click();

  // Questions 1-2 answered in time; 3-10 run the 3-second clock out.
  for (let i = 1; i <= 2; i++) {
    await expect(dialog.getByText(`Question ${i} of 10`)).toBeVisible();
    await dialog.locator('label', { hasText: `Right ${i}` }).click();
    await dialog.getByRole('button', { name: 'Lock it in →' }).click();
  }
  await expect(dialog.getByRole('heading', { name: 'Challenge complete' })).toBeVisible({ timeout: 60000 });
  expect(answers.map((a) => a.answer)).toEqual(['a', 'a', '', '', '', '', '', '', '', '']);
  await expect(dialog.getByText('2 of 10 correct')).toBeVisible();
  // Reveal: both players finished, so the ranking shows.
  await expect(dialog.getByText('#1 Aurore — 5/10')).toBeVisible();
  await expect(dialog.getByText('#2 Thomas — 2/10')).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-challenge-reveal-desktop.png' });
});

test('phone: intro shows production timer config (10 questions, 30 seconds)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  const questions = Array.from({ length: 10 }, (_, i) => ({
    id: id(400 + i), type: 'multiple_choice', after_card_position: 1,
    prompt: `Question ${i + 1}?`,
    options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
    lesson_title: `Lesson ${i + 1}`, learning_path_title: 'Hockey all time legends', answered: false,
  }));
  page.route('**/api/learning/**', (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (url.pathname.endsWith('/garden/')) {
      return route.fulfill({
        json: {
          themes: [{ ...row(id(1), 'Sport'), description: 'L', progress: done, learning_paths: [{ celebrated: true, ...row(id(11), 'Hockey all time legends'), progress: done, practice: { last_activity_at: '2026-11-07T10:00:00+00:00', days_since: 1, state: 'fresh' }, catch_up: { eligible: true, remaining: 0 }, lessons: [{ ...row(id(101), 'The Great One'), learning_path_id: id(11), progress: done }] }] }],
          rewards: { drops: 120, carrots: 12 }, recent_lessons: [],
        },
      });
    }
    if (url.pathname.endsWith('/challenge/history/')) return route.fulfill({ json: { weeks: [] } });
    if (url.pathname.endsWith('/challenge/')) {
      return route.fulfill({ json: { week_key: '2026-W45', size: 10, seconds_per_question: 30, me: { answered: 0, correct: 0, finished: false }, ranking: null, questions } });
    }
    return route.fulfill({ json: {} });
  });
  await page.goto('/apps/little-grains');
  await page.locator('button.lg-challenge-pill').click();
  const dialog = page.getByRole('dialog', { name: 'Weekly challenge' });
  await expect(dialog.getByText('10 questions picked at random from the general-knowledge paths — read or not. 30 seconds each, then it moves on. Same questions for both players.')).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-challenge-intro-prod-mobile.png' });
});
