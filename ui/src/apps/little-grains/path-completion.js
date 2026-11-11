// Completion is server-owned (#465): the API's progress.completed flag
// decides, the frontend never recomputes it from card counts. The backend
// rule is every card read, independent of question results - questions are
// practice that continues in the quiz, the gauge and the mastery badges.
export function pathFinished(path) {
  return !!path?.progress?.completed;
}

function describe(path) {
  return { id: path.id, title: path.title, lessons: path.progress?.lessons_total };
}

// Every finished path in a snapshot, for the one-time catch-up: a path
// finished before its celebration could run still deserves its moment.
// The caller persists the ids it has shown, so each path blooms once.
export function finishedPaths(current) {
  return (current?.themes || []).flatMap(theme => (theme.learning_paths || [])
    .filter(pathFinished)
    .map(describe));
}

// Only celebrate a transition seen during this visit. Replay, newly
// published and already-finished paths must never announce a new reward.
export function newlyCompletedPaths(previous, current) {
  if (!previous) return [];
  const before = new Map((previous.themes || []).flatMap(theme =>
    (theme.learning_paths || []).map(path => [path.id, path.progress ? pathFinished(path) : undefined])));
  return finishedPaths(current).filter(path => before.get(path.id) === false);
}
