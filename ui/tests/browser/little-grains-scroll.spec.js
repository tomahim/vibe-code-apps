import { test, expect } from '@playwright/test';

// Advancing a step in the lesson reader ("I've read this card", "Continue →")
// smoothly scrolls the new step's top into view (Thomas, 2026-11-10), so a
// reader at the bottom of a long card doesn't have to scroll back up by hand.

test.beforeEach(async ({ page }) => { await page.setViewportSize({ width: 390, height: 844 }); });

const url = '/apps/little-grains/theme/life/path/baby/lesson/lesson/card/card-1';
const paragraph = 'Babies hear rhythmic, womb-like sounds before birth, and responsive voices, songs and everyday household sound build their auditory diet afterwards. No special products required. ';
const longBody = Array(10).fill(paragraph).join('\n\n');
const progress = (cardsCompleted) => ({ cards_completed: cardsCompleted, cards_total: 2, checkpoints_correct: 0, checkpoints_total: 1, questions_correct: 0, questions_total: 1, lessons_completed: 0, lessons_total: 1, started: true, completed: false });

async function fixture(page) {
  await page.addInitScript(() => {
    localStorage.setItem('genious_token', 'fake-jwt');
    window.__scrollCalls = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (options) {
      window.__scrollCalls.push({ options, className: String(this.className || '') });
      return original.call(this, options);
    };
  });
  await page.route('**/api/learning/**', async (route) => {
    const p = new URL(route.request().url()).pathname;
    if (p.endsWith('/health/')) return route.fulfill({ json: { status: 'ok' } });
    if (p.endsWith('/badges/check/')) return route.fulfill({ json: { badges: [], new_count: 0 } });
    if (p.endsWith('/garden/')) return route.fulfill({ json: { themes: [{ id: 'life', title: 'Life & Society', learning_paths: [{ id: 'baby', title: "A baby's first year through science", progress: progress(0), catch_up: { eligible: false, remaining: 0 }, lessons: [{ id: 'lesson', title: 'Small steps', position: 1, progress: progress(0) }] }] }], rewards: { drops: 0, carrots: 0 } } });
    if (p.endsWith('/open/')) return route.fulfill({ json: {} });
    if (p.endsWith('/cards/card-1/complete/')) return route.fulfill({ json: { card_id: 'card-1', completed_at: '2026-11-10T21:00:00Z', created: true, progress: progress(1), next_step: { type: 'card', id: 'card-2' } } });
    return route.fulfill({ json: {
      theme: { id: 'life', title: 'Life & Society' },
      learning_path: { id: 'baby', title: "A baby's first year through science" },
      lesson: { id: 'lesson', title: 'Small steps', position: 1, progress: progress(0) },
      cards: [
        { id: 'card-1', title: 'A little every day', body_markdown: longBody, position: 1, completed_at: null },
        { id: 'card-2', title: 'Sound all around', body_markdown: longBody, position: 2, completed_at: null },
      ],
      questions: [{ id: 'question', type: 'multiple_choice', after_card_position: 2, prompt: 'What grows?', options: [{ id: 'a', text: 'Knowledge' }, { id: 'b', text: 'Nothing' }] }],
      next_step: { type: 'card', id: 'card-1' },
    } });
  });
}

const contentScroll = () => document.querySelector('.grains-reader-content').scrollTop;
const cardGap = () => {
  const content = document.querySelector('.grains-reader-content').getBoundingClientRect();
  const card = document.querySelector('.grains-study-card').getBoundingClientRect();
  return card.top - content.top;
};

test("I've read this card smoothly scrolls the next card's top into view", async ({ page }) => {
  await fixture(page);
  await page.goto(url);
  const button = page.getByRole('button', { name: /read this card/ });
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
  const startScroll = await page.evaluate(contentScroll);
  expect(startScroll).toBeGreaterThan(300); // genuinely at the bottom of card 1
  await page.screenshot({ path: '/tmp/lg-scroll-before.png' });

  await page.evaluate(() => { window.__scrollCalls = []; });
  await button.click();

  // The scroll helper fires with a smooth, align-to-start request.
  await expect.poll(() => page.evaluate(() => window.__scrollCalls.length)).toBeGreaterThan(0);
  const calls = await page.evaluate(() => window.__scrollCalls);
  expect(calls[0].options).toMatchObject({ behavior: 'smooth', block: 'start' });
  expect(calls[0].className).toContain('grains-study-card');
  await expect(page.getByRole('heading', { name: 'Sound all around' })).toBeVisible();

  // Mid-transition the scroll is still travelling (animated, not a jump)…
  await page.waitForTimeout(200);
  const midScroll = await page.evaluate(contentScroll);
  await page.screenshot({ path: '/tmp/lg-scroll-mid.png' });

  // …and it settles with the next card's top at the top of the reader.
  await expect.poll(() => page.evaluate(cardGap), { timeout: 5000 }).toBeLessThan(40);
  const endScroll = await page.evaluate(contentScroll);
  expect(midScroll).toBeGreaterThan(endScroll + 40);
  await page.screenshot({ path: '/tmp/lg-scroll-after.png' });
});

test('reduced motion advances instantly instead of animating', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await fixture(page);
  await page.goto(url);
  const button = page.getByRole('button', { name: /read this card/ });
  await button.scrollIntoViewIfNeeded();
  await page.evaluate(() => { window.__scrollCalls = []; });
  await button.click();
  await expect.poll(() => page.evaluate(() => window.__scrollCalls.length)).toBeGreaterThan(0);
  const calls = await page.evaluate(() => window.__scrollCalls);
  expect(calls[0].options).toMatchObject({ behavior: 'auto', block: 'start' });
  await expect.poll(() => page.evaluate(cardGap), { timeout: 5000 }).toBeLessThan(40);
});
