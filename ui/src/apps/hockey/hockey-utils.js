export const SEASON = 2027;
export const SEASON_LABEL = '2026/27';
export const COLORS = ['#087e8b', '#d46b31', '#6e56b4', '#35794f', '#bb4570', '#577195', '#8d7130', '#6d6c65'];
export function toggleSelection(ids, id, max = 8) {
  return ids.includes(id) ? ids.filter(x => x !== id) : ids.length < max ? [...ids, id] : ids;
}
export function validateTransfer(roster, sells, buys) {
  if (!sells.length || sells.length !== buys.length) return 'Choose the same number of outgoing and incoming players.';
  const owned = new Set(roster.map(row => row.player));
  if (sells.some(id => !owned.has(id))) return 'Outgoing players must be in this roster.';
  if (buys.some(id => owned.has(id) || sells.includes(id))) return 'Incoming players must be outside this roster.';
  return '';
}
export function completeCosts(roster) {
  return roster.length > 0 && roster.every(row => row.acquired_price_m != null && row.acquired_price_m !== '' && Number.isFinite(Number(row.acquired_price_m)));
}
export function weekDomain(players) {
  return [...new Set(players.flatMap(p => (p.weeks || []).map(w => w.week)))].sort((a,b) => (Number(a) < 27 ? Number(a)+53 : Number(a)) - (Number(b) < 27 ? Number(b)+53 : Number(b)));
}
export function adjacentWeeks(a,b) {
  return Number(b) === Number(a)+1 || (Number(a) >= 52 && Number(b) === 1);
}

export const INJURY_LABELS = { day_to_day: 'Day-to-day', out: 'Out', out_long: 'Long-term', returning: 'Returning', reported: 'Reported' };
export function injuryLabel(hint) { return INJURY_LABELS[hint] || 'Reported'; }
export function nationalityLabel(code) {
  if (!code) return 'Unknown';
  return code.toLowerCase() === 'ch' ? 'Swiss' : 'Foreign';
}

export function shotsPerMatch(season) {
  if (!season || !season.games || season.shots_on_goal == null) return '-';
  return (season.shots_on_goal / season.games).toFixed(1);
}
export function shootingPct(season) {
  if (!season || !season.shots_on_goal) return '-';
  return `${(season.goals / season.shots_on_goal * 100).toFixed(1)}%`;
}

// Official 2026/27 HM repricing calendar (hockeymanager.ch/fr/rules, verified
// 2026-11-06; changes at 15:30, games of the previous day counted).
export const HM_REPRICING_DATES = ['2026-10-01','2026-10-15','2026-10-29','2026-11-19','2026-12-03','2026-12-17','2026-12-31','2027-01-14','2027-01-28','2027-02-11','2027-02-25'];
export function nextRepricing(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return HM_REPRICING_DATES.find(d => d >= today) || null;
}

// Value trend exactly as Hockey Manager defines it, computed from an imported
// HM snapshot. Verified against hockeymanager.ch on 2026-11-06:
// - Rules: a skater's target value is season HM points / matches played,
//   rounded to the nearest 0.5 M; each official repricing moves the price
//   toward it by at most +/-1.5 M; only players with 5+ matches can move.
// - HM's own player-detail trend icon matches this projection, not the last
//   repricing: Malgin (avg 16.56 -> 16.5 target vs 17.0 price, last change +1.5)
//   showed down; Jarventie (20.0 target vs 15.0) up; Andrighetto (14.625 ->
//   14.5 = price) stable; Shore (exactly 10.25 -> rounded UP to 10.5 vs 10.0)
//   up; Forget (1 match, avg 1.0 below his 1.5 price) stable.
// - Goalie pairs are excluded by the caller: HM assigns their values monthly
//   by ranking with no published formula, so no trend is computable for them.
// Returns null when the snapshot lacks price, points or matches (never an
// invented trend); otherwise {direction: 'up'|'down'|'stable', delta,
// eligible}. delta is the projected change in M, a 0.5 step within +/-1.5.
export function hmTrend(hm) {
  if (!hm || hm.price_m == null || hm.points_season == null || hm.matches == null) return null;
  const price = Number(hm.price_m), points = Number(hm.points_season), matches = Number(hm.matches);
  if (!Number.isFinite(price) || !Number.isFinite(points) || !Number.isFinite(matches)) return null;
  if (matches < 5) return { direction: 'stable', delta: 0, eligible: false };
  const target = Math.round((points / matches) * 2) / 2;
  const delta = Math.max(-1.5, Math.min(1.5, Math.round((target - price) * 2) / 2));
  return { direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'stable', delta, eligible: true };
}
