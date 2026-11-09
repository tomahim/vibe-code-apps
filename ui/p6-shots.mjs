import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
const BASE = resolve('../atomic-lessons/themes/plongee-niveau-4-partie-1');
const SHOTS = '/tmp/p6-shots'; mkdirSync(SHOTS, { recursive: true });
const front = (s) => { const m = s.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); const meta = {};
  for (const line of m[1].split('\n')) { const kv = line.match(/^(\w+):\s*(.*)$/); if (kv) meta[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, ''); }
  return { meta, body: m[2].trim() }; };
const WANT = [
  ['p6-gerer-la-desaturation-d-une-palanquee','01-mesures-et-calculs-de-l-ordinateur','07'],
  ['p6-gerer-la-desaturation-d-une-palanquee','02-lecture-des-ecrans','01'],
  ['p6-gerer-la-desaturation-d-une-palanquee','04-reglages-avant-immersion','06'],
  ['p6-gerer-la-desaturation-d-une-palanquee','05-gf-et-recommandations-federales','05'],
  ['p6-gerer-la-desaturation-d-une-palanquee','08-historiques-differents','07'],
  ['p6-gerer-la-desaturation-d-une-palanquee','09-decision-de-remontee','05'],
  ['p6-gerer-la-desaturation-d-une-palanquee','12-reprise-et-plongees-repetees','06'],
];
const targets = [];
for (const [p, ld, prefix] of WANT) {
  const cdir = join(BASE, p, ld, 'cards');
  const li = front(readFileSync(join(BASE, p, ld, 'index.md'), 'utf8'));
  const all = readdirSync(cdir).filter(f => f.endsWith('.md')).sort();
  const cards = all.map(f => {
    const c = front(readFileSync(join(cdir, f), 'utf8'));
    return { id: c.meta.id, position: Number(c.meta.position), title: c.meta.title, body_markdown: c.body,
      illustration_path: c.meta.image ? `atomic-lessons/themes/plongee-niveau-4-partie-1/${p}/${ld}/cards/${c.meta.image}` : '',
      illustration_url: c.meta.image ? `/illu/${p}/${ld}/cards/${c.meta.image}` : '',
      illustration_srcset: c.meta.image ? [{ url: `/illu/${p}/${ld}/cards/${c.meta.image}?w=640`, width: 640 }, { url: `/illu/${p}/${ld}/cards/${c.meta.image}?w=1280`, width: 1280 }] : [],
      illustration_alt: c.meta.image_alt || '', illustration_caption: c.meta.image_caption || '',
      illustration_credit: c.meta.image_credit || '', illustration_license: c.meta.image_license || '', completed_at: null };
  });
  const target = cards.find(c => String(c.position).padStart(2,'0') === prefix);
  targets.push({ p, ld, lessonId: li.meta.id, lessonTitle: li.meta.title, cards, target });
}
const server = spawn('npm', ['run', 'dev', '--', '--port', '5198'], { stdio: 'ignore', cwd: resolve('.') });
await new Promise(r => setTimeout(r, 6000));
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 2400 } });
await page.route('**/api/learning/**', route => {
  const url = new URL(route.request().url());
  if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
  if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: { themes: [], rewards: { drops: 0, carrots: 0 }, recent_lessons: [] } });
  const lm = url.pathname.match(/\/lessons\/([\w-]+)\/$/);
  if (lm) { const t = targets.find(t => t.lessonId === lm[1]);
    if (t) return route.fulfill({ json: {
      theme: { id: 'th', title: 'N4', position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' },
      learning_path: { id: 'lp', title: t.p, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' },
      lesson: { id: t.lessonId, title: t.lessonTitle, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '', progress: { cards_completed: 0, checkpoints_correct: 0 } },
      cards: t.cards, questions: [], next_step: { type: 'card', id: t.target.id } } }); }
  if (url.pathname.includes('/complete/') || url.pathname.endsWith('/open/')) return route.fulfill({ status: 201, json: {} });
  return route.fulfill({ json: {} });
});
await page.route('**/illu/**', route => {
  const rel = decodeURIComponent(new URL(route.request().url()).pathname.replace('/illu/',''));
  try { return route.fulfill({ body: readFileSync(join(BASE, rel)), contentType: 'image/jpeg' }); }
  catch { return route.fulfill({ status: 404, body: 'nf' }); }
});
await page.addInitScript(() => localStorage.setItem('genious_token', 'visual-fixture-only'));
const base = 'http://127.0.0.1:5198/apps/little-grains/theme/th/path/lp/lesson';
for (const t of targets) {
  await page.goto(`${base}/${t.lessonId}/card/${t.target.id}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => { const i = document.querySelector('.grains-illustration img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 8000 }).catch(() => console.log('IMG NOT LOADED', t.ld));
  await page.waitForTimeout(500);
  if (false) {
    const [popup] = await Promise.all([
      page.context().waitForEvent('page', { timeout: 8000 }),
      page.click('.grains-illustration-open'),
    ]);
    await popup.waitForLoadState('load');
    const popupUrl = popup.url();
    const popupImg = await popup.evaluate(() => { const i = document.querySelector('img'); return i ? { w: i.naturalWidth, h: i.naturalHeight, complete: i.complete } : null; }).catch(() => null);
    await popup.screenshot({ path: join(SHOTS, 'newtab-fullsize.png') });
    console.log('NEWTAB', popupUrl, JSON.stringify(popupImg));
    await popup.close();
    const still = await page.evaluate(() => ({ url: location.href, idx: (document.querySelector('.grains-card-index') || {}).textContent, btn: !!(document.querySelector('.grains-primary') && !document.querySelector('.grains-primary').disabled) }));
    console.log('RETURN-STATE', JSON.stringify(still));
  }
  const name = `${t.p.slice(0,2)}-${t.ld}-card${String(t.target.position).padStart(2,'0')}-full.png`;
  await page.screenshot({ path: join(SHOTS, name) });
  const fit = await page.$eval('.grains-illustration img', i => getComputedStyle(i).objectFit).catch(() => null);
  console.log('OBJECT-FIT', fit);
  const link = await page.$eval('.grains-illustration-open', a => ({ href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel'), text: a.textContent })).catch(() => null);
  console.log('OPEN-LINK', JSON.stringify(link));
  console.log(name);
}
await browser.close(); server.kill(); console.log('done');
