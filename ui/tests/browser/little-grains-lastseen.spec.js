import { test, expect } from '@playwright/test';

// Synthetic progress and rewards only. No production API or database access.
// "Last seen" line at the top right of the learning-path panel (Thomas, 2026-11-09).
const row = (id, title, position = 1) => ({ id, title, position, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
const done = { cards_completed: 2, cards_total: 2, questions_correct: 0, questions_total: 0, started: true, completed: true };
const cur = { cards_completed: 1, cards_total: 2, questions_correct: 0, questions_total: 0, started: true, completed: false };
const todo = { cards_completed: 0, cards_total: 2, questions_correct: 0, questions_total: 0, started: false, completed: false };

function mockApi(page, practice, lessonProgress = [done, cur, todo]) {
  const lessons = lessonProgress.map((progress, i) => ({ ...row(`lesson-${i}`, ['First lesson', 'Second lesson', 'Third lesson'][i], i + 1), progress }));
  const pathProgress = { cards_completed: 3, cards_total: 6, lessons_completed: 1, lessons_total: 3, questions_correct: 0, questions_total: 0, started: true, completed: false };
  page.route('**/api/learning/**', route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: {
      themes: [{ ...row('theme-1', 'Sport'), progress: pathProgress, learning_paths: [{ ...row('path-1', 'Cycling legends'), progress: pathProgress, practice, lessons }] }],
      rewards: { drops: 1284, carrots: 212 }, recent_lessons: [],
    } });
    if (url.pathname.endsWith('/lessons/lesson-1/open/')) return route.fulfill({ json: { lesson_id: 'lesson-1' } });
    if (url.pathname.endsWith('/lessons/lesson-1/')) return route.fulfill({ json: {
      theme: row('theme-1', 'Sport'), learning_path: row('path-1', 'Cycling legends'),
      lesson: { ...row('lesson-1', 'Second lesson', 2), progress: cur },
      cards: [
        { id: 'card-1', position: 1, title: 'The early years', body_markdown: 'First card.', illustration_url: '', completed_at: '2026-11-08T10:00:00Z' },
        { id: 'card-2', position: 2, title: 'The snowstorm', body_markdown: 'Second card.', illustration_url: '', completed_at: null },
      ],
      questions: [], next_step: { type: 'card', id: 'card-2' },
    } });
    if (url.pathname.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], earned_count: 0, new_count: 0 } });
    return route.fulfill({ json: {} });
  });
}

async function openPath(page, viewport) {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'fake-jwt'));
  await page.setViewportSize(viewport);
  await page.goto('/apps/little-grains');
  const root = page.locator('.lg-root');
  await expect(root).toBeVisible();
  await root.locator('.lg-tiles [data-theme="0"]').click();
  await root.locator('[data-path="0"]').click();
  await expect(root.locator('.lg-crumbs [data-go="path"]')).toHaveText('Cycling legends');
  return root;
}


const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const cases = [
  [{ last_activity_at: daysAgo(3), days_since: 3, state: 'fresh' }, 'Last seen: 3 days ago'],
  [{ last_activity_at: daysAgo(12), days_since: 12, state: 'autumn' }, 'Last seen: 12 days ago'],
  [{ last_activity_at: null, days_since: null, state: 'fresh' }, null],
];
for (const [practice, text] of cases) {
  test(`mobile: last seen line for ${practice.state}/${practice.days_since}`, async ({ page }) => {
    await mockApi(page, practice);
    const root = await openPath(page, { width: 390, height: 844 });
    const line = root.locator('.lg-lastseen');
    if (text === null) { await expect(line).toHaveCount(0); return; }
    await expect(line).toHaveText(text);
    // First element of the panel body, right aligned above the eyebrow.
    const align = await line.evaluate((el) => getComputedStyle(el).textAlign);
    expect(align).toBe("right");
    const first = await root.locator('.lg-lastseen').evaluate((el) => el === el.parentElement.firstElementChild);
    expect(first).toBe(true);
    await page.screenshot({ path: `/tmp/lg-lastseen-${practice.days_since}.png` });
  });
}
