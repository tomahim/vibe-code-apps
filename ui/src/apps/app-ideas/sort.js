// Creation timestamp of an idea from `created` (ISO datetime, e.g. 2026-10-20T07:45:11Z).
// Returns ms since epoch (0 if unusable).
export function createdAt(idea) {
  const time = Date.parse(idea.created || '');
  return Number.isNaN(time) ? 0 : time;
}

// Newest first. Ties (same timestamp) fall back to issue number then slug, descending.
export function sortNewestFirst(list) {
  return [...list].sort((a, b) =>
    createdAt(b) - createdAt(a)
    || (b.issue || 0) - (a.issue || 0)
    || b.slug.localeCompare(a.slug));
}
