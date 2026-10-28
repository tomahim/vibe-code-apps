import { test, expect } from '@playwright/test';
const items = Array.from({ length: 5 }, (_, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  title: ['An open model built for the next generation of coding tools', 'A safer boundary for autonomous software', 'A small telescope with a much wider view', 'Open-source tools find a new audience', 'The science of holding a single particle'][index],
  source: ['Example Research Lab', 'Example Security Journal', 'Example Science Review', 'Example Developer News', 'Example Physics Journal'][index],
  author: index === 2 ? 'Unknown author' : 'Example author', published: index === 2 ? null : '2026-10-25', added: '2026-10-26',
  category: 'Inbox', topics: index % 2 ? ['Open source', 'AI'] : ['Science'],
  url: `https://example.com/story/${index}`, notion_url: `https://example.com/record/${index}`,
  why_it_matters: 'Synthetic preview story. A thoughtful explanation of what changed and why it is worth your attention, with a link to the original source.',
  claim_status: 'Synthetic fixture only. Researcher-reported findings; independent confirmation is not yet available.',
}));

async function mockFeed(page) {
  const archived = new Set();
  const categories = new Map();
  await page.route('**/api/apps/news/**', async route => {
    const request = route.request(), url = new URL(request.url());
    if (request.method() === 'POST') {
      const id = url.pathname.split('/')[4];
      if (url.pathname.endsWith('/category/')) {
        categories.set(id, request.postDataJSON().category);
        return route.fulfill({ json: { category: request.postDataJSON().category } });
      }
      request.postDataJSON().archived ? archived.add(id) : archived.delete(id);
      return route.fulfill({ json: { archived: request.postDataJSON().archived } });
    }
    const archive = url.searchParams.get('view') === 'archive';
    const next = url.searchParams.get('cursor');
    let visible = next ? [{ ...items[0], id: 'older', title: 'An older saved story', category: url.searchParams.get('view') === 'archive' ? 'Inbox' : url.searchParams.get('view').replace(/^./, c=>c.toUpperCase()), added: '2026-10-24' }] : items.filter(item => archived.has(item.id) === archive);
    const category = url.searchParams.get('view');
    visible = visible.map(item => ({ ...item, category: categories.get(item.id) || item.category }));
    if (!archive) visible = visible.filter(item => item.category.toLowerCase() === category);
    if (url.searchParams.get("topic")) visible = visible.filter(item => item.topics.includes(url.searchParams.get("topic")));
    return route.fulfill({ json: { items: visible, next_cursor: next ? null : 'synthetic-next', fetched_at: '2026-10-26T07:00:00Z' } });
  });
}

test('inbox, filters, archive/unarchive, both list pagination and safe links', async ({ page }) => {
  await mockFeed(page);
  await page.goto('/apps/news');
  await expect(page.getByRole('heading', { name: 'Link Keeper.' })).toBeVisible();
  await expect(page.locator('.news-story')).toHaveCount(5);
  await page.getByRole('button', { name: 'Science', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(3);
  await page.getByRole('button', { name: 'All topics', exact: true }).click();
  await page.getByRole('button', { name: '✓ Archive', exact: true }).first().click();
  await expect(page.locator('.news-story')).toHaveCount(4);
  await page.getByRole('button', { name: 'Archive', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(1);
  await page.getByRole('button', { name: 'Next →', exact: true }).click();
  await expect(page.getByText('Page 2 · Newest first')).toBeVisible();
  await page.getByRole('button', { name: '← Previous', exact: true }).click();
  await page.getByRole('button', { name: '↩ Restore category', exact: true }).click();
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

 test('change category in the app, empty inspiration and independent archive', async ({ page }) => {
  await mockFeed(page);
  await page.goto('/apps/news');
  await expect(page.locator('.news-story')).toHaveCount(5);
  await page.getByRole('combobox').first().selectOption('Favorite');
  await expect(page.locator('.news-story')).toHaveCount(4);
  await page.getByRole('button', { name: 'Favorite', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(1);
  await page.getByRole('button', { name: '✓ Archive', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(0);
  await page.getByRole('button', { name: 'Archive', exact: true }).click();
  await expect(page.getByRole('combobox')).toHaveValue('Favorite');
  await page.getByRole('combobox').selectOption('Inspiration');
  await expect(page.getByRole('combobox')).toHaveValue('Inspiration');
  await page.getByRole('button', { name: '↩ Restore category', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(0);
  await page.getByRole('button', { name: 'Inspiration', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(1);
  await page.getByRole('button', { name: 'News', exact: true }).click();
  await expect(page.locator('.news-story')).toHaveCount(0);
 });

for (const width of [390, 1440]) test(`full page and local saves without list reload at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  const full = Array.from({length: 20}, (_, i) => ({ ...items[i % 5], id: `id-${i}`, title: `Saved link ${i+1}`, url: `https://example.com/full/${i}`, archived: false }));
  let gets = 0, fail = false;
  const updated = new Map();
  await page.route('**/api/apps/news/**', async route => {
    const req = route.request(), url = new URL(req.url());
    if (req.method() === 'POST') {
      const changes = req.postDataJSON();
      if (fail) return route.fulfill({status:503,json:{error:'Save failed. Try again.'}});
      updated.set(url.pathname.split('/')[4], changes);
      return route.fulfill({json:changes});
    }
    ++gets;
    const category = url.searchParams.get('view');
    const visible = full.map(x => ({...x, ...updated.get(x.id)})).filter(x => category === 'archive' ? x.archived : !x.archived && x.category.toLowerCase() === category);
    return route.fulfill({json:{items:visible, next_cursor: null, fetched_at:'2026-10-28T17:00:00Z'}});
  });
  await page.goto('/apps/news');
  await expect(page.locator('.news-story')).toHaveCount(20);
  await expect(page.locator('.news-count')).toContainText('20 stories');
  await page.screenshot({path:`/downloads/link-keeper-initial-${width}.png`,fullPage:false});
  await page.locator('.news-story').first().scrollIntoViewIfNeeded();
  await page.screenshot({path:`/downloads/link-keeper-cards-${width}.png`,fullPage:false});
  const untouched = await page.locator('.news-story').nth(5).elementHandle();
  await page.getByRole('combobox').first().selectOption('Favorite');
  await expect(page.locator('.news-story')).toHaveCount(19);
  expect(gets).toBe(1);
  expect(await untouched.evaluate(el => el.isConnected)).toBe(true);
  await page.getByRole('button',{name:'✓ Archive',exact:true}).first().click();
  await expect(page.locator('.news-story')).toHaveCount(18);
  expect(gets).toBe(1);
  expect(await untouched.evaluate(el => el.isConnected)).toBe(true);
  await page.getByRole('button',{name:'Favorite',exact:true}).click();
  await expect(page.locator('.news-story')).toHaveCount(1);
  await page.getByRole('button',{name:'Inbox',exact:true}).click();
  await expect(page.locator('.news-story')).toHaveCount(18);
  const before = gets;
  await page.getByRole('button',{name:'Favorite',exact:true}).click();
  await expect(page.locator('.news-story')).toHaveCount(1);
  expect(gets).toBe(before); // session cache, not another Notion read
  fail = true;
  await page.getByRole('button',{name:'✓ Archive',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('Save failed');
  await expect(page.locator('.news-story')).toHaveCount(1);
  fail = false;
  await page.getByRole('button',{name:'Inbox',exact:true}).click();
  await expect(page.locator('.news-story')).toHaveCount(18);
  await page.getByRole('button',{name:'↻ Refresh',exact:true}).click();
  await expect(page.locator('.news-story')).toHaveCount(18);
  expect(gets).toBe(before + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({path:`/downloads/link-keeper-${width}.png`,fullPage:false});
});
