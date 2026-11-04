// Only celebrate a transition seen during this visit. Initial loading, replay
// and newly published/already-finished paths must never announce a new reward.
export function newlyCompletedPaths(previous, current) {
  if (!previous) return [];
  const before = new Map((previous.themes || []).flatMap(theme =>
    (theme.learning_paths || []).map(path => [path.id, path.progress?.completed])));
  return (current.themes || []).flatMap(theme => (theme.learning_paths || [])
    .filter(path => before.get(path.id) === false && path.progress?.completed === true)
    .map(path => ({ id: path.id, title: path.title, lessons: path.progress.lessons_total })));
}
