// Pure helpers for the database dashboard (unit-tested in tests/db-dashboard.test.mjs).

const UNITS = ["B", "KB", "MB", "GB", "TB"];

export function formatBytes(value) {
  if (value == null || Number.isNaN(Number(value))) return "–";
  let size = Math.max(Number(value), 0);
  let unit = 0;
  while (size >= 1024 && unit < UNITS.length - 1) {
    size /= 1024;
    unit += 1;
  }
  const digits = unit === 0 || size >= 100 ? 0 : size >= 10 ? 1 : 2;
  return `${size.toFixed(digits)} ${UNITS[unit]}`;
}

export function formatNumber(value) {
  if (value == null) return "–";
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompact(value) {
  if (value == null) return "–";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatPercent(fraction, digits = 1) {
  if (fraction == null || Number.isNaN(fraction)) return "–";
  return `${(fraction * 100).toFixed(digits)}%`;
}

export function relativeTime(iso, now = Date.now()) {
  if (!iso) return "never";
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000);
  if (seconds < 45) return "just now";
  if (seconds < 3600) return `${Math.round(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h ago`;
  return `${Math.round(seconds / 86400)} d ago`;
}

// Level of the storage gauge against the allowance.
export function usageLevel(fraction) {
  if (fraction == null) return "none";
  if (fraction >= 0.9) return "critical";
  if (fraction >= 0.7) return "warning";
  return "ok";
}

export const SORTS = {
  size: { label: "Size", compare: (a, b) => b.total_bytes - a.total_bytes },
  rows: { label: "Rows", compare: (a, b) => b.rows - a.rows },
  indexes: { label: "Indexes", compare: (a, b) => b.index_bytes - a.index_bytes },
  dead: { label: "Dead rows", compare: (a, b) => b.dead_rows - a.dead_rows },
  name: { label: "Name", compare: (a, b) => a.name.localeCompare(b.name) },
};

export function visibleTables(tables, { query = "", group = "all", sort = "size" } = {}) {
  const needle = query.trim().toLowerCase();
  const compare = (SORTS[sort] || SORTS.size).compare;
  return tables
    .filter((table) => group === "all" || table.group === group)
    .filter((table) => !needle || table.name.toLowerCase().includes(needle) || table.group.toLowerCase().includes(needle))
    .sort((a, b) => compare(a, b) || a.name.localeCompare(b.name));
}

// Indexes that no query has used since the statistics were last reset.
// Unique and primary-key indexes enforce constraints, so they never count.
export function unusedIndexes(indexes) {
  return indexes.filter((index) => index.scans === 0 && !index.unique && !index.primary);
}

// Local growth history: one snapshot per visit, at most one per 10 minutes.
const HISTORY_KEY = "genious_db_dashboard_history";
const MIN_GAP_MS = 10 * 60 * 1000;
const MAX_POINTS = 120;

export function appendSnapshot(history, point, gap = MIN_GAP_MS) {
  const last = history[history.length - 1];
  const next = last && point.t - last.t < gap ? [...history.slice(0, -1), point] : [...history, point];
  return next.slice(-MAX_POINTS);
}

export function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((p) => Number.isFinite(p.t) && Number.isFinite(p.bytes)) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* storage unavailable: history is just not kept */
  }
}

const LIMIT_KEY = "genious_db_dashboard_limit_gb";

export function loadLimitGb() {
  try {
    const value = Number(localStorage.getItem(LIMIT_KEY));
    return value > 0 ? value : null;
  } catch {
    return null;
  }
}

export function saveLimitGb(value) {
  try {
    if (value > 0) localStorage.setItem(LIMIT_KEY, String(value));
    else localStorage.removeItem(LIMIT_KEY);
  } catch {
    /* storage unavailable */
  }
}

// Points for an SVG sparkline in a width x height box.
export function sparklinePoints(history, width, height, pad = 4) {
  if (history.length < 2) return "";
  const values = history.map((p) => p.bytes);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const t0 = history[0].t;
  const tSpan = history[history.length - 1].t - t0 || 1;
  return history
    .map((p) => {
      const x = pad + ((p.t - t0) / tSpan) * (width - pad * 2);
      const y = height - pad - ((p.bytes - min) / span) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
