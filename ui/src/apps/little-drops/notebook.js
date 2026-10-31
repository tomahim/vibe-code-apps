import { stops, sources } from './content.js';
export function notebookMarkdown(ids) {
  const opened = stops.filter(s => ids.includes(s.id));
  return [
    '# Little Drops - pocket notebook',
    '',
    `${opened.length} of ${stops.length} discoveries opened.`,
    '',
    'A fictional reservoir-to-tap journey. Illustrative, not a water-safety test or engineering guide.',
    '',
    ...opened.flatMap(s => [
      `## ${s.title}`, '', s.text, '', s.detail, '',
      `Source: [${sources[s.source].label}](${sources[s.source].url})`, '',
    ]),
    '---',
    'Exported from the discoveries opened in this browser. No account or cloud sync.',
    '',
  ].join('\n');
}
