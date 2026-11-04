// Local visual/interaction check with synthetic data. No production writes.
import { chromium, firefox } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5198'], { stdio: 'ignore' });
const dir = process.env.ADMIN_SCREENSHOTS || '/tmp/little-notes-admin-screenshots';
fs.mkdirSync(dir, { recursive: true });
const initial = () => ({
 can_manage_taxonomy: true,
 types: [['idea', 'Ideas'], ['bookmark', 'Bookmarks'], ['news', 'News'], ['daily-note', 'Daily notes']].map(([slug, name]) => ({ slug, name })),
 categories: [['inbox', 'Inbox', []], ['archive', 'Archive', []], ['favorite', 'Favorite', []], ['promising', 'Promising', ['idea']], ['to-improve', 'To improve', ['idea']], ['inspiration', 'Inspiration', ['bookmark']]].map(([slug, name, types], i) => ({ slug, name, types, is_system: i < 3 })),
 tags: [{ slug: 'cartography', name: 'Cartography', is_system: false }], months: [],
});
let browser;
try {
 for (const engine of ['firefox', 'chromium']) {
  browser = await (engine === 'firefox' ? firefox.launch() : chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }));
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  let taxonomy = initial(), failNext = false; const posts = [];
  await page.addInitScript(() => localStorage.setItem('genious_token', 'synthetic-test-token'));
  await page.route('**/api/apps/little-notes/**', async route => {
   const url = new URL(route.request().url());
   if (route.request().method() === 'POST' && url.pathname.includes('/taxonomy/')) {
    const kind = url.pathname.split('/').at(-2); const payload = route.request().postDataJSON(); posts.push({ kind, payload });
    if (failNext) { failNext = false; return route.fulfill({ status: 409, json: { error: 'This key already exists. Choose another key.' } }); }
    taxonomy[kind].push({ ...payload, types: payload.types || [], is_system: false });
    return route.fulfill({ status: 201, json: payload });
   }
   if (url.pathname.endsWith('/taxonomy/')) return route.fulfill({ json: taxonomy });
   return route.fulfill({ json: { items: [], total: 0, page: 1, next_page: null } });
  });
  for (let i = 0; i < 40; i++) { try { await page.goto('http://localhost:5198/apps/little-notes'); break; } catch { await new Promise(r => setTimeout(r, 200)); } }
  await page.getByRole('button', { name: '☰ Types', exact: true }).click();
  await page.getByRole('button', { name: 'Manage', exact: false }).click();
  await page.getByLabel('Name', { exact: true }).fill('Weekend projects');
  await page.getByRole('radio', { name: 'Specific object types' }).check();
  await page.getByRole('button', { name: 'Create category', exact: false }).click();
  await page.getByRole('alert').filter({ hasText: 'Choose at least one' }).waitFor();
  await page.getByRole('checkbox', { name: 'Ideas', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Bookmarks', exact: true }).check();
  for (const width of [390, 320, 1280]) {
   await page.setViewportSize({ width, height: 960 });
   await page.screenshot({ path: `${dir}/${engine}-category-${width}.png`, fullPage: true });
   if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Overflow ${engine} ${width}`);
  }
  await page.getByRole('button', { name: 'Create category', exact: false }).click();
  await page.getByRole('status').filter({ hasText: 'Weekend projects created' }).waitFor();
  if (posts.at(-1).payload.types.join(',') !== 'idea,bookmark') throw new Error('Multiple type scope lost');
  await page.getByRole('button', { name: /^Tags/ }).click();
  await page.getByLabel('Name', { exact: true }).fill('Géospatial');
  failNext = true;
  await page.getByRole('button', { name: 'Create tag', exact: false }).click();
  await page.getByRole('alert').filter({ hasText: 'already exists' }).waitFor();
  if (await page.getByLabel('Name', { exact: true }).inputValue() !== 'Géospatial') throw new Error('Draft lost on error');
  await page.getByRole('button', { name: 'Create tag', exact: false }).click();
  await page.getByRole('status').filter({ hasText: 'Géospatial created' }).waitFor();
  if (posts.at(-1).payload.slug !== 'geospatial') throw new Error('Accent key generation');
  await page.getByRole('button', { name: /^Object types/ }).click();
  await page.getByLabel('Name', { exact: true }).fill('Research notes');
  await page.getByLabel('Description').fill('Sources, reading notes and discoveries.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${dir}/${engine}-types-390.png`, fullPage: true });
  await page.getByRole('button', { name: 'Create object type', exact: false }).click();
  await page.getByRole('status').filter({ hasText: 'Research notes created' }).waitFor();
  await page.getByRole('button', { name: '← Collection' }).click();
  await page.getByRole('button', { name: '+ Capture' }).click();
  await page.locator(".ln-modal select").selectOption('research-notes');
  await page.keyboard.press('Escape');
  taxonomy.can_manage_taxonomy = false; await page.reload();
  await page.getByRole('heading', { name: 'A little breathing room.' }).waitFor();
  if (await page.getByRole('button', { name: 'Manage', exact: false }).count()) throw new Error('Manage shown to non-staff');
  if (errors.length) throw new Error(errors.join('\n'));
  await browser.close(); browser = null;
  console.log(`${engine}: PASS 320/390/1280 no overflow; create category/tag/type; multiple scopes; draft retained after 409; accent key; new type in capture; staff gating`);
 }
} finally { if (browser) await browser.close(); server.kill('SIGTERM'); await new Promise(resolve => server.once('exit', resolve)); }
