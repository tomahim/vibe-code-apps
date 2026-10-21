// Star ratings (1-3) decide which view an idea belongs to. No rating = Inbox.
// The rating lives only in each idea's md frontmatter (`rating: 1|2|3`).
import { createdAt } from './sort.js';

export const VIEWS = ['inbox', 'improve', 'promising', 'archive'];

// Cap on 2-star ideas ("good but lacks something"). When full, one must be
// promoted to 3 or dropped to 1 before another idea can become a 2.
export const TWO_STAR_LIMIT = 30;

export function validRating(value) {
  return value === 1 || value === 2 || value === 3 ? value : 0;
}

export function viewOf(rating) {
  const r = validRating(rating);
  if (r === 0) return 'inbox';
  if (r === 1) return 'archive';
  return r === 2 ? 'improve' : 'promising';
}

// Inbox, Improve and Archive: newest first. Promising (3 stars only): newest first.
export function sortForView(list, view) {
  return [...list].sort((a, b) =>
    (view === 'promising' ? validRating(b.rating) - validRating(a.rating) : 0)
    || createdAt(b) - createdAt(a)
    || (b.issue || 0) - (a.issue || 0)
    || b.slug.localeCompare(a.slug));
}
