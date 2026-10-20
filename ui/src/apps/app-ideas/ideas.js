// Loads every idea markdown file in ./ideas and parses its frontmatter.
//
// File format (one idea per file):
//   ---
//   name: Draft Deck
//   tagline: Play Constraint Cards, Ship an Atomic Essay
//   domains: [WRITE, GAME]
//   date: 2026-10-20
//   issue: 56            (optional, set for ideas migrated from GitHub issues)
//   ---
//   <markdown body>
//
// Filenames: NNN-slug.md for migrated issues, YYYY-MM-DD-slug.md for new ideas.

import { parseFrontmatter } from './frontmatter.js';

const files = import.meta.glob('./ideas/*.md', { query: '?raw', import: 'default', eager: true });

const DOMAIN_TAGS = ['PROD', 'SPORT', 'HIST', '3D', 'GAME', 'LEARN', 'WRITE', 'MEDIA'];

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

export const ideas = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug: slugFromPath(path),
      name: meta.name || slugFromPath(path),
      tagline: meta.tagline || '',
      domains: Array.isArray(meta.domains) ? meta.domains : [],
      date: meta.date || '',
      issue: typeof meta.issue === 'number' ? meta.issue : null,
      body,
    };
  })
  .sort((a, b) => (b.date + String(b.issue || '')).localeCompare(a.date + String(a.issue || '')));

export const usedDomains = DOMAIN_TAGS.filter((tag) => ideas.some((idea) => idea.domains.includes(tag)));
