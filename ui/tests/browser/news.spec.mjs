import { test, expect } from '@playwright/test';
const items = Array.from({ length: 5 }, (_, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  title: ['An open model built for the next generation of coding tools', 'A safer boundary for autonomous software', 'A small telescope with a much wider view', 'Open-source tools find a new audience', 'The science of holding a single particle'][index],
  source: ['Example Research Lab', 'Example Security Journal', 'Example Science Review', 'Example Developer News', 'Example Physics Journal'][index],
  author: index === 2 ? 'Unknown author' : 'Example author', published: index === 2 ? null : '2026-10-25', added: '2026-10-26',
  topics: index % 2 ? ['Open source', 'AI'] : ['Science'],
  url: `https://example.com/story/${index}`, notion_url: `https://example.com/record/${index}`,
  why_it_matters: 'Synthetic preview story. A thoughtful explanation of what changed and why it is worth your attention, with a link to the original source.',
  claim_status: 'Synthetic fixture only. Researcher-reported findings; independent confirmation is not yet available.',
}));

async function mockFeed(page) {
  const archived = new Set();
  await page.route('**/api/apps/news/**', async route => {
    const request = route.request(), url = new URL(request.url());
    if (request.method() === 'POST') {
      const id = url.pathname.split('/')[4];
      request.postDataJSON().archived ? archived.add(id) : archived.delete(id);
      return route.fulfill({ json: { archived: request.postDataJSON().archived } });
    }
    const archive = url.searchParams.get('view') === 'archive';
    const next = url.searchParams.get('cursor');
    let visible = next ? [{ ...items[0], id: 'older', title: 'An older saved story', added: '2026-10-24' }] : items.filter(item => archived.has(item.id) === archive);
    if (url.searchParams.get("topic")) visible = visible.filter(item => item.topics.includes(url.searchParams.get("topic")));
    return route.fulfill({ json: { items: visible, next_cursor: next ? null : 'synthetic-next', fetched_at: '2026-10-26T07:00:00Z' } });
  });
}

test('inbox, filters, archive/unarchive, both list pagination and safe links', async ({ page }) => {
  await mockFeed(page);
  await page.goto('/apps/news');
  await expect(page.getByRole('heading', { name: 'Daily Five.' })).toBeVisible();
  await expect(page.locator('.news-story')).toHaveCount(5);
  await page.getByRole('button', { name: 'Science', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(3);
  await page.getByRole('button', { name: 'All topics', exact: true }).click();
  await page.getByRole('button', { name: '✓ Archive', exact: true }).first().click();
  await expect(page.locator('.news-story')).toHaveCount(4);
  await page.getByRole('button', { name: 'Archived', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(1);
  await page.getByRole('button', { name: 'Next →', exact: true }).click();
  await expect(page.getByText('Page 2 · Newest first')).toBeVisible();
  await page.getByRole('button', { name: '← Previous', exact: true }).click();
  await page.getByRole('button', { name: '↩ Move to inbox', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(0);
  await page.getByRole('button', { name: 'Inbox', exact: true }).click();
  await page.getByRole('button', { name: 'Next →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'An older saved story' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next →', exact: true })).toBeDisabled();
});

test('private and setup states, keyboard and mobile layout', async ({ page }) => {
  await page.route('**/api/apps/news/**', route => route.fulfill({ status: 401, json: { error: 'Sign in to use this app.' } }));
  await page.goto('/apps/news');
  await expect(page.getByRole('link', { name: 'Sign in to read →' })).toHaveAttribute('href', '/login?next=%2Fapps%2Fnews');
  await page.unroute('**/api/apps/news/**');
  await mockFeed(page);
  await page.reload();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.news-story')).toHaveCount(5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: '/downloads/news-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.screenshot({ path: '/downloads/news-desktop.png', fullPage: true });
  await page.unroute('**/api/apps/news/**');
  await page.route('**/api/apps/news/**', route => route.fulfill({ status: 503, json: { error: 'News is not configured on the server.' } }));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('News is not configured on the server.');
  await expect(page.locator('.news-story')).toHaveCount(0);
});
