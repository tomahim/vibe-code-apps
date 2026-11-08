import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Fixture produced by python yaml.safe_load (full strings, no line-wrap loss):
// see the fixture generation step in the P4 workflow; regenerate before running.
const FX = JSON.parse(readFileSync('/tmp/p4-fixture.json', 'utf8'));
const SHOTS = '/tmp/p4-screenshots';
mkdirSync(SHOTS, { recursive: true });

const THEME = { id: 'bd957ab9-8aa7-4f8c-970f-c858f4cbec04', title: 'Niveau 4 pour Aurore - Partie 1' };
const PATH = { id: '2ef52955-eba8-4d95-bb54-7eb84cf13061', title: '4 - Prévenir et reconnaître les accidents' };

const lessonsList = FX.lessons.map((l, i) => ({ id: l.id, title: l.title, position: i + 1, description: '', image_url: '', image_alt: '', progress: { completed: false } }));
const li = FX.lesson;
const cards = FX.cards.map(c => ({ ...c, illustration_url: '', completed_at: null }));
const questions = FX.questions.map(q => ({ ...q, options: q.options || [], lesson_title: li.title, completed: false }));

const row = (id, title) => ({ id, title, position: 1, description: '', image_url: '', image_alt: '', introduction_markdown: '' });
const lesson = { ...row(li.id, li.title), position: 15, introduction_markdown: li.introduction_markdown, progress: { cards_completed: 0, checkpoints_correct: 0 } };
const longCard = cards.find(c => /Atteintes neurologiques/.test(c.body_markdown)) || cards[2];

const server = spawn('npm', ['run', 'dev', '--', '--port', '5198'], { stdio: 'ignore', cwd: resolve('.') });
await new Promise(r => setTimeout(r, 6000));
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.route('**/api/learning/**', route => {
  const url = new URL(route.request().url());
  if (url.pathname.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
  if (url.pathname.endsWith('/garden/')) return route.fulfill({ json: { themes: [{ ...row(THEME.id, THEME.title), learning_paths: [{ ...row(PATH.id, PATH.title), progress: { lessons_total: lessonsList.length, lessons_completed: 0 }, lessons: lessonsList }] }], rewards: { drops: 0, carrots: 0 }, recent_lessons: [] } });
  if (url.pathname.endsWith(`/lessons/${li.id}/`)) return route.fulfill({ json: { theme: row(THEME.id, THEME.title), learning_path: row(PATH.id, PATH.title), lesson, cards, questions, next_step: { type: 'card', id: cards[0].id } } });
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

await page.goto(`${base}/theme/${THEME.id}/path/${PATH.id}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${SHOTS}/02-path-lessons.png` });

await page.goto(`${base}/theme/${THEME.id}/path/${PATH.id}/lesson/${li.id}/card/${cards[0].id}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${SHOTS}/03-lesson-card1.png` });

await page.goto(`${base}/theme/${THEME.id}/path/${PATH.id}/lesson/${li.id}/card/${longCard.id}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${SHOTS}/04-long-card.png` });
const readBtn = page.locator('button.grains-primary', { hasText: 'read this card' });
if (await readBtn.count()) { await readBtn.scrollIntoViewIfNeeded(); await page.waitForTimeout(600); }
await page.screenshot({ path: `${SHOTS}/04b-long-card-bottom.png` });

if (questions.length) {
  await page.goto(`${base}/theme/${THEME.id}/path/${PATH.id}/lesson/${li.id}/question/${questions[0].id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${SHOTS}/05-question.png`, fullPage: true });
  const lastOpt = page.locator('text=plupart des cas');
  if (await lastOpt.count()) { await lastOpt.scrollIntoViewIfNeeded(); }
  await page.locator('button.grains-primary', { hasText: 'Check answer' }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOTS}/05b-question-bottom.png` });
  const tq = questions.find(q => q.type.includes('type_answer'));
  if (tq) {
    await page.goto(`${base}/theme/${THEME.id}/path/${PATH.id}/lesson/${li.id}/question/${tq.id}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${SHOTS}/06-question-typed.png`, fullPage: true });
  }
}

await browser.close();
server.kill();
console.log('done', SHOTS);
