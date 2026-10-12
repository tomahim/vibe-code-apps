export const STORAGE_KEY = 'threejs-learning-path:v1';
export function readProgress(storage, validIds) {
  const empty = { current: validIds[0], completed: [], drafts: {}, answers: {} };
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return empty;
    return {
      current: validIds.includes(saved.current) ? saved.current : validIds[0],
      completed: [...new Set(Array.isArray(saved.completed) ? saved.completed.filter((id) => validIds.includes(id)) : [])],
      drafts: Object.fromEntries(Object.entries(saved.drafts || {}).filter(([id, code]) => validIds.includes(id) && typeof code === 'string')),
      answers: Object.fromEntries(Object.entries(saved.answers || {}).filter(([id, answer]) => validIds.includes(id) && Number.isInteger(answer))),
    };
  } catch { return empty; }
}
export function writeProgress(storage, progress) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; }
  catch { return false; }
}
