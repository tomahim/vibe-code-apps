// Fictional camera travel, deliberately separate from water/pressure modeling.
export function pipeView(travel, gateOpen) {
  const progress = Math.max(0, Math.min(100, Number.isFinite(travel) ? travel : 0));
  const desired = 10 - progress * .22;
  const blocked = !gateOpen && desired < 1;
  return { z: blocked ? 1 : desired, blocked };
}
