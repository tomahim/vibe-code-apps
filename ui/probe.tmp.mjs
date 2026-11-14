import { firefox } from '@playwright/test';
import { spawn } from 'node:child_process';
const server = spawn('npx', ['vite', '--port', '5199'], { cwd: process.cwd(), stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 4000));
const browser = await firefox.launch({ headless: true });
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('PAGE ERR:', m.text().slice(0, 200)); });
await page.goto('http://localhost:5199/apps/music-library');
await page.waitForSelector('.ml-track', { timeout: 15000 });
await page.waitForTimeout(1500);
const state1 = await page.evaluate(() => ({
  buttons: [...document.querySelectorAll('.ml-track')].map((b) => b.textContent.slice(0, 20)),
  playDisabled: [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Play'))?.disabled,
  editorLen: document.querySelector('.ml-editor')?.textContent?.length ?? -1,
}));
console.log('state1:', JSON.stringify(state1));
await page.getByRole('button', { name: /Play/ }).click();
for (let i = 0; i < 60; i += 1) {
  if (await page.evaluate(() => Boolean(window.__musicEngine?.ready))) break;
  await page.waitForTimeout(250);
}
await page.waitForTimeout(4000);
const probe = await page.evaluate(() => {
  const t = window.__musicEngine.supersonic.getRawTree();
  return { synths: t.nodes.filter((n) => !n.isGroup).map((n) => n.defName),
    error: document.querySelector('.ml-error')?.textContent ?? null,
    stopVisible: [...document.querySelectorAll('button')].some((b) => b.textContent.includes('Stop')) };
});
console.log('probe:', JSON.stringify(probe));
await browser.close();
server.kill();
process.exit(0);
