import { test, expect } from '@playwright/test';

const pages = [
  { name: 'review', path: '/apps/content-review', dark: false },
  { name: 'little-grains', path: '/apps/little-grains', dark: false },
  { name: 'gallery', path: '/', dark: true },
  { name: 'profile', path: '/profile', dark: true },
];

function luminance(color) {
  const values = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

async function expectContrast(locator, background) {
  const foreground = await locator.evaluate(node => getComputedStyle(node).color);
  const a = luminance(foreground), b = luminance(background);
  expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(4.5);
}

for (const width of [390, 1440]) {
  for (const owner of pages) {
    test(`${owner.name} account menu follows its palette at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => {
        localStorage.setItem('genious_token', 'test-token');
        localStorage.setItem('genious_user', JSON.stringify({ first_name: 'Thomas', email: 'test@example.com' }));
      });
      await page.route('**/api/apps/', route => route.fulfill({ json: { apps: [] } }));
      await page.route('**/api/apps/content-review/prs', route => route.fulfill({ json: { pull_requests: [] } }));
      await page.route('**/api/learning/garden/', route => route.fulfill({ json: { themes: [], recent_lessons: [], rewards: { drops: 0, carrots: 0 } } }));
      await page.goto(owner.path);
      const avatar = page.getByRole('button', { name: 'Open your account menu' });
      await avatar.click();
      await page.mouse.move(0, 899);
      const menu = page.getByRole('menu', { name: 'Account' });
      const profile = menu.getByRole('menuitem', { name: 'Profile' });
      const logout = menu.getByRole('menuitem', { name: 'Log out' });
      const background = await menu.evaluate(node => getComputedStyle(node).backgroundColor);
      expect(luminance(background) > 0.5).toBe(!owner.dark);
      await expectContrast(profile, background);
      await expectContrast(logout, background);
      const avatarBackground = await avatar.evaluate(node => getComputedStyle(node).backgroundColor);
      await expectContrast(avatar, avatarBackground);
      const box = await menu.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `/tmp/dropdown-fix/screens/${owner.name}-${width}.png` });

      await logout.hover();
      const hoverBackground = await logout.evaluate(node => getComputedStyle(node).backgroundColor);
      expect(hoverBackground).not.toBe('rgba(0, 0, 0, 0)');
      await expectContrast(logout, hoverBackground);
      await page.mouse.move(0, 899);
      await avatar.hover();
      await expectContrast(avatar, await avatar.evaluate(node => getComputedStyle(node).backgroundColor));
      await page.mouse.move(0, 899);
      await avatar.focus();
      await page.keyboard.press('Tab');
      await expect(profile).toBeFocused();
      const focusBackground = await profile.evaluate(node => getComputedStyle(node).backgroundColor);
      await expectContrast(profile, focusBackground);
      await page.screenshot({ path: `/tmp/dropdown-fix/screens/${owner.name}-${width}-focus.png` });
      await page.keyboard.press('Escape');
      await expect(menu).toHaveCount(0);
    });
  }
}
