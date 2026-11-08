import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PATH_DIR = resolve('../atomic-lessons/themes/plongee-niveau-4-partie-1/p4-prevoir-et-reconnaitre-les-accidents');
const SHOTS = '/tmp/p4-screenshots';
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

// All 10 lessons for the path listing
const lessonDirs = readdirSync(PATH_DIR).filter(d => existsSync(resolve(PATH_DIR, d, 'index.md'))).sort();
const lessonsList = lessonDirs.map((d, i) => {
  const li = front(readFileSync(resolve(PATH_DIR, d, 'index.md'), 'utf8'));
  return { id: li.meta.id, title: li.meta.title, position: i + 1, description: '', image_url: '', image_alt: '', progress: { completed: false } };
});

// Full detail for lesson 10 (the heaviest formatting: normes categories)
const LESSON_DIR = resolve(PATH_DIR, '15-les-signes-des-accidents-de-desaturation');
const li = front(readFileSync(resolve(LESSON_DIR, 'index.md'), 'utf8'));
const cards = readdirSync(resolve(LESSON_DIR, 'cards')).sort().map((f) => {
  const c = front(readFileSync(resolve(LESSON_DIR, 'cards', f), 'utf8'));
  return { id: c.meta.id, position: Number(c.meta.position), title: c.meta.title, body_markdown: c.body, illustration_url: '', completed_at: null };
});
const questions = readdirSync(resolve(LESSON_DIR, 'questions')).sort().map((f) => {
  const raw = readFileSync(resolve(LESSON_DIR, 'questions', f), 'utf8');
  const qid = (raw.match(/^id:\s*(.+)$/m) || ['', 'q'])[1];
  const acp = (raw.match(/^after_card_position:\s*(\d+)/m) || ['', '1'])[1];
  const type = (raw.match(/^type:\s*(.+)$/m) || ['', 'multiple_choice'])[1];
  const prompt = (raw.match(/^prompt:\s*(.+)$/m) || ['', ''])[1];
  const opts = [];
  let cur = null;
  for (const line of raw.split('\n')) {
    const idm = line.match(/^\s*- id:\s*(.+)$/);
    const tm = line.match(/^\s*text:\s*(.+)$/);
    if (idm) { cur = { id: idm[1].trim(), text: '' }; opts.push(cur); }
    else if (tm && cur && !cur.text) cur.text = tm[1].trim().replace(/^'(.*)'$/, '$1');
  }
  return { id: qid.trim(), after_card_position: Number(acp), type: type.trim(), prompt: prompt.trim(), options: opts, lesson_title: li.meta.title, completed: false };
});

const row = (id, title) => ({ id, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
const lesson = { ...row(li.meta.id, li.meta.title), position: 15, progress: { cards_completed: 0, checkpoints_correct: 0 } };
const longCard = cards.find(c => /Atteintes neurologiques/.test(c.body_markdown)) || cards[2];

const server = spawn('npm', ['run', 'dev', '--', '--port', '5198'], { stdio: 'ignore', cwd: resolve('.') });
await new Promise(r => setTimeout(r, 6000));
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.route('**/api/learning/**', route => {
  const url = new URL(route.request().url());
  if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
  if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: { themes: [{ ...row('bd957ab9-8aa7-4f8c-970f-c858f4cbec04', 'Niveau 4 pour Aurore - Partie 1'), learning_paths: [{ ...row('2ef52955-eba8-4d95-bb54-7eb84cf13061', '4 - Prévenir et reconnaître les accidents'), progress: { lessons_total: lessonsList.length, lessons_completed: 0 }, lessons: lessonsList }] }], rewards: { drops: 0, carrots: 0 }, recent_lessons: [] } });
  if (url.pathname.endsWith(`/lessons/${li.meta.id}/`)) return route.fulfill({ json: { theme: row('bd957ab9-8aa7-4f8c-970f-c858f4cbec04', 'Niveau 4 pour Aurore - Partie 1'), learning_path: row('2ef52955-eba8-4d95-bb54-7eb84cf13061', '4 - Prévenir et reconnaître les accidents'), lesson, cards, questions, next_step: { type: 'card', id: cards[0].id } } });
  if (url.pathname.includes('/complete/') || url.pathname.endsWith('/question-attempts/') || url.pathname.endsWith('/open/')) return route.fulfill({ status: 201, json: { correct: true, carrot_earned: false, attempt_type: 'initial', explanation: '', next_step: null } });
  if (url.pathname.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], earned_count: 0, new_count: 0 } });
  if (url.pathname.endsWith('/leaderboard/')) return route.fulfill({ json: { rows: [], self: null, has_earlier: false } });
  return route.fulfill({ json: {} });
});
await page.addInitScript(() => localStorage.setItem('genious_token', 'visual-fixture-only'));

const base = 'http://127.0.0.1:5198/apps/little-grains';
await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${SHOTS}/01-garden.png` });

// Path page: lesson list
await page.goto(`${base}/theme/bd957ab9-8aa7-4f8c-970f-c858f4cbec04/path/2ef52955-eba8-4d95-bb54-7eb84cf13061/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${SHOTS}/02-path-lessons.png` });

// Lesson reader, first card
await page.goto(`${base}/theme/bd957ab9-8aa7-4f8c-970f-c858f4cbec04/path/2ef52955-eba8-4d95-bb54-7eb84cf13061/lesson/${li.meta.id}/card/${cards[0].id}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${SHOTS}/03-lesson-card1.png` });

// Long card (normes categories): top, then scrolled to bottom to prove controls reachable
await page.goto(`${base}/theme/bd957ab9-8aa7-4f8c-970f-c858f4cbec04/path/2ef52955-eba8-4d95-bb54-7eb84cf13061/lesson/${li.meta.id}/card/${longCard.id}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${SHOTS}/04-long-card.png` });
const readBtn = page.locator('button.grains-primary', { hasText: 'read this card' });
if (await readBtn.count()) { await readBtn.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); }
await page.screenshot({ path: `${SHOTS}/04b-long-card-bottom.png` });

// A quiz question
if (questions.length) {
  await page.goto(`${base}/theme/bd957ab9-8aa7-4f8c-970f-c858f4cbec04/path/2ef52955-eba8-4d95-bb54-7eb84cf13061/lesson/${li.meta.id}/question/${questions[0].id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${SHOTS}/05-question.png` });
  const tq = questions.find(q => q.type.includes('type_answer'));
  if (tq) {
    await page.goto(`${base}/theme/bd957ab9-8aa7-4f8c-970f-c858f4cbec04/path/2ef52955-eba8-4d95-bb54-7eb84cf13061/lesson/${li.meta.id}/question/${tq.id}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${SHOTS}/06-question-typed.png` });
  }
}

await browser.close();
server.kill();
console.log('done', SHOTS);
