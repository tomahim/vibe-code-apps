// Visual check for Knob Conservatory: lessons and workshop at mobile widths.
// Run with: node knob-conservatory-visual-check.mjs
// Screenshots land in KC_SCREENSHOTS or /tmp/knob-conservatory-screenshots.
import { chromium, firefox } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const server = spawn('npm', ['run', 'dev', '--', '--port', '5198'], { stdio: 'ignore' });
// Firefox is the default because Thomas reviews the apps in Firefox on his
// phone. Headless Firefox cannot run an AudioContext, so the interactive
// ear-match pass runs with KC_BROWSER_ENGINE=chromium.
const engine = process.env.KC_BROWSER_ENGINE || 'firefox';
const browser = engine === 'chromium'
  ? await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
  : await firefox.launch({ headless: true });
const page = await browser.newPage();
const screenshots = process.env.KC_SCREENSHOTS || '/tmp/knob-conservatory-screenshots';

// Signed-in fixture with two saved instruments on the shelf.
const PRESETS = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Velvet bass', settings: { cutoff: 800 }, created_at: '2026-11-07T10:00:00Z', updated_at: '2026-11-07T10:00:00Z' },
  { id: '22222222-2222-4222-8222-222222222222', name: 'Fog pad', settings: { attack: 0.9 }, created_at: '2026-11-07T10:05:00Z', updated_at: '2026-11-07T10:05:00Z' },
];
await page.addInitScript(() => localStorage.setItem('genious_token', 'visual-fixture-only'));
await page.route('**/api/apps/knob-conservatory/**', async (route) => {
  const url = new URL(route.request().url());
  if (url.pathname.endsWith('/presets') && route.request().method() === 'GET') {
    await route.fulfill({ json: { presets: PRESETS } });
  } else if (url.pathname.endsWith('/presets') && route.request().method() === 'POST') {
    await route.fulfill({ status: 201, json: { ...PRESETS[0], id: '33333333-3333-4333-8333-333333333333', name: 'New instrument' } });
  } else {
    await route.fulfill({ status: 204, json: {} });
  }
});

for (let i = 0; i < 30; i += 1) {
  try { await page.goto('http://localhost:5198/apps/knob-conservatory'); break; }
  catch { await new Promise((resolve) => setTimeout(resolve, 200)); }
}
await page.getByRole('heading', { name: 'Knob Conservatory' }).waitFor();

fs.mkdirSync(screenshots, { recursive: true });
for (const width of [390, 1280]) {
  await page.setViewportSize({ width, height: 900 });
  await page.screenshot({ path: `${screenshots}/lessons-${width}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) throw new Error(`Horizontal overflow at ${width}px`);
}

// Viewport-framed shots (the pinned keyboard sits at the bottom, nothing hidden).
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: `${screenshots}/viewport-lessons-390.png` });
await page.locator('.kc-section', { hasText: 'Performance' }).scrollIntoViewIfNeeded();
await page.waitForTimeout(500); // let the scrolled content paint before capturing
await page.screenshot({ path: `${screenshots}/viewport-panel-390.png`, animations: 'disabled' });
await page.evaluate(() => window.scrollTo(0, 0));

// Workshop with the full live panel and the saved-instrument shelf.
await page.setViewportSize({ width: 390, height: 900 });
await page.getByRole('button', { name: 'Workshop' }).click();
await page.getByText('Velvet bass').waitFor();
await page.screenshot({ path: `${screenshots}/workshop-390.png`, fullPage: true });
await page.screenshot({ path: `${screenshots}/viewport-workshop-390.png` });

// Interactive ear-match: power on, fail a blind check, drag the cutoff knob
// to the hidden target (4500 Hz ≈ +83px of vertical drag), pass the lesson.
await page.getByRole('button', { name: 'Lessons' }).click();
if (engine !== 'chromium') {
  await page.getByText('Lesson path').click();
  await page.screenshot({ path: `${screenshots}/path-390.png`, fullPage: true });
  await browser.close();
  server.kill();
  console.log(`screenshots in ${screenshots} (static pass; rerun with KC_BROWSER_ENGINE=chromium for the interactive pass)`);
  process.exit(0);
}
await page.getByRole('button', { name: 'Power' }).click();
await page.getByRole('button', { name: 'On', exact: true }).waitFor();
await page.getByRole('button', { name: 'Check my ear' }).click();
await page.getByText(/Not yet/).waitFor();
const knob = page.getByRole('slider', { name: 'Cutoff' });
await knob.scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, -140)); // clear the pinned keyboard
const box = await knob.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 83, { steps: 10 });
await page.mouse.up();
await page.getByRole('button', { name: 'Check my ear' }).click();
await page.getByText(/Passed - your ear matched the target/).waitFor();
await page.screenshot({ path: `${screenshots}/passed-390.png` });

// Lesson path open, first lesson stamped.
await page.getByText('Lesson path').click();
await page.screenshot({ path: `${screenshots}/path-390.png`, fullPage: true });

await browser.close();
server.kill();
console.log(`screenshots in ${screenshots}`);
