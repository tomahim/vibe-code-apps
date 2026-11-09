// Screenshot harness: per model, one contact sheet of all steps + final view.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const FILE = 'file:///home/sandbox/vibe-code-apps/ui/src/artifacts/2026-11-09-valley-fold.html';
const OUT = '/home/sandbox/valley-fold/shots';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu']
});
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
page.on('pageerror', e => console.log('PAGEERROR:', e.message));

const models = process.argv[2] ? process.argv[2].split(',').map(Number) : [0,1,2,3,4,5,6,7,8,9];
const stepsOnly = process.argv[3] ? process.argv[3].split(',').map(Number) : null;

for (const mi of models) {
  await page.goto(`${FILE}?model=${mi}`);
  await page.waitForTimeout(1200);
  const n = await page.evaluate(() => VF.app.state().model != null ? VF.models[VF.app.state().model].steps.length : 0);
  const shots = [];
  const idxs = stepsOnly || Array.from({ length: n + 1 }, (_, i) => i);
  for (const s of idxs) {
    await page.evaluate(k => VF.app.gotoStep(k, 1), s);
    await page.waitForTimeout(150);
    const data = await page.evaluate(() => {
      const c = document.querySelector('#viewport canvas');
      return c.toDataURL('image/png');
    });
    shots.push({ s, buf: Buffer.from(data.split(',')[1], 'base64') });
  }
  // compose a horizontal contact sheet via canvas in-page
  const urls = shots.map(x => 'data:image/png;base64,' + x.buf.toString('base64'));
  const sheet = await page.evaluate(async (urls) => {
    const imgs = await Promise.all(urls.map(u => new Promise(res => {
      const im = new Image(); im.onload = () => res(im); im.src = u;
    })));
    const w = imgs[0].width, h = imgs[0].height, cols = Math.ceil(Math.sqrt(imgs.length * w / h)), rows = Math.ceil(imgs.length / cols);
    const cv = document.createElement('canvas'); cv.width = w * cols; cv.height = h * rows;
    const cx = cv.getContext('2d');
    imgs.forEach((im, i) => cx.drawImage(im, (i % cols) * w, Math.floor(i / cols) * h));
    return cv.toDataURL('image/png');
  }, urls);
  const name = await page.evaluate(mi => VF.models[mi].slug, mi);
  await import('node:fs/promises').then(fs => fs.writeFile(`${OUT}/${String(mi).padStart(2,'0')}-${name}.png`, Buffer.from(sheet.split(',')[1], 'base64')));
  console.log('model', mi, name, 'steps', n, '->', `${OUT}/${String(mi).padStart(2,'0')}-${name}.png`);
}
await browser.close();
