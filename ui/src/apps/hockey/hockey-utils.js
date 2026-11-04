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
