import { test, expect } from '@playwright/test';

const table = (name, group, total, rows, extra = {}) => ({
  name, group, total_bytes: total, table_bytes: total * 0.4, index_bytes: total * 0.4, toast_bytes: total * 0.2,
  rows, rows_exact: true, dead_rows: 0, seq_scans: 3, index_scans: 9, inserts: rows, updates: 0, deletes: 0,
  last_vacuum: null, last_analyze: null, index_count: 2, ...extra,
});

// Fixture shaped like /api/apps/db-dashboard/overview (not real data).
const overview = {
  database: { name: 'fixturedb', size_bytes: 30_000_000, version: '18.0', server_started_at: null, connections: 2, commits: 1000, rollbacks: 3, cache_hit_ratio: 0.99, deadlocks: 0, temp_bytes: 0, stats_reset_at: null },
  tables: [table('lg_card', 'Little Grains', 2_000_000, 1383), table('hockey_game', 'Hockey Lab', 900_000, 364), table('auth_user', 'Accounts', 64_000, 3)],
  indexes: [
    { table: 'lg_card', name: 'lg_card_pkey', bytes: 200_000, scans: 5, unique: true, primary: true },
    { table: 'lg_card', name: 'lg_card_slug_idx', bytes: 100_000, scans: 0, unique: false, primary: false },
  ],
  groups: [
    { name: 'Little Grains', tables: 1, rows: 1383, bytes: 2_000_000, table_bytes: 800_000, index_bytes: 800_000, toast_bytes: 400_000 },
    { name: 'Hockey Lab', tables: 1, rows: 364, bytes: 900_000, table_bytes: 360_000, index_bytes: 360_000, toast_bytes: 180_000 },
    { name: 'Accounts', tables: 1, rows: 3, bytes: 64_000, table_bytes: 25_600, index_bytes: 25_600, toast_bytes: 12_800 },
  ],
  totals: { tables: 3, indexes: 2, rows: 1750, table_bytes: 1_200_000, index_bytes: 1_200_000, toast_bytes: 600_000, relation_bytes: 3_000_000, system_bytes: 27_000_000 },
  storage_limit_bytes: null,
};

for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
  test.describe(`database dashboard on ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('genious_token', 'test-token'));
    });

    test('shows size, tables, filters and the allowance gauge without overflow', async ({ page }) => {
      await page.route('**/api/apps/db-dashboard/overview', (route) => route.fulfill({ json: overview }));
      await page.goto('/apps/db-dashboard');
      await expect(page.getByRole('heading', { name: 'fixturedb' })).toBeVisible();
      await expect(page.locator('.dbd-gauge-value')).toHaveText('28.6 MB');
      await expect(page.locator('.dbd-table-row')).toHaveCount(3);
      await page.getByRole('searchbox', { name: 'Search tables' }).fill('hockey');
      await expect(page.locator('.dbd-table-row')).toHaveCount(1);
      await page.getByRole('searchbox', { name: 'Search tables' }).fill('');
      await page.getByLabel('Sort tables').selectOption('rows');
      await expect(page.locator('.dbd-table-name code').first()).toHaveText('lg_card');
      await page.locator('.dbd-table-main').first().click();
      await expect(page.getByText('Last vacuum')).toBeVisible();
      await page.getByLabel('Plan storage allowance (GB)').fill('0.5');
      await page.getByRole('button', { name: 'Set' }).click();
      await expect(page.locator('.dbd-gauge-sub')).toHaveText('5.6% of 512 MB');
      await expect(page.getByText('1 non-unique indexes have no recorded scan')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: `test-results/db-dashboard-${viewport.name}.png`, fullPage: true });
    });

    test('explains a staff-only refusal', async ({ page }) => {
      await page.route('**/api/apps/db-dashboard/overview', (route) => route.fulfill({ status: 403, json: { error: 'The database dashboard is limited to staff.' } }));
      await page.goto('/apps/db-dashboard');
      await expect(page.getByRole('alert')).toContainText('limited to staff');
    });
  });
}

test('signed-out visitors are sent to login', async ({ page }) => {
  await page.goto('/apps/db-dashboard');
  await expect(page).toHaveURL(/\/login/);
});
