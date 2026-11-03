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
