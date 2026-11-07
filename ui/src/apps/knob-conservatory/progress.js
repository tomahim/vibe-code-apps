export const STORAGE_KEY = "knob-conservatory:v1";

const empty = { currentLesson: null, passed: {}, tries: {} };

export function readProgress(storage, lessons) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return { ...empty };
    const ids = new Set(lessons.map((lesson) => lesson.id));
    const passed = Object.fromEntries(
      Object.entries(saved.passed ?? {}).filter(([id, value]) =>
        ids.has(id) && value && typeof value === "object" && Number.isFinite(value.score)),
    );
    const tries = Object.fromEntries(
      Object.entries(saved.tries ?? {}).filter(([id, value]) => ids.has(id) && Number.isInteger(value) && value >= 0),
    );
    const currentLesson = ids.has(saved.currentLesson) ? saved.currentLesson : null;
    return { currentLesson, passed, tries };
  } catch {
    return { ...empty };
  }
}

export function writeProgress(storage, progress) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
