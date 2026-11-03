// Fisher-Yates shuffle on a copy. Multiple-choice options arrive in
// authored order, where the first choice is the correct one more often
// than chance, so the reader and the quiz display them shuffled.
export function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Shuffle once per question id and keep that order for the session. The
// reader refetches the lesson after a correct answer, so keying the shuffle
// on the re-fetched question object reshuffles the options on screen right
// when the feedback appears.
export function stableShuffler(random = Math.random) {
  const cache = new Map();
  return (question) => {
    if (!question) return [];
    let options = cache.get(question.id);
    if (!options) {
      options = shuffled(question.options ?? [], random);
      cache.set(question.id, options);
    }
    return options;
  };
}
