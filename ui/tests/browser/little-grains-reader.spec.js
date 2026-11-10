import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Real lesson text and photo, served through a local API fixture. No live
// account or progress data is used or changed by these layout checks.
const source = resolve('..', 'atomic-lessons/themes/life-and-society/baby-first-year-science/02-motor-cascade');
function markdown(file) {
  const [, front, body] = readFileSync(file, 'utf8').split('---');
  const field = (name) => front.match(new RegExp(`^${name}: (.*)$`, 'm'))?.[1].replace(/^"|"$/g, '');
  return { id: field('id'), position: Number(field('position')), title: field('title'), body_markdown: body.trim() };
}
const lesson = markdown(resolve(source, 'index.md'));
const cards = readdirSync(resolve(source, 'cards')).filter(name => name.endsWith('.md')).map(name => markdown(resolve(source, 'cards', name))).sort((a, b) => a.position - b.position);
const title = lesson.title;
const url = `/apps/little-grains/theme/life/path/baby/lesson/${lesson.id}/card/${cards[0].id}`;

async function fixture(page, { delay = false, fail = false, empty = false } = {}) {
  await page.addInitScript(() => localStorage.setItem('genious_token', 'reader-layout-fixture'));
  await page.route('**/reader-test-photo.jpg', route => route.fulfill({ contentType: 'image/jpeg', body: readFileSync(resolve(source, 'cards/tummy-time.jpg')) }));
  let read = false, answered = false;
  const progress = () => ({ cards_completed: Number(read), cards_total: cards.length, checkpoints_correct: Number(answered) });
  await page.route('**/api/learning/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (path.endsWith('/garden/')) return route.fulfill({ json: { themes: [], rewards: {} } });
    if (path.endsWith('/open/')) return route.fulfill({ json: {} });
    if (path.endsWith('/complete/')) { read = true; return route.fulfill({ json: { card_id: cards[0].id, completed_at: '2026-11-02T17:00:00Z', created: true, progress: progress(), next_step: { type: 'question', id: 'question' } } }); }
    if (path.endsWith('/question-attempts/')) { answered = true; return route.fulfill({ json: { attempt_id: 'attempt-1', question_id: 'question', attempt_type: 'initial', correct: true, carrot_earned: true, explanation: 'Correct.', answered_at: '2026-11-02T17:01:00Z', correct_answer: null, progress: progress(), next_step: null } }); }
    if (delay) return; // Leave the lesson request pending to test loading deterministically.
    if (fail) return route.fulfill({ status: 500, json: { error: 'Could not open lesson.' } });
    return route.fulfill({ json: {
      theme: { id: 'life', title: 'Life & Society' }, learning_path: { id: 'baby', title: "A baby's first year through science" },
      lesson: { ...lesson, introduction_markdown: lesson.body_markdown, progress: progress() },
      cards: empty ? [] : cards.map((card, i) => ({ ...card, completed_at: i === 0 && read ? '2026-11-02T17:00:00Z' : null, ...(i === 0 ? { illustration_url: '/reader-test-photo.jpg', illustration_alt: 'An infant doing tummy time.', illustration_caption: 'An infant doing tummy time.', illustration_credit: 'george ruiz', illustration_license: 'CC BY 2.0', illustration_source_url: 'https://commons.wikimedia.org/wiki/File:Tummy_time.jpg' } : {}) })),
      questions: empty ? [] : [{ id: 'question', type: 'multiple_choice', after_card_position: 1, prompt: 'Which direction develops first?', options: [{ id: 'head', text: 'Head to tail' }, { id: 'tail', text: 'Tail to head' }] }],
      next_step: empty ? null : read ? { type: 'question', id: 'question' } : { type: 'card', id: cards[0].id },
    } });
  });
}

for (const size of [{ width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }, { width: 1440, height: 1000 }]) {
  test(`lesson title scrolls away, toolbar stays usable at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await fixture(page);
    await page.goto(url);
    const reader = page.getByRole('dialog', { name: title });
    const content = reader.locator('.grains-reader-content');
    const close = reader.getByRole('button', { name: 'Close lesson' });
    await expect(reader.getByRole('heading', { name: title })).toBeVisible();
    await expect(reader.getByRole('img')).toBeVisible();
    await expect(reader.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    await expect(reader.locator('.grains-reader-head .grain-markdown p')).toHaveCSS('font-size', size.width <= 760 ? '17px' : '16px');
    const bounds = await reader.boundingBox();
    if (size.width <= 760) { expect(bounds.y).toBe(0); expect(bounds.height).toBe(size.height); }
    expect(await close.boundingBox()).toMatchObject({ width: 44, height: 44 });
    const toolbar = await reader.locator('.grains-reader-top').boundingBox();
    expect(toolbar.height).toBeLessThanOrEqual(64);
    const heading = reader.getByRole('heading', { name: title });
    const cardTop = await reader.locator('.grains-study-card').evaluate(el => el.offsetTop);
    const scrollTop = await content.evaluate(el => el.offsetTop);
    if (size.width === 390) await page.screenshot({ path: '/tmp/lg-reader-open.png' });
    await content.evaluate((el, top) => { el.scrollTop = top; }, cardTop - scrollTop - 18);
    await expect.poll(async () => (await heading.boundingBox()).y + (await heading.boundingBox()).height).toBeLessThanOrEqual(toolbar.y + toolbar.height);
    expect((await close.boundingBox()).y).toBe(toolbar.y + (toolbar.height - 44) / 2);
    await expect(close).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(size.width);
    if (size.width === 390) await page.screenshot({ path: '/tmp/lg-reader-scrolled.png' });
    await close.click();
    await expect(reader).toHaveCount(0);
  });
}

test('reading, question progress, previous card and close still work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await fixture(page);
  await page.goto(url);
  const reader = page.getByRole('dialog', { name: title });
  await reader.getByRole('button', { name: /read this card/ }).click();
  await expect(reader.getByRole('heading', { name: 'Which direction develops first?' })).toBeVisible();
  await expect(reader.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  await reader.getByRole('button', { name: '← Previous card' }).click();
  await expect(reader.getByText(/ALREADY READ/)).toBeVisible();
  await reader.getByRole('button', { name: /Return to next step/ }).click();
  await reader.getByLabel('Head to tail', { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(reader.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  await expect(reader.getByRole('status')).toContainText('right');
  await reader.getByRole('button', { name: 'Close lesson' }).click();
  await expect(reader).toHaveCount(0);
});

for (const state of ['loading', 'error', 'empty']) {
  test(`${state} keeps close available`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await fixture(page, { delay: state === 'loading', fail: state === 'error', empty: state === 'empty' });
    await page.goto(url);
    if (state === 'loading') await expect(page.getByText('Opening lesson…')).toBeVisible();
    if (state === 'error') await expect(page.getByRole('alert')).toHaveText('Could not open lesson.');
    if (state === 'empty') await expect(page.getByText('This lesson has no cards yet.')).toBeVisible();
    await page.getByRole('button', { name: 'Close lesson' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
}

test('garden refreshes on leaving the lesson, not per step', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await fixture(page);
  let gardenCalls = 0;
  page.on('request', (request) => { if (request.url().endsWith('/api/learning/garden/')) gardenCalls++; });
  await page.goto(url);
  const reader = page.getByRole('dialog', { name: title });
  await expect(reader.getByRole('heading', { name: title })).toBeVisible();
  const afterOpen = gardenCalls; // The app load fetches the garden once.
  await reader.getByRole('button', { name: /read this card/ }).click();
  await expect(reader.getByRole('heading', { name: 'Which direction develops first?' })).toBeVisible();
  await reader.getByLabel('Head to tail', { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(reader.getByRole('status')).toContainText('right');
  await reader.getByRole('button', { name: 'Continue →', exact: true }).click();
  await expect(reader.getByText('Lesson finished!')).toBeVisible();
  expect(gardenCalls).toBe(afterOpen);
  await reader.getByRole('button', { name: 'Close lesson' }).click();
  await expect.poll(() => gardenCalls).toBe(afterOpen + 1);
});

test('multiple-choice options display in shuffled order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => { Math.random = () => 0; }); // Deterministic: reverses a two-option list.
  await fixture(page);
  await page.goto(url);
  const reader = page.getByRole('dialog', { name: title });
  await reader.getByRole('button', { name: /read this card/ }).click();
  await expect(reader.getByRole('heading', { name: 'Which direction develops first?' })).toBeVisible();
  await expect(reader.locator('.grains-options label span')).toHaveText(['Tail to head', 'Head to tail']);
  await reader.getByLabel('Head to tail', { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(reader.getByRole('status')).toContainText('right');
  await page.screenshot({ path: '/tmp/lg-question-shuffled.png' });
});

test('a checkpoint after the last card is served before the celebration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('genious_token', 'reader-layout-fixture'));
  let read = false, answered = false;
  const progress = () => ({ cards_completed: 1 + Number(read), cards_total: 2, checkpoints_correct: Number(answered) });
  const payload = () => ({
    theme: { id: 'life', title: 'Life & Society' }, learning_path: { id: 'baby', title: "A baby's first year through science" },
    lesson: { ...lesson, introduction_markdown: '', progress: progress() },
    cards: [
      { ...cards[0], completed_at: '2026-11-03T20:00:00Z' },
      { ...cards[1], completed_at: read ? '2026-11-03T21:00:00Z' : null },
    ],
    questions: [{ id: 'final-question', type: 'multiple_choice', after_card_position: cards[1].position, prompt: 'What comes last?', options: [{ id: 'a', text: 'The celebration' }, { id: 'b', text: 'Another card' }] }],
    next_step: !read ? { type: 'card', id: cards[1].id } : answered ? null : { type: 'question', id: 'final-question' },
  });
  await page.route('**/api/learning/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/health/')) return route.fulfill({ json: { status: 'ok', database: 'ok' } });
    if (path.endsWith('/garden/')) return route.fulfill({ json: { themes: [], rewards: {} } });
    if (path.endsWith('/open/')) return route.fulfill({ json: {} });
    if (path.endsWith('/complete/')) { read = true; return route.fulfill({ json: { card_id: cards[1].id, completed_at: '2026-11-03T21:00:00Z', created: true, progress: progress(), next_step: { type: 'question', id: 'final-question' } } }); }
    if (path.endsWith('/question-attempts/')) { answered = true; return route.fulfill({ json: { attempt_id: 'attempt-1', question_id: 'final-question', attempt_type: 'initial', correct: true, carrot_earned: true, explanation: 'Correct.', answered_at: '2026-11-03T21:01:00Z', correct_answer: null, progress: progress(), next_step: null } }); }
    return route.fulfill({ json: payload() });
  });
  await page.goto(`/apps/little-grains/theme/life/path/baby/lesson/${lesson.id}/card/${cards[1].id}`);
  const reader = page.getByRole('dialog', { name: title });
  await reader.getByRole('button', { name: /read this card/ }).click();
  // Reading the last card leads to its checkpoint question, not the celebration.
  await expect(reader.getByRole('heading', { name: 'What comes last?' })).toBeVisible();
  await expect(reader.getByText('2 / 3 steps', { exact: true })).toBeVisible();
  await reader.getByLabel('The celebration', { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer', exact: true }).click();
  await reader.getByRole('button', { name: 'Continue →', exact: true }).click();
  await expect(reader.getByText('Lesson finished!')).toBeVisible();
  await expect(reader.getByText('3 / 3 steps', { exact: true })).toBeVisible();
  await page.waitForTimeout(1200); // Let the celebration animation settle for the screenshot.
  await page.screenshot({ path: '/tmp/lg-final-checkpoint.png' });
});

test('options keep their shuffled order when the answer is checked', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Alternating swap/no-swap pattern: any reshuffle after the question is on
  // screen visibly flips a two-option list, whatever the call count so far.
  await page.addInitScript(() => {
    let call = 0;
    const pattern = [0, 0.999, 0.999, 0];
    Math.random = () => pattern[call++ % pattern.length];
  });
  await fixture(page);
  await page.goto(url);
  const reader = page.getByRole('dialog', { name: title });
  await reader.getByRole('button', { name: /read this card/ }).click();
  await expect(reader.getByRole('heading', { name: 'Which direction develops first?' })).toBeVisible();
  const labels = reader.locator('.grains-options label span');
  const before = await labels.allTextContents();
  await reader.getByLabel(before[0], { exact: true }).check();
  await reader.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(reader.getByRole('status')).toContainText('right');
  await expect(labels).toHaveText(before); // A refetch must not reshuffle on screen.
  await page.screenshot({ path: '/tmp/lg-question-stable.png' });
});
