import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('public');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png'};
const server = createServer(async (req,res)=>{ try{ const f = path.join(root, decodeURIComponent(new URL(req.url,'http://l').pathname)); await stat(f); res.setHeader('Content-Type', types[path.extname(f)]||'application/octet-stream'); res.end(await readFile(f)); }catch{ res.writeHead(404); res.end(); }});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless:true, executablePath: process.env.CHROME || '/usr/bin/google-chrome', args:['--no-sandbox']});
const out = process.env.OUT || '/downloads';
async function shot(name, width, height, fn) {
  const page = await (await browser.newContext({viewport:{width,height}, hasTouch:true})).newPage();
  const errors = []; page.on('pageerror', e=>errors.push(e.message));
  await page.goto(origin + '/artifact-assets/2026-11-15-island-garden/index.html');
  await page.waitForFunction(() => window.islandGardenState?.().ready, null, {timeout: 15000});
  if (fn) await fn(page);
  await page.waitForTimeout(700);
  await page.screenshot({path: `${out}/island-${name}.png`});
  const st = await page.evaluate(() => window.islandGardenState());
  console.log(name, JSON.stringify({...st, viewport: undefined}), errors.length ? 'ERRORS: '+errors.join(' | ') : 'no-errors');
  await page.context().close();
}
await shot('desktop-overview', 1440, 1000);
await shot('desktop-interior', 1440, 1000, async p => { await p.getByRole('button', {name: 'Enter Ocean'}).click(); await p.waitForFunction(() => window.islandGardenState().theme === 'ocean' && window.islandGardenState().ready); });
await shot('phone-portrait-overview', 390, 844);
await shot('phone-portrait-interior', 390, 844, async p => { await p.getByRole('button', {name: 'Enter Nature'}).click(); await p.waitForFunction(() => window.islandGardenState().theme === 'nature' && window.islandGardenState().ready); });
await shot('phone-landscape-overview', 844, 390);
// Orientation flip on the same page: portrait interior -> landscape keeps theme + growth state.
{
  const page = await (await browser.newContext({viewport:{width:390,height:844}, hasTouch:true})).newPage();
  await page.goto(origin + '/artifact-assets/2026-11-15-island-garden/index.html');
  await page.waitForFunction(() => window.islandGardenState?.().ready, null, {timeout: 15000});
  await page.getByRole('button', {name: 'Enter Nature'}).click();
  await page.waitForFunction(() => window.islandGardenState().theme === 'nature' && window.islandGardenState().ready);
  await page.evaluate(() => { document.getElementById('growth').value = '6'; document.getElementById('growth').dispatchEvent(new Event('input')); });
  await page.setViewportSize({width: 844, height: 390});
  await page.waitForTimeout(600);
  const st = await page.evaluate(() => window.islandGardenState());
  console.log('flip', JSON.stringify({theme: st.theme, state: st.state, orientation: st.orientation, slot: st.slot, interim: st.interim}));
  await page.screenshot({path: `${out}/island-flip-landscape.png`});
  await page.context().close();
}
await browser.close(); server.close();
