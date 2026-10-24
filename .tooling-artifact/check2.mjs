import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('file:///home/sandbox/repo/ui/src/artifacts/2026-10-23-swiss-watch.html', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 600));
await page.evaluate(() => document.querySelector('[data-tab="bike"]').click());
await page.evaluate(() => document.querySelector('[data-panel="bike"] [data-step="2"]').click());
await new Promise(r => setTimeout(r, 900));
const dim = await page.evaluate(() => {
  const out = {};
  document.querySelectorAll('[data-panel="bike"] .iso-stage .it').forEach((el) => {
    out[el.dataset.part] = getComputedStyle(el).opacity + (el.dataset.on ? '*' : '');
  });
  return out;
});
console.log('chain-step opacities:', JSON.stringify(dim));
// freewheel: pedal phase then coast phase captures
await page.evaluate(() => document.querySelector('[data-panel="bike"] [data-step="4"]').click());
await page.evaluate(() => new Promise((res) => {
  const p = document.querySelector('[data-panel="bike"]');
  const t0 = performance.now();
  const poll = () => {
    if (p.querySelector('[data-readout]').textContent.includes('coasting')) return res();
    if (performance.now() - t0 > 12000) return res();
    setTimeout(poll, 120);
  };
  poll();
}));
await new Promise(r => setTimeout(r, 1000));
const coast = await page.evaluate(() => document.querySelector('[data-panel="bike"] [data-readout]').textContent);
await page.screenshot({ path: '/tmp/bike/d-bike-s4-coast.png' });
console.log('coast readout:', coast);
await page.evaluate(() => new Promise((res) => {
  const p = document.querySelector('[data-panel="bike"]');
  const t0 = performance.now();
  const poll = () => {
    if (p.querySelector('[data-readout]').textContent.includes('pedaling')) return res();
    if (performance.now() - t0 > 12000) return res();
    setTimeout(poll, 120);
  };
  poll();
}));
await new Promise(r => setTimeout(r, 1000));
const ped = await page.evaluate(() => document.querySelector('[data-panel="bike"] [data-readout]').textContent);
await page.screenshot({ path: '/tmp/bike/d-bike-s4-pedal.png' });
console.log('pedal readout:', ped);
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
