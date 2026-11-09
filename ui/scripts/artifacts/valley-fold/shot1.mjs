import { chromium } from 'playwright';
const FILE = 'file:///home/sandbox/vibe-code-apps/ui/src/artifacts/2026-11-09-valley-fold.html';
const [mi, steps] = [Number(process.argv[2]), process.argv[3].split(',').map(Number)];
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu'] });
const page = await browser.newPage({ viewport: { width: 700, height: 700 } });
await page.goto(`${FILE}?model=${mi}&top=1`);
await page.waitForTimeout(1200);
const imgs = [];
for (const s of steps) {
  await page.evaluate(k => VF.app.gotoStep(k, 1), s);
  await page.waitForTimeout(200);
  const d = await page.evaluate(() => document.querySelector('#viewport canvas').toDataURL('image/png'));
  imgs.push(Buffer.from(d.split(',')[1], 'base64'));
}
import('node:fs/promises').then(async fs => {
  for (let i = 0; i < imgs.length; i++) await fs.writeFile(`/tmp/hstep${steps[i]}.png`, imgs[i]);
});
await browser.close();
