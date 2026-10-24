import puppeteer from 'puppeteer-core';
// usage: node shot-steps.mjs <url> <prefix> <tab:watch|bike> <w> <h> [steps comma] [waitms]
const [,, url, prefix, tab, w = '1440', h = '1100', steps = '0,1,2,3,4,5,6', waitms = '1200'] = process.argv;
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate((t) => {
  document.querySelector(`[data-tab="${t}"]`).click();
}, tab);
await new Promise(r => setTimeout(r, 400));
for (const s of steps.split(',')) {
  await page.evaluate((sel, i) => {
    document.querySelector(`${sel} [data-step="${i}"]`).click();
  }, tab === 'watch' ? '[data-panel="watch"]' : '[data-panel="bike"]', s);
  await new Promise(r => setTimeout(r, +waitms));
  await page.screenshot({ path: `${prefix}-s${s}.png` });
  const state = await page.evaluate((sel) => {
    const p = document.querySelector(sel);
    return { readout: p.querySelector('[data-readout]')?.textContent, hidden: p.hidden, scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth };
  }, tab === 'watch' ? '[data-panel="watch"]' : '[data-panel="bike"]');
  console.log(`step ${s}:`, JSON.stringify(state));
}
console.log('page errors:', errors.length ? errors : 'none');
await browser.close();
