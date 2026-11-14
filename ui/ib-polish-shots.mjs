// Visual-polish screenshots for the instrument browser: mobile + desktop,
// including the signed-in import form. Run with django on :8000 and:
//   xvfb-run -a node ib-polish-shots.mjs
import { firefox } from '@playwright/test';
import { spawn } from 'node:child_process';

const server = spawn('npm', ['run', 'dev', '--', '--port', '5199'], { stdio: 'ignore' });
const browser = await firefox.launch({ headless: false });

async function openBrowserPage(width, height) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  for (let i = 0; i < 40; i += 1) {
    try { await page.goto('http://localhost:5199/apps/music-library/sounds'); break; }
    catch { await new Promise((r) => setTimeout(r, 250)); }
  }
  await page.waitForSelector('.ib-card', { timeout: 15000 });
  await page.evaluate(async () => {
    const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'thomas', password: 'checkpass1' }) });
    const data = await r.json();
    if (!data.token) throw new Error('login failed');
    localStorage.setItem('genious_token', data.token);
    localStorage.setItem('genious_user', JSON.stringify(data.user));
  });
  await page.reload();
  await page.waitForSelector('.ib-card', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));
  return page;
}

// Mobile: page top with search + type filter.
const mobile = await openBrowserPage(390, 844);
await mobile.screenshot({ path: '/tmp/ib-polish-mobile.png' });

// Mobile: import form (scrolled into view).
await mobile.locator('.ib-add').scrollIntoViewIfNeeded();
await new Promise((r) => setTimeout(r, 400));
await mobile.screenshot({ path: '/tmp/ib-polish-import.png' });

// Mobile: search active state.
await mobile.locator('input.ml-search').first().fill('tb303');
await new Promise((r) => setTimeout(r, 400));
await mobile.locator('.ib-card').first().scrollIntoViewIfNeeded();
await mobile.screenshot({ path: '/tmp/ib-polish-search.png' });

// Desktop: page top.
const desktop = await openBrowserPage(1280, 900);
await desktop.screenshot({ path: '/tmp/ib-polish-desktop.png' });

await browser.close();
server.kill();
console.log('shots saved');
