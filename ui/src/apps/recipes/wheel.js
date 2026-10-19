export const SEGMENTS = 10;
export const TAU = Math.PI * 2;
export const STEP = TAU / SEGMENTS;

export function ingredientNames(value) {
  return [...new Set(value.split(',').map((name) => name.trim().toLowerCase()).filter(Boolean))];
}

export function recipeQuery(names) {
  return names.length ? `?${new URLSearchParams({ ingredients: names.join(',') })}` : '';
}

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Condition the display subset on the API's winner, never the other way around:
// every recipe in the full filtered collection retains its chance of winning.
export function wheelRecipes(candidates, winner, random = Math.random) {
  if (!candidates.length && !winner) return [];
  const pool = winner
    ? [winner, ...shuffle(candidates.filter((item) => item.id !== winner.id), random)]
    : shuffle(candidates, random);
  if (pool.length > SEGMENTS) return shuffle(pool.slice(0, SEGMENTS), random);
  return Array.from({ length: SEGMENTS }, (_, i) => pool[i % pool.length]);
}

export function landingRotation(current, index) {
  const target = ((-index * STEP) % TAU + TAU) % TAU;
  const phase = ((current % TAU) + TAU) % TAU;
  return current + TAU * 5 + ((target - phase + TAU) % TAU);
}

export function safeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.origin);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
