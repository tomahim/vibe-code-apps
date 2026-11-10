import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
const server = spawn('npm', ['run', 'dev', '--', '--port', '5199'], { stdio: 'ignore' });
await new Promise((resolve) => setTimeout(resolve, 4000));
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const out = process.env.SHOTS || '/tmp/artifacts-favorites';
try {
  // Desktop: two starred, toggle shows count, then favorites view.
  let page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://127.0.0.1:5199/artifacts');
  await page.locator('.artifact-list > li').first().waitFor();
  await page.locator('.artifact-list > li').nth(0).locator('.artifact-fav').click();
  await page.locator('.artifact-list > li').nth(2).locator('.artifact-fav').click();
  await page.screenshot({ path: `${out}-desktop-starred.png`, fullPage: false });
  await page.getByRole('button', { name: /Favorites/ }).click();
  await page.screenshot({ path: `${out}-desktop-favview.png`, fullPage: true });
  await page.close();
  // Mobile 390x844: same states.
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:5199/artifacts');
  await page.locator('.artifact-list > li').first().waitFor();
  await page.locator('.artifact-list > li').nth(0).locator('.artifact-fav').click();
  await page.locator('.artifact-list > li').nth(2).locator('.artifact-fav').click();
  await page.screenshot({ path: `${out}-mobile-starred.png`, fullPage: false });
  await page.getByRole('button', { name: /Favorites/ }).click();
  await page.screenshot({ path: `${out}-mobile-favview.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  console.log('mobile fits viewport:', overflow);
  await page.close();
} finally {
  await browser.close();
  server.kill();
}
console.log('done');
