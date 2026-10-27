// Pure helpers for the content review app (unit-tested with node --test).

// Split a line into bold / plain segments on **markers**.
export function inlineSegments(text) {
  const segments = [];
  text.split("**").forEach((part, index) => {
    if (part) segments.push({ bold: index % 2 === 1, text: part });
  });
  return segments;
}

// Classify markdown body lines for the preview: quotes (translations),
// blank separators and plain text with inline bold.
export function bodyLines(body) {
  return body.split("\n").map((raw) => {
    const line = raw.trimEnd();
    if (!line.trim()) return { type: "blank", segments: [] };
    const quote = line.match(/^>\s*(.*)$/);
    if (quote) {
      const text = quote[1].trim().replace(/^\*(.*)\*$/, "$1");
      return { type: "quote", segments: inlineSegments(text) };
    }
    return { type: "text", segments: inlineSegments(line) };
  });
}

// Classify unified diff lines for the changes view.
export function diffLines(patch) {
  if (!patch) return [];
  return patch.split("\n").map((line) => {
    let type = "context";
    if (line.startsWith("@@")) type = "hunk";
    else if (line.startsWith("+")) type = "add";
    else if (line.startsWith("-")) type = "del";
    return { type, text: line };
  });
}

// Group review units under their breadcrumb chain for the sidebar.
export function unitSections(units) {
  const sections = [];
  const byKey = new Map();
  for (const unit of units) {
    const key = unit.breadcrumbs.join("");
    if (!byKey.has(key)) {
      byKey.set(key, {
        key,
        title: unit.breadcrumbs[unit.breadcrumbs.length - 1] || "Library",
        depth: unit.breadcrumbs.length,
        units: [],
      });
      sections.push(byKey.get(key));
    }
    byKey.get(key).units.push(unit);
  }
  return sections;
}

export const CHANGE_LABELS = { added: "+", modified: "~", removed: "−", renamed: "→" };
export const KIND_LABELS = {
  theme: "Theme",
  learning_path: "Learning path",
  lesson: "Lesson",
  card: "Card",
  question: "Question",
};
