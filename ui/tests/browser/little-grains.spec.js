import { test, expect } from '@playwright/test';

const id = {
  theme: 'aee95ca0-881c-48b6-9c33-28666497f2b6', path: '7bcf5984-280f-4555-aabb-fa2404fda355',
  lesson: 'ef40c724-a882-4798-949b-1bf950471d9b', card: '8f8b4671-3e2d-4c7f-a3c7-eb207401bb40', card2: '925a9b78-0546-44bf-a8bb-bb02fb6d7aca', question: 'd5494bfe-ef7b-44aa-b2ad-898ea6424a50', alternative: 'a4260aa0-b45b-47e0-b5d7-d869b00e20c3',
};
const row = (id, title) => ({ id, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
function mockApi(page, lessonCount = 1, { recentLessons = [], twoCards = false, completed = false, typedAnswers = false } = {}) {
  let read = completed, readSecond = completed && twoCards, answered = completed, wrong = false;
  const progress = () => ({ cards_completed: Number(read) + Number(readSecond), cards_total: twoCards ? 2 : 1, checkpoints_correct: Number(answered), checkpoints_total: 1, questions_correct: Number(answered), questions_total: 1, lessons_completed: Number(answered), lessons_total: 1, started: read, completed: answered });
  page.route('**/api/learning/**', route => {
    expect(route.request().headers().authorization).toBe('Bearer fake-jwt');
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: { themes: [{ ...row(id.theme, 'Language'), description: 'Everyday language', progress: progress(), learning_paths: [{ ...row(id.path, 'Early Childhood English'), progress: progress(), lessons: Array.from({ length: lessonCount }, (_, i) => ({ ...row(i ? `lesson-${i}` : id.lesson, i ? `Everyday phrase ${i + 1}` : 'Bath time and care'), progress: progress() })) }] }], rewards: { drops: Number(read) + Number(readSecond) + Number(answered) * 105, carrots: Number(answered) }, recent_lessons: recentLessons } });
    if (url.pathname.endsWith(`/lessons/${id.lesson}/`)) {
      const typed = typedAnswers && answered;
      const question = typed
        ? { id: wrong ? id.alternative : id.question, after_card_position: twoCards ? 2 : 1, type: 'type_answer_question', prompt: wrong ? 'Translate: « Utilise une serviette douce. »' : 'Translate: « L’eau du bain est tiède. »', options: [], completed: true }
        : { id: wrong ? id.alternative : id.question, after_card_position: twoCards ? 2 : 1, type: 'multiple_choice', prompt: wrong ? 'How should the water feel?' : 'What is the water like?', options: [{ id: 'warm', text: 'Warm' }, { id: 'cold', text: 'Cold' }], completed: answered };
      return route.fulfill({ json: { theme: row(id.theme, 'Language'), learning_path: row(id.path, 'Early Childhood English'), lesson: { ...row(id.lesson, 'Bath time and care'), progress: progress() }, cards: [{ id: id.card, position: 1, title: 'Warm water', body_markdown: 'The bath water is **warm**.', illustration_url: '', completed_at: read ? '2026-10-28T10:00:00Z' : null }, ...(twoCards ? [{ id: id.card2, position: 2, title: 'Dry gently', body_markdown: 'Use a **soft towel**.', illustration_url: '', completed_at: readSecond ? '2026-10-28T10:01:00Z' : null }] : [])], questions: [question], next_step: !read ? { type: 'card', id: id.card } : twoCards && !readSecond ? { type: 'card', id: id.card2 } : !answered ? { type: 'question', id: question.id } : null } });
    }
    if (url.pathname.endsWith(`/lessons/${id.lesson}/open/`)) return route.fulfill({ json: { lesson_id: id.lesson } });
    if (url.pathname.endsWith(`/cards/${id.card}/complete/`)) { read = true; return route.fulfill({ status: 201, json: { created: true } }); }
    if (url.pathname.endsWith(`/cards/${id.card2}/complete/`)) { readSecond = true; return route.fulfill({ status: 201, json: { created: true } }); }
    if (url.pathname.endsWith('/question-attempts/')) {
      const review = answered;
      const answer = JSON.parse(route.request().postData()).answer;
      const typed = typedAnswers && review;
      const correctAnswer = wrong ? 'Use a soft towel.' : 'The bath water is warm.';
      const correct = typed ? answer.toLowerCase().replace(/[^a-z\s]/g, '').trim() === correctAnswer.toLowerCase().replace(/[^a-z\s]/g, '').trim() : answer === 'warm';
      if (correct) answered = true; else wrong = true;
      return route.fulfill({ status: 201, json: { correct, attempt_type: review ? 'review' : 'initial', explanation: 'Compare the full sentence.', correct_answer: typed ? correctAnswer : null, next_step: correct ? null : { type: 'question', id: id.alternative } } });
    }
    if (url.pathname.endsWith('/leaderboard/')) {
      const currency = url.searchParams.get('currency') === 'carrots' ? 'carrots' : 'drops';
      const period = url.searchParams.get('period') || 'weekly';
      const score = currency === 'carrots' ? 1 : 106;
      return route.fulfill({ json: { currency, period, timezone: 'UTC', rows: [{ rank: 1, name: 'aurore', score: currency === 'carrots' ? 3 : 140, is_self: false }, { rank: 2, name: 'Learner', score, is_self: true }], self: { rank: 2, score, is_self: true }, chart: mockChart(currency, period) } });
    }
  });
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Buckets covering the full calendar window, the way the pre-fix API sent
// them: future days and weeks included. Activity started yesterday, so the
// chart must cut this down to recorded history on its own.
function historyWindow(period, now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const yesterday = today - 864e5;
  const monthStart = (ms) => { const d = new Date(ms); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1); };
  let starts;
  if (period === 'weekly') {
    const monday = today - ((now.getUTCDay() + 6) % 7) * 864e5;
    starts = Array.from({ length: 7 }, (_, i) => monday + i * 864e5);
  } else if (period === 'monthly') {
    // Monday-Sunday weeks clipped to the month, future weeks included.
    const first = monthStart(today);
    const monthEnd = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
    const firstMonday = first - ((new Date(first).getUTCDay() + 6) % 7) * 864e5;
    starts = [];
    for (let monday = firstMonday; monday < monthEnd; monday += 7 * 864e5) starts.push(Math.max(monday, first));
  } else {
    starts = [...new Set([yesterday, today].map(monthStart))];
  }
  return starts.map((start) => {
    const d = new Date(start);
    const monday = start - ((d.getUTCDay() + 6) % 7) * 864e5;
    const end = period === 'weekly' ? start + 864e5
      : period === 'monthly' ? Math.min(monday + 7 * 864e5, Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
      : Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
    const lastDay = new Date(end - 864e5);
    const label = period === 'weekly' ? DAYS[(d.getUTCDay() + 6) % 7]
      : period === 'monthly' ? (d.getUTCDate() === lastDay.getUTCDate() ? `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}` : `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}\u2013${lastDay.getUTCDate()}`)
      : d.getUTCFullYear() === now.getUTCFullYear() ? MONTHS[d.getUTCMonth()]
      : `${MONTHS[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`;
    return { label, start: new Date(start).toISOString(), end: new Date(end).toISOString(), current: start <= now.getTime() && now.getTime() < end };
  });
}

function mockChart(currency, period) {
  const buckets = historyWindow(period);
  const totals = currency === 'carrots' ? { self: 1, other: 3 } : { self: 106, other: 140 };
  const now = new Date();
  const yesterday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 864e5;
  // Cumulative series: nothing before yesterday, the rest earned between
  // yesterday and today, flat into the future buckets, ending exactly on
  // the leaderboard scores.
  const today = yesterday + 864e5;
  const points = (total) => buckets.map((b) => {
    const start = Date.parse(b.start), end = Date.parse(b.end);
    if (end <= yesterday) return 0;
    const hasYesterday = start <= yesterday && yesterday < end;
    const hasToday = start <= today && today < end;
    if (hasYesterday && !hasToday) return Math.round((total * 4) / 5);
    return total;
  });
  return { period, buckets, series: [
    { name: 'aurore', is_self: false, points: points(totals.other) },
    { name: 'Learner', is_self: true, points: points(totals.self) },
  ]};
}

test('Little Grains requires sign-in', async ({ page }) => {
  await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
  await page.goto('/');
  await page.locator('.app-card').filter({ has: page.locator('.app-card-title').getByText('Little Grains', { exact: true }) }).click();
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
  await expect(page.getByRole('dialog', { name: 'Leaderboard' }).locator('.grains-ranking .name').filter({ hasText: 'Learner' })).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-desktop.png' });
});

test('reward totals and leaderboard explain the same Drops and Carrots rules', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page);
  await page.goto('/apps/little-grains');

  await page.getByRole('button', { name: /How Drops are earned/ }).click();
  const dropInfo = page.getByRole('dialog', { name: 'How Drops are earned' });
  await expect(dropInfo).toBeVisible();
  const dropDescription = await dropInfo.locator('p').textContent();
  expect(dropDescription).toContain('100 more when you complete a learning path');
  await page.screenshot({ path: '/tmp/little-grains-drops-info.png' });
  await dropInfo.getByRole('button', { name: 'Close reward information' }).click();

  await page.getByRole('button', { name: /How Carrots are earned/ }).click();
  const carrotInfo = page.getByRole('dialog', { name: 'How Carrots are earned' });
  await expect(carrotInfo).toBeVisible();
  const carrotDescription = await carrotInfo.locator('p').textContent();
  expect(carrotDescription).toContain('first time you answer a checkpoint correctly');
  await carrotInfo.getByRole('button', { name: 'Close reward information' }).click();

  await page.getByRole('button', { name: 'Open leaderboard' }).click();
  const leaderboard = page.getByRole('dialog', { name: 'Leaderboard' });
  await expect(leaderboard.locator('.grains-reward-description')).toHaveText(dropDescription);
  await leaderboard.getByRole('button', { name: /Carrots/ }).click();
  await expect(leaderboard.locator('.grains-reward-description')).toHaveText(carrotDescription);
  await page.screenshot({ path: '/tmp/little-grains-leaderboard-carrots.png' });
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

test('a completed lesson replays cards and questions without rereading progress', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page, 1, { twoCards: true, completed: true });
  const cardWrites = [];
  const attempts = [];
  page.on('request', (request) => {
    if (request.url().includes('/cards/') && request.url().endsWith('/complete/')) cardWrites.push(request.url());
    if (request.url().endsWith('/question-attempts/')) attempts.push(JSON.parse(request.postData()));
  });
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await panel.getByRole('button', { name: /Language/ }).click();
  await panel.getByRole('button', { name: /Early Childhood English/ }).click();
  await panel.getByRole('button', { name: /Bath time and care/ }).click();
  await panel.getByRole('button', { name: /Read lesson/ }).click();
  const reader = page.getByRole('dialog', { name: 'Bath time and care' });
  await expect(reader.getByText('Warm water')).toBeVisible();
  await expect(reader.getByText('3 of 3 steps complete')).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-lesson-replay.png' });
  await reader.getByRole('button', { name: /I’ve read this card/ }).click();
  await expect(reader.getByText('Dry gently')).toBeVisible();
  await reader.getByRole('button', { name: /I’ve read this card/ }).click();
  await expect(reader.getByText('What is the water like?')).toBeVisible();
  await reader.getByLabel('Cold', { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer' }).click();
  await reader.getByRole('button', { name: 'Try another question' }).click();
  await expect(reader.getByText('How should the water feel?')).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-lesson-replay-question.png' });
  await reader.getByLabel('Warm', { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer' }).click();
  await expect(reader.getByText('That’s right!', { exact: true })).toBeVisible();
  await expect(reader.getByText('+1 carrot')).toHaveCount(0);
  await reader.getByRole('button', { name: 'Continue →' }).click();
  await expect(reader.getByText('Lesson in bloom')).toBeVisible();
  expect(cardWrites).toHaveLength(0);
  expect(attempts).toHaveLength(2);
});

test('phone replay asks for a full typed answer and rotates after a wrong answer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page, 1, { twoCards: true, completed: true, typedAnswers: true });
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await panel.getByRole('button', { name: /Language/ }).click();
  await panel.getByRole('button', { name: /Early Childhood English/ }).click();
  await panel.getByRole('button', { name: /Bath time and care/ }).click();
  await panel.getByRole('button', { name: /Read lesson/ }).click();
  const reader = page.getByRole('dialog', { name: 'Bath time and care' });
  await reader.getByRole('button', { name: /I’ve read this card/ }).click();
  await reader.getByRole('button', { name: /I’ve read this card/ }).click();
  await expect(reader.getByText('Translate: « L’eau du bain est tiède. »')).toBeVisible();
  await expect(reader.getByRole('radiogroup')).toHaveCount(0);
  const answer = reader.getByRole('textbox', { name: 'Your answer' });
  await expect(answer).toBeVisible();
  await expect(reader.getByRole('button', { name: 'Check answer' })).toBeDisabled();
  await page.screenshot({ path: '/tmp/little-grains-typed-answer-mobile.png' });
  await answer.fill('Too hot.');
  await reader.getByRole('button', { name: 'Check answer' }).click();
  await expect(reader.getByText('An accepted answer:')).toContainText('The bath water is warm.');
  await reader.getByRole('button', { name: 'Try another question' }).click();
  await expect(reader.getByText('Translate: « Utilise une serviette douce. »')).toBeVisible();
  await reader.getByRole('textbox', { name: 'Your answer' }).fill('Use a soft towel.');
  await reader.getByRole('button', { name: 'Check answer' }).click();
  await expect(reader.getByText('That’s right!', { exact: true })).toBeVisible();
  await expect(reader.getByText('+1 carrot')).toHaveCount(0);
  await page.screenshot({ path: '/tmp/little-grains-typed-feedback-mobile.png' });
  await reader.getByRole('button', { name: 'Continue →' }).click();
  await expect(reader.getByText('Lesson in bloom')).toBeVisible();
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
  await expect(page.getByRole('dialog', { name: 'Leaderboard' }).locator('.grains-ranking .name').filter({ hasText: 'Learner' })).toBeVisible();
  await page.screenshot({ path: '/tmp/little-grains-mobile.png' });
  await page.getByRole('dialog', { name: 'Leaderboard' }).getByRole('button', { name: 'Close leaderboard' }).click();
  await page.getByRole('button', { name: /How Drops are earned/ }).click();
  await expect(page.getByRole('dialog', { name: 'How Drops are earned' })).toBeInViewport();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});

test('the leaderboard charts the growth of Drops and Carrots over time', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  mockApi(page);
  // Keep this test fast: the chart does not depend on the 3D garden scene.
  await page.route('**/api/learning/garden/', route => route.fulfill({ json: { themes: [], rewards: { drops: 0, carrots: 0 }, recent_lessons: [] } }));
  await page.goto('/apps/little-grains');
  await page.getByRole('button', { name: 'Open leaderboard' }).click();
  const leaderboard = page.getByRole('dialog', { name: 'Leaderboard' });
  const chart = leaderboard.locator('.grains-chart');
  // The mock records activity since yesterday only: the chart must cover
  // exactly that window, with no future or empty leading buckets.
  const now = new Date();
  const yesterday = new Date(now.getTime() - 864e5);
  const weekday = (now.getUTCDay() + 6) % 7; // Monday = 0
  const weeklyLabels = DAYS.slice(Math.max(0, weekday - 1), weekday + 1);
  const weekLabel = (d) => {
    const day = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    const monday = day - ((d.getUTCDay() + 6) % 7) * 864e5;
    const start = new Date(Math.max(monday, Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)));
    const last = new Date(Math.min(monday + 7 * 864e5, Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1)) - 864e5);
    return start.getUTCDate() === last.getUTCDate()
      ? `${MONTHS[start.getUTCMonth()]} ${start.getUTCDate()}`
      : `${MONTHS[start.getUTCMonth()]} ${start.getUTCDate()}\u2013${last.getUTCDate()}`;
  };
  const monthlyLabels = yesterday.getUTCMonth() === now.getUTCMonth()
    ? [...new Set([weekLabel(yesterday), weekLabel(now)])]
    : [weekLabel(now)];
  const monthLabel = (d) => (d.getUTCFullYear() === now.getUTCFullYear() ? MONTHS[d.getUTCMonth()] : `${MONTHS[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`);
  const overallLabels = [...new Set([yesterday, now].map(monthLabel))];
  await expect(chart.getByRole('img', { name: 'drops growth, day by day' })).toBeVisible({ timeout: 20000 });
  await expect(chart.locator('.grains-chart-x')).toHaveText(weeklyLabels);
  await expect(chart.locator('.grains-chart-legend')).toContainText('aurore');
  await chart.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/little-grains-chart-weekly-mobile.png' });
  await leaderboard.getByRole('button', { name: 'Monthly' }).click();
  await expect(chart.getByRole('img', { name: 'drops growth, week by week' })).toBeVisible({ timeout: 20000 });
  await expect(chart.locator('.grains-chart-x')).toHaveText(monthlyLabels);
  await chart.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/little-grains-chart-monthly-mobile.png' });
  await leaderboard.getByRole('button', { name: 'Overall' }).click();
  await expect(chart.getByRole('img', { name: 'drops growth, month by month' })).toBeVisible({ timeout: 20000 });
  await expect(chart.locator('.grains-chart-x')).toHaveText(overallLabels);
  await chart.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/little-grains-chart-overall-mobile.png' });
  await leaderboard.getByRole('button', { name: /Carrots/ }).click();
  await expect(chart.getByRole('img', { name: 'carrots growth, month by month' })).toBeVisible({ timeout: 20000 });
  await chart.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/little-grains-chart-carrots-mobile.png' });
});

test('phone path panel shows the question gauge and runs the catch-up quiz', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  const q1 = 'd5494bfe-ef7b-44aa-b2ad-898ea6424a50', q2 = 'a4260aa0-b45b-47e0-b5d7-d869b00e20c3';
  const quizQuestions = [
    { id: q1, lesson_id: id.lesson, lesson_title: 'Bath time and care', position: 1, after_card_position: 1, type: 'multiple_choice', prompt: 'How often should you bathe a newborn?', options: [{ id: 'daily', text: 'Every day' }, { id: 'few', text: 'Two or three times a week' }] },
    { id: q2, lesson_id: id.lesson, lesson_title: 'Bath time and care', position: 2, after_card_position: 1, type: 'type_answer_question', prompt: 'Translate: « La crème hydratante. »', options: [] },
  ];
  const solved = new Set();
  const progress = () => ({ cards_completed: 4, cards_total: 4, checkpoints_correct: 1, checkpoints_total: 1, questions_correct: 1 + solved.size, questions_total: 3, lessons_completed: 0, lessons_total: 1, started: true, completed: solved.size === 2 });
  const lesson = () => ({ ...row(id.lesson, 'Bath time and care'), progress: progress() });
  await page.route('**/api/learning/**', route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: { themes: [{ ...row(id.theme, 'Language'), progress: progress(), learning_paths: [{ ...row(id.path, 'English for babies'), progress: progress(), catch_up: { eligible: true, remaining: 2 - solved.size }, lessons: [lesson()] }] }], rewards: { drops: 4, carrots: 1 }, recent_lessons: [] } });
    if (url.pathname.endsWith('/catch-up/')) return route.fulfill({ json: { learning_path_id: id.path, eligible: true, remaining: quizQuestions.length, questions: quizQuestions } });
    if (url.pathname.endsWith('/question-attempts/')) {
      const body = JSON.parse(route.request().postData());
      expect(body.attempt_type).toBe('quiz');
      const correct = body.answer === 'few' || body.answer.toLowerCase().includes('moistur');
      if (correct) solved.add(body.question_id);
      return route.fulfill({ status: 201, json: { correct, attempt_type: 'quiz', explanation: 'Newborn skin does not need a daily bath.', correct_answer: body.question_id === q2 ? 'The moisturizer.' : null, next_step: null, progress: progress() } });
    }
    return route.fulfill({ json: {} });
  });
  await page.goto('/apps/little-grains');
  const panel = page.locator('.lg-panel');
  await panel.getByRole('button', { name: /Language/ }).click();
  await panel.getByRole('button', { name: /English for babies/ }).click();
  await expect(panel.getByRole('heading', { name: 'English for babies' })).toBeVisible();
  // The gauge: 1 of 3 questions answered correctly.
  const gauge = panel.locator('.lg-gauge');
  await expect(gauge).toContainText('Questions answered correctly');
  await expect(gauge).toContainText('33%');
  await expect(gauge).toContainText('1 of 3 questions on this path');
  // The lesson row is fully read but below 100%: it carries its percentage.
  await expect(panel.locator('.lg-lessons .pc')).toHaveText('33%');
  await page.screenshot({ path: '/tmp/lg-204-gauge-mobile.png' });

  await panel.getByRole('button', { name: /Catch-up quiz · 2 questions to go/ }).click();
  const quiz = page.getByRole('dialog', { name: 'Catch-up quiz - English for babies' });
  await expect(quiz.getByRole('heading', { name: '2 questions to go' })).toBeVisible();
  await expect(quiz.getByText('How often should you bathe a newborn?')).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-204-quiz-question-mobile.png' });

  // A wrong answer re-queues the question at the end of the session.
  await quiz.getByLabel('Every day', { exact: true }).check();
  await quiz.getByRole('button', { name: 'Check answer' }).click();
  await expect(quiz.getByText('Not quite. It comes back at the end of this quiz.')).toBeVisible();
  await quiz.getByRole('button', { name: 'Continue →' }).click();
  await expect(quiz.getByText('Translate: « La crème hydratante. »')).toBeVisible();
  await quiz.getByRole('textbox', { name: 'Your answer' }).fill('The moisturizer!');
  await quiz.getByRole('button', { name: 'Check answer' }).click();
  await expect(quiz.getByText('That’s right!')).toBeVisible();
  await quiz.getByRole('button', { name: 'Continue →' }).click();
  // The re-queued question is back; answer it correctly this time.
  await expect(quiz.getByText('How often should you bathe a newborn?')).toBeVisible();
  await quiz.getByLabel('Two or three times a week', { exact: true }).check();
  await quiz.getByRole('button', { name: 'Check answer' }).click();
  await quiz.getByRole('button', { name: 'Continue →' }).click();
  await expect(quiz.getByText('2 of 2 answered correctly')).toBeVisible();
  await page.screenshot({ path: '/tmp/lg-204-quiz-summary-mobile.png' });
  await quiz.getByRole('button', { name: 'Back to the garden' }).click();
  // The garden refreshed: nothing left, the button becomes the done state.
  await expect(panel.locator('.lg-quiz-done')).toHaveText('All questions answered ✓');
  await expect(panel.locator('.lg-gauge')).toContainText('100%');
  await expect(panel.locator('.lg-lessons .pc')).toHaveCount(0);
  await page.screenshot({ path: '/tmp/lg-204-gauge-complete-mobile.png' });
});
