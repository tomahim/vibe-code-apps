// Ear-matching scorer: compares the player's knob positions against a hidden
// target patch, but only on the goal parameters of a lesson. Pure functions so
// the node test suite can exercise them without a browser.

import { CONTROL_BY_ID, normalizedValue } from "./params.js";

// Distance 0..1 between two values of one control, in normalized space.
export function paramDistance(control, current, target) {
  if (control.kind === "selector") return current === target ? 0 : 1;
  return Math.abs(normalizedValue(control, current) - normalizedValue(control, target));
}

// goalParams: { paramId: targetValue }, tolerances: { paramId: 0..1 } optional
// overrides (falls back to the control's own tolerance).
// Returns { score 0..100, passed, checks: [{id, label, distance, tolerance, within, direction}] }.
// direction ("up"/"down"/null) is only meant for the post-failure "reveal the
// gap" cheat; the plain result must not leak which way to turn.
export function scoreMatch(goalParams, currentPatch, tolerances = {}) {
  const checks = Object.entries(goalParams).map(([id, target]) => {
    const control = CONTROL_BY_ID.get(id);
    if (!control) throw new Error(`Unknown goal parameter: ${id}`);
    const current = currentPatch[id];
    const distance = paramDistance(control, current, target);
    const tolerance = tolerances[id] ?? control.tolerance ?? 0.1;
    let direction = null;
    if (control.kind !== "selector" && distance > tolerance) {
      direction = normalizedValue(control, current) < normalizedValue(control, target) ? "up" : "down";
    }
    return { id, label: control.label, distance, tolerance, within: distance <= tolerance, direction };
  });
  const score = checks.length
    ? Math.round(100 * (1 - checks.reduce((sum, check) => sum + Math.min(1, check.distance), 0) / checks.length))
    : 100;
  return { score, passed: checks.every((check) => check.within), checks };
}

// Closeness label for the distance meter (no direction leak).
export function closenessLabel(check) {
  if (check.within) return "matched";
  const ratio = check.tolerance > 0 ? check.distance / check.tolerance : Infinity;
  if (ratio <= 2) return "very close";
  if (ratio <= 4) return "close";
  return "far";
}
