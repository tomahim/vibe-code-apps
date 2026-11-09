import { test, expect } from '@playwright/test';

// Synthetic progress and rewards only. No production API or database access.
// Resume bar on the learning-path page (Thomas, 2026-11-09): one tap into the
// first unfinished lesson - the same lesson the gold pennant flags.
const row = (id, title, position = 1) => ({ id, title, position, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
const done = { cards_completed: 2, cards_total: 2, questions_correct: 0, questions_total: 0, started: true, completed: true };
const cur = { cards_completed: 1, cards_total: 2, questions_correct: 0, questions_total: 0, started: true, completed: false };
const todo = { cards_completed: 0, cards_total: 2, questions_correct: 0, questions_total: 0, started: false, completed: false };

function mockApi(page, lessonProgress = [done, cur, todo]) {
  const lessons = lessonProgress.map((progress, i) => ({ ...row(`lesson-${i}`, ['First lesson', 'Second lesson', 'Third lesson'][i], i + 1), progress }));
  const pathProgress = { cards_completed: 3, cards_total: 6, lessons_completed: 1, lessons_total: 3, questions_correct: 0, questions_total: 0, started: true, completed: false };
  page.route('**/api/learning/**', route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: {
      themes: [{ ...row('theme-1', 'Sport'), progress: pathProgress, learning_paths: [{ ...row('path-1', 'Cycling legends'), progress: pathProgress, lessons }] }],
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

for (const mobile of [true, false]) {
  const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 };
  const label = mobile ? 'mobile' : 'desktop';

  test(`${label}: resume bar continues the first unfinished lesson at its next step`, async ({ page }) => {
    await mockApi(page);
    const root = await openPath(page, viewport);
    const resume = root.locator('.lg-resume');
    await expect(resume).toBeVisible();
    await expect(resume).toHaveAccessibleName('Continue lesson 2, Second lesson');
    // It sits directly above the lesson list and spans the panel width.
    const box = await resume.boundingBox();
    const list = await root.locator('.lg-lessons').boundingBox();
    expect(box.y + box.height).toBeLessThanOrEqual(list.y + 1);
    expect(Math.abs(box.width - list.width)).toBeLessThanOrEqual(2);
    // Initial view, before any selection scrolls the panel to its row.
    await page.screenshot({ path: `/tmp/lg-resume-${label}-path-fixture.png` });
    // The floating start button and Practice pill are untouched.
    await root.locator('[data-lesson="1"]').click();
    await expect(root.locator('.lg-fab')).toBeVisible();
    await expect(root.locator('.lg-practice')).toBeVisible();
    // One tap resumes lesson 2 at its first unread card, not at the top.
    await resume.click();
    const reader = page.locator('.grains-reader');
    await expect(reader.getByRole('heading', { name: 'Second lesson' })).toBeVisible();
    await expect(reader.locator('.grains-card-index')).toHaveText('CARD 2 OF 2');
    await expect(reader.getByRole('heading', { name: 'The snowstorm' })).toBeVisible();
    await page.screenshot({ path: `/tmp/lg-resume-${label}-reader-fixture.png` });
  });

  test(`${label}: fresh path offers Start lesson 1, finished path has no resume bar`, async ({ page }) => {
    await mockApi(page, [todo, todo, todo]);
    const root = await openPath(page, viewport);
    await expect(root.locator('.lg-resume')).toHaveAccessibleName('Start lesson 1, First lesson');
    await page.unroute('**/api/learning/**');
    await mockApi(page, [done, done, done]);
    await page.goto('/apps/little-grains');
    await root.locator('.lg-tiles [data-theme="0"]').click();
    await root.locator('[data-path="0"]').click();
    await expect(root.locator('.lg-crumbs [data-go="path"]')).toHaveText('Cycling legends');
    await expect(root.locator('.lg-resume')).toHaveCount(0);
  });
}
