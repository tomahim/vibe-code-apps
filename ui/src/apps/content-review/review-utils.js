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

// Kinds the quick editor can commit (mirrors the api's editable fields).
export const EDITABLE_KINDS = ["card", "lesson", "learning_path", "question"];

export function canEdit(unit) {
  return (
    EDITABLE_KINDS.includes(unit.kind) &&
    unit.change !== "removed" &&
    !unit.parse_error &&
    (unit.kind !== "question" || (unit.question && unit.question.options.length === 4))
  );
}

// Form state for a unit, one entry per editable field.
export function draftFromUnit(unit) {
  if (unit.kind === "question") {
    const q = unit.question;
    return {
      prompt: q.prompt,
      options: q.options.map((option) => ({ id: option.id, text: option.text })),
      answer: q.answer,
      explanation: q.explanation,
    };
  }
  const draft = { title: unit.title || "", body: unit.body || "" };
  if (unit.kind === "lesson" || unit.kind === "learning_path") draft.description = unit.description || "";
  return draft;
}

// Only the fields the reviewer actually changed, in the api's payload shape.
// Empty result means nothing to save.
export function editChanges(unit, draft) {
  const before = draftFromUnit(unit);
  const changes = {};
  if (unit.kind === "question") {
    if (draft.prompt.trim() !== before.prompt.trim()) changes.prompt = draft.prompt;
    if (draft.explanation.trim() !== before.explanation.trim()) changes.explanation = draft.explanation;
    if (draft.options.some((option, i) => option.text.trim() !== before.options[i].text.trim()))
      changes.choices = draft.options;
    if (draft.answer !== before.answer) changes.correct_choice_id = draft.answer;
    return changes;
  }
  for (const key of Object.keys(before)) {
    if ((draft[key] || "").trim() !== before[key].trim()) changes[key] = draft[key];
  }
  return changes;
}

// Merge the api's freshly parsed unit into the loaded one (keeps breadcrumbs,
// change status and the diff, which is refreshed by a reload).
export function mergeSavedUnit(unit, saved) {
  return {
    ...unit,
    title: saved.title,
    description: saved.description,
    body: saved.body,
    question: saved.question,
    parse_error: saved.parse_error,
  };
}
