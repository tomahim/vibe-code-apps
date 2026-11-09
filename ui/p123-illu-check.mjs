import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const BASE = resolve('../atomic-lessons/themes/plongee-niveau-4-partie-1');
const SHOTS = '/tmp/p123-illu-shots';
mkdirSync(SHOTS, { recursive: true });

const front = (s) => {
  const m = s.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: s };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^'(.*)'$/, '$1').replace(/^"(.*)"$/, '$1');
  }
  return { meta, body: m[2].trim() };
};

// collect all cards with image: across the three paths
const targets = [];
for (const p of ['p1-prendre-sa-place-de-guide','p2-utiliser-la-physique-en-plongee','p3-comprendre-le-corps-immerge']) {
  for (const ld of readdirSync(join(BASE, p)).sort()) {
    const cdir = join(BASE, p, ld, 'cards');
    if (!existsSync(cdir)) continue;
    const li = front(readFileSync(join(BASE, p, ld, 'index.md'), 'utf8'));
    const cards = [];
    for (const f of readdirSync(cdir).sort()) {
      if (!f.endsWith('.md')) continue;
      const c = front(readFileSync(join(cdir, f), 'utf8'));
      if (!c.meta.image) continue;
      cards.push({ id: c.meta.id, position: Number(c.meta.position), title: c.meta.title, body_markdown: c.body,
        illustration_url: `/illu/${p}/${ld}/cards/${c.meta.image}`, illustration_alt: c.meta.image_alt || '',
        illustration_caption: c.meta.image_caption || '', illustration_credit: c.meta.image_credit || '',
        illustration_license: c.meta.image_license || '', completed_at: null, _img: join(cdir, c.meta.image) });
    }
    if (cards.length) targets.push({ p, ld, lessonId: li.meta.id, lessonTitle: li.meta.title, cards });
  }
}
console.log('lessons with illustrations:', targets.length, 'cards:', targets.reduce((a,t)=>a+t.cards.length,0));

const server = spawn('npm', ['run', 'dev', '--', '--port', '5199'], { stdio: 'ignore', cwd: resolve('.') });
await new Promise(r => setTimeout(r, 6000));
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.route('**/api/learning/**', route => {
  const url = new URL(route.request().url());
  if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
  if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: { themes: [], rewards: { drops: 0, carrots: 0 }, recent_lessons: [] } });
  const lm = url.pathname.match(/\/lessons\/([\w-]+)\/$/);
  if (lm) {
    const t = targets.find(t => t.lessonId === lm[1]);
    if (t) return route.fulfill({ json: {
      theme: { id: 'th', title: 'N4', position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' },
      learning_path: { id: 'lp', title: t.p, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' },
      lesson: { id: t.lessonId, title: t.lessonTitle, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '', progress: { cards_completed: 0, checkpoints_correct: 0 } },
      cards: t.cards.map(({_img, ...c}) => c), questions: [], next_step: { type: 'card', id: t.cards[0].id } } });
  }
  if (url.pathname.includes('/complete/') || url.pathname.endsWith('/question-attempts/') || url.pathname.endsWith('/open/')) return route.fulfill({ status: 201, json: { correct: true, carrot_earned: false, attempt_type: 'initial', explanation: '', next_step: null } });
  if (url.pathname.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], earned_count: 0, new_count: 0 } });
  if (url.pathname.endsWith('/leaderboard/')) return route.fulfill({ json: { rows: [], self: null, has_earlier: false } });
  return route.fulfill({ json: {} });
});
page.on('response', r => { if (r.url().includes('/illu/')) console.log('ILLURESP', r.status(), r.url().slice(-50)); });
await page.route('**/illu/**', route => {
  const rel = decodeURIComponent(new URL(route.request().url()).pathname.replace('/illu/',''));
  const fp = join(BASE, rel);
  try { return route.fulfill({ body: readFileSync(fp), contentType: 'image/jpeg' }); }
  catch { return route.fulfill({ status: 404, body: 'nf' }); }
});
await page.addInitScript(() => localStorage.setItem('genious_token', 'visual-fixture-only'));

const base = 'http://127.0.0.1:5199/apps/little-grains/theme/th/path/lp/lesson';
for (const t of targets) {
  for (const c of t.cards) {
    const name = `${t.p.slice(0,2)}-${t.ld}-${String(c.position).padStart(2,'0')}.png`;
    await page.goto(`${base}/${t.lessonId}/card/${c.id}`, { waitUntil: 'networkidle' });
    const ok = await page.waitForFunction(() => { const i = document.querySelector('.grains-illustration img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 8000 }).then(() => true).catch(() => false);
    if (!ok) console.log('IMG NOT LOADED', name);
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, name), fullPage: true });
    console.log(name);
  }
}
await browser.close();
server.kill();
console.log('done', SHOTS);
