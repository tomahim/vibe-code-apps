// Collapsible panel lines. The racks stack up into a tall page, so the panel
// groups its sections into lines of two (the desktop grid shows them side by
// side) and each line folds away with one tap. The fold is remembered in the
// browser, like the lesson progress.

export const COLLAPSE_STORAGE_KEY = "knob-conservatory:collapsed-lines:v1";

export const SECTIONS_PER_LINE = 2;

// Pair the sections two by two, in panel order. A line id is stable as long
// as the sections and their order are, so saved folds survive reloads.
export function sectionLines(sections) {
  const lines = [];
  for (let i = 0; i < sections.length; i += SECTIONS_PER_LINE) {
    const pair = sections.slice(i, i + SECTIONS_PER_LINE);
    lines.push({
      id: pair.map((section) => section.id).join("+"),
      name: pair.map((section) => section.name).join(" · "),
      sections: pair,
    });
  }
  return lines;
}

export function readCollapsedLines(storage, lines) {
  try {
    const saved = JSON.parse(storage.getItem(COLLAPSE_STORAGE_KEY));
    if (!Array.isArray(saved)) return new Set();
    const known = new Set(lines.map((line) => line.id));
    return new Set(saved.filter((id) => typeof id === "string" && known.has(id)));
  } catch {
    return new Set();
  }
}

export function writeCollapsedLines(storage, collapsed) {
  try {
    storage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify([...collapsed]));
    return true;
  } catch {
    return false;
  }
}

// Lessons mode keeps only the lines the current step needs open. The saved
// folds belong to the workshop and are left alone here; a line the player
// opens by hand in a lesson ("peeked") is a session-only choice.
export function lineIsUseful(line, usefulIds) {
  return line.sections.some((section) => section.controls.some((control) => usefulIds.has(control.id)));
}

export function lineIsFolded({ lessonMode, useful, saved, peeked }) {
  if (useful) return false;
  return lessonMode ? !peeked : saved;
}
