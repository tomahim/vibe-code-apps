import { test, expect } from '@playwright/test';
const types = [['idea', 'Idea'], ['bookmark', 'Bookmark'], ['news', 'News'], ['daily-note', 'Daily note'], ['video', 'Video'], ['work-idea', 'Work idea']].map(([slug, name]) => ({ slug, name, icon: '' }));
// Fixture totals add up the way the API computes them: all = sum of the types.
const counts = { all: 140, idea: 60, bookmark: 30, news: 25, 'daily-note': 5, video: 15, 'work-idea': 5 };
const inboxCounts = { all: 78, idea: 30, bookmark: 10, news: 25, 'daily-note': 3, video: 8, 'work-idea': 2 };
const item = { id: 'n1', type: 'idea', title: 'Fixture idea', summary: 'Fixture summary', saved_on: '2026-11-10', updated_at: '2026-11-10T08:00:00Z', categories: [], tags: [] };

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test('sidebar shows how many objects each type holds and follows the category', async ({ page }) => {
  const seen = [];
  await page.addInitScript(() => { localStorage.setItem('genious_token', 'fixture-token'); localStorage.setItem('genious_user', JSON.stringify({ email: 'fixture@example.invalid' })); });
  await page.route('**/api/apps/little-notes/**', async route => {
    const url = new URL(route.request().url()), path = url.pathname.replace('/api/apps/little-notes/', '');
    let data = {};
    if (path === 'taxonomy/') data = { types, categories: [], tags: [], can_manage_taxonomy: false, view_preferences: {}, months: [] };
    else if (path === 'content/') {
      seen.push(url.search);
      const inbox = url.searchParams.get('category') === 'inbox';
      data = { items: [item], total: 1, page: 1, next_page: null, category_counts: { all: 140, inbox: 140 }, type_counts: inbox ? inboxCounts : counts };
    } else if (path === 'content/n1/') data = { ...item, body_markdown: 'Body' };
    await route.fulfill({ json: data });
  });
  await page.goto('/apps/little-notes');
  const side = page.getByLabel('Object type filters');
  await page.getByRole('button', { name: '☰ Types' }).click();
  await expect(side.getByRole('button', { name: /Bookmark/ }).locator('.ln-side-count', { hasText: '10' })).toBeVisible();
  await expect(side.getByRole('button', { name: /Everything/ }).locator('.ln-side-count', { hasText: '78' })).toBeVisible();
  await page.screenshot({ path: '/downloads/little-notes-type-counts-mobile.png' });
});
