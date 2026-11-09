// Undo of a category move restores the exact category set the object had
// before the move. The API couples some categories server-side (enabling any
// category other than Inbox takes the object out of the Inbox; Inbox and
// Archive are mutually exclusive), so the restore is planned as ordered
// steps: every removal first, then every addition. Removal-first means an
// exclusive pair (Inbox/Archive) is never left with both enabled, and
// enabling Inbox or Archive last cannot wipe a category the plan also adds.
// A removal of a category that is already gone is a harmless no-op in the
// API, so the plan stays valid as steps land one by one.
export function planUndo(before, current) {
  const target = new Set(before);
  const now = new Set(current);
  const removals = [...now].filter(slug => !target.has(slug)).map(slug => ({ slug, enabled: false }));
  const additions = [...target].filter(slug => !now.has(slug)).map(slug => ({ slug, enabled: true }));
  return [...removals, ...additions];
}
