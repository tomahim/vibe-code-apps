import { exercisesFor } from './checks.js';

export const STORAGE_KEY = 'rust-learning-path:v1';

export function readProgress(storage, lessons) {
  const empty = { current: lessons[0]?.id, step: 0, drafts: {}, passed: {} };
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return empty;
    const keys = new Set(lessons.flatMap((lesson) => exercisesFor(lesson).map((_, step) => `${lesson.id}:${step}`)));
    const current = lessons.find((lesson) => lesson.id === saved.current) ?? lessons[0];
    const step = Number.isInteger(saved.step) && saved.step >= 0 && saved.step < exercisesFor(current).length ? saved.step : 0;
    const drafts = Object.fromEntries(Object.entries(saved.drafts ?? {}).filter(([key, code]) => keys.has(key) && typeof code === 'string'));
    const passed = Object.fromEntries(Object.entries(saved.passed ?? {}).filter(([key, value]) => keys.has(key) && value === true));
    return { current: current.id, step, drafts, passed };
  } catch { return empty; }
}

export function writeProgress(storage, progress) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; }
  catch { return false; }
}
