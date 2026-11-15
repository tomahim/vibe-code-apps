// Local visual verification for the Garmin stats app (not part of CI).
// Serves the dev UI against the locally running Django API, signs in with a
// locally minted token, and captures desktop + mobile screenshots of the
// dashboard and the animated running story at several scroll positions.
import { chromium } from "@playwright/test";
import { readFileSync, mkdirSync } from "node:fs";

const OUT = "/downloads/garmin-check";
mkdirSync(OUT, { recursive: true });

const token = readFileSync("/tmp/garmin-token.txt", "utf8").trim();
const BASE = "http://127.0.0.1:5173";

async function newPage(browser, width, height) {
  const context = await browser.newContext({ viewport: { width, height } });
  await context.addInitScript((t) => {
    window.localStorage.setItem("genious_token", t);
    window.localStorage.setItem("genious_user", JSON.stringify({ email: "local-check" }));
  }, token);
  return context.newPage();
}

async function scrollToSelector(page, selector, fraction = 0.5) {
  await page.evaluate(
    ([sel, frac]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const scrollable = Math.max(rect.height - window.innerHeight, 0);
      window.scrollTo({ top: top + scrollable * frac });
    },
    [selector, fraction]
  );
  await page.waitForTimeout(900);
}

const browser = await chromium.launch();

// --- desktop ---
const page = await newPage(browser, 1440, 1000);
await page.goto(`${BASE}/apps/garmin-stats`, { waitUntil: "networkidle" });
await page.waitForSelector(".gs-kpis", { timeout: 20000 });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/01-overall-desktop.png` });

// year filter view
await page.click('.gs-year-filter button:text-is("2025")');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/02-overall-desktop-2025.png` });

await page.click('.garmin-tab:text-is("My stats animated")');
await page.waitForSelector(".gr-hero-title", { timeout: 20000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/03-story-hero.png` });

await scrollToSelector(page, ".gr-evolution", 0.35);
await page.screenshot({ path: `${OUT}/04-story-evolution-mid.png` });
await scrollToSelector(page, ".gr-evolution", 0.9);
await page.screenshot({ path: `${OUT}/05-story-evolution-late.png` });

await scrollToSelector(page, ".gr-totals", 0.5);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/06-story-totals.png` });

const cards = await page.$$(".gr-card");
for (const [i, card] of [[0, cards[0]], [3, cards[3]], [8, cards[8]], [13, cards[13]], [15, cards[15]]]) {
  if (!card) continue;
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/07-story-card-${i}.png` });
}

const topDays = await page.$(".gr-topdays");
if (topDays) {
  await topDays.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${OUT}/07b-story-top-step-days.png` });
}

// dashboard year table
await page.click('.garmin-tab:text-is("Overall stats")');
await page.waitForSelector('.gs-yeartable', { timeout: 20000 });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/09-overall-yeartable.png` });

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/08-story-outro.png` });
await page.close();

// --- mobile ---
const mobile = await newPage(browser, 390, 844);
await mobile.goto(`${BASE}/apps/garmin-stats`, { waitUntil: "networkidle" });
await mobile.waitForSelector(".gs-kpis", { timeout: 20000 });
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: `${OUT}/10-overall-mobile.png` });
await mobile.click('.garmin-tab:text-is("My stats animated")');
await mobile.waitForSelector(".gr-hero-title", { timeout: 20000 });
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: `${OUT}/11-story-hero-mobile.png` });
await scrollToSelector(mobile, ".gr-evolution", 0.5);
await mobile.screenshot({ path: `${OUT}/12-story-evolution-mobile.png` });
const mobileCards = await mobile.$$(".gr-card");
if (mobileCards[3]) {
  await mobileCards[3].scrollIntoViewIfNeeded();
  await mobile.waitForTimeout(1500);
  await mobile.screenshot({ path: `${OUT}/13-story-card-mobile.png` });
}
await mobile.close();

// --- scroll video of the full story (desktop) ---
const videoContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: "/tmp/garmin-video", size: { width: 1440, height: 900 } },
});
await videoContext.addInitScript((t) => {
  window.localStorage.setItem("genious_token", t);
}, token);
const videoPage = await videoContext.newPage();
await videoPage.goto(`${BASE}/apps/garmin-stats`, { waitUntil: "networkidle" });
await videoPage.waitForSelector(".gs-kpis", { timeout: 20000 });
await videoPage.click('.garmin-tab:text-is("My stats animated")');
await videoPage.waitForSelector(".gr-hero-title", { timeout: 20000 });
await videoPage.waitForTimeout(1000);
const totalHeight = await videoPage.evaluate(() => document.body.scrollHeight - window.innerHeight);
for (let y = 0; y <= totalHeight; y += 300) {
  await videoPage.evaluate((top) => window.scrollTo({ top }), y);
  await videoPage.waitForTimeout(260);
}
await videoPage.waitForTimeout(800);
await videoPage.close();
await videoContext.close();

await browser.close();
console.log("screenshots + video done");
