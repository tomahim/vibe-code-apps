// Fictional quantities per equal-length step. Not a hydraulic model.
export const demandCycle = [
  { label: 'Before dawn', demand: 2 },
  { label: 'Waking up', demand: 3 },
  { label: 'Morning rush', demand: 8 },
  { label: 'One more shower', demand: 7 },
  { label: 'Quieter streets', demand: 4 },
  { label: 'Late morning', demand: 3 },
];
export function storageStep(level, inflow, demand, capacity) {
  if (![level, inflow, demand, capacity].every(v => Number.isFinite(v) && v >= 0) || level > capacity) throw new RangeError('Storage values must be finite, non-negative and within capacity.');
  const available = level + inflow;
  const delivered = Math.min(demand, available);
  const remaining = available - delivered;
  const overflow = Math.max(0, remaining - capacity);
  return { level: Math.min(capacity, remaining), delivered, shortage: demand - delivered, overflow };
}
export function runStorageCycle(capacity, inflow) {
  let level = capacity / 2;
  return demandCycle.map(period => {
    const before = level;
    const result = storageStep(level, inflow, period.demand, capacity);
    level = result.level;
    return { ...period, before, inflow, ...result };
  });
}
