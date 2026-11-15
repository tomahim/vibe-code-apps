// Five landscape families for the garden family preview: the proposed grouping from the
// 2026-11-15 palette studies, rendered with the real garden scene in the Compact + focus
// layout. Art direction only - layout, spacing, camera and controls are unchanged; only
// ground palette, planting and one landmark per theme change. The grouping is a proposal.
import { THEMES } from './shape-data.js';

const idx = (id) => THEMES.findIndex((t) => t.id === id);

// Four hexes per family in a small diamond, same spacing as the compact overview.
const SLOTS4 = [[0, 0], [1, 0], [0, 1], [1, -1]];
export const FAMILY_GROUPS = [
  { id: 'forest', name: 'Forest', blurb: 'Dense and shaded. The one family where planting fills the hex.', themes: ['nature', 'biology', 'languages', 'health'].map(idx), center: [-7, -4.6], slots: SLOTS4 },
  { id: 'prairie', name: 'Prairie', blurb: 'Quiet fields: warm golds and sages, bloom drifts, open ground.', themes: ['art', 'cooking', 'economics', 'mind'].map(idx), center: [7, -4.6], slots: SLOTS4 },
  { id: 'mountains', name: 'Mountains', blurb: 'Snow, stone and restrained evergreens. The terrain does the talking.', themes: ['sport', 'climate', 'space', 'mathematics'].map(idx), center: [-7.6, 3.4], slots: SLOTS4 },
  { id: 'oceans', name: 'Oceans', blurb: 'Water and coral. Growth is coral spreading, not trees.', themes: ['ocean', 'technology', 'music', 'engineering'].map(idx), center: [7.6, 3.4], slots: SLOTS4 },
  { id: 'desert', name: 'Desert', blurb: 'Warm stone. The sparsest family; a single shape carries the hex.', themes: ['geology', 'physics', 'chemistry', 'history'].map(idx), center: [0, 9.8], slots: SLOTS4 },
];

export const FAMILY_CENTERS = Array.from({ length: THEMES.length });
FAMILY_GROUPS.forEach((g) => g.themes.forEach((ti, k) => {
  const [q, r] = g.slots[k];
  FAMILY_CENTERS[ti] = [g.center[0] + 2.65 * (q + r / 2), g.center[1] + 2.65 * Math.sqrt(3) / 2 * r];
}));

// Per-theme art direction. ground overrides the slab/cell palette; mix overrides the
// planting mix; sheet adds a surface (lagoon/river/raked rings); landmark is the single
// off-center signature object; plantMul/grassMul scale density (family property).
const STYLES = {
  // Forest - four greens, each with its own value and accent. Dense.
  nature: { mix: { sig: ['tree', 'forestTree', 'tree'], mid: ['fern', 'bush', 'fern'], low: ['mushroom', 'fern', 'rock'], lesson: 'tree', flower: 'flowerPink' }, plantMul: 1.7, grassMul: 1.1, landmark: { name: 'tree', s: 1.9, dx: -0.95, dz: 0.55 } },
  biology: { ground: { top: '#3f8a5c', top2: '#2f7a4c' }, mix: { sig: ['emergentTree', 'forestTree', 'tree'], mid: ['fern', 'fern', 'flowerPink'], low: ['flowerPink', 'mushroom', 'fern'], lesson: 'emergentTree', flower: 'flowerPink' }, plantMul: 1.85, grassMul: 1.15, landmark: { name: 'emergentTree', s: 2.0, dx: 0.85, dz: -0.6 } },
  languages: { ground: { top: '#8fbf63', top2: '#7aae55' }, mix: { sig: ['blossomTree', 'tree', 'blossomTree'], mid: ['bush', 'herbBush', 'flowerWhite'], low: ['flowerPink', 'flowerWhite', 'flowerYellow'], lesson: 'blossomTree', flower: 'flowerPink' }, plantMul: 1.5, grassMul: 1.1, landmark: { name: 'blossomTree', s: 1.7, dx: -0.8, dz: -0.7 } },
  health: { ground: { top: '#9cbf7a', top2: '#8aae69' }, mix: { sig: ['blossomTree', 'appleTree'], mid: ['herbBush', 'bush', 'flowerWhite'], low: ['flowerWhite', 'flowerYellow', 'flowerPink'], lesson: 'appleTree', flower: 'flowerWhite' }, plantMul: 1.45, grassMul: 1.05, landmark: { name: 'blossomTree', s: 1.55, dx: 0.9, dz: 0.65 } },
  // Prairie - open ground carried furthest; blooms in drifts.
  art: { ground: { top: '#c4a86f', top2: '#b2965e' }, mix: { sig: ['sunflower'], mid: ['lavender', 'flowerOrange', 'flowerBlue'], low: ['flowerPink', 'flowerOrange', 'flowerBlue', 'flowerYellow'], lesson: 'sunflower', flower: 'flowerOrange' }, plantMul: 0.9, grassMul: 1.25, grassTint: '#c9ab63', landmark: { name: 'sunflower', s: 1.8, dx: -0.9, dz: 0.6 } },
  cooking: { ground: { top: '#b0a45f', top2: '#9d9350' }, mix: { sig: ['oliveTree'], mid: ['herbBush', 'wheat', 'carrot'], low: ['carrot', 'carrot', 'flowerWhite'], lesson: 'oliveTree', flower: 'flowerWhite' }, plantMul: 0.9, grassMul: 1.1, grassTint: '#b3a556', landmark: { name: 'oliveTree', s: 1.7, dx: 0.85, dz: -0.55 } },
  economics: { ground: { top: '#cbb26a', top2: '#b8a05a' }, mix: { sig: ['wheat', 'wheat'], mid: ['wheat', 'sunflower', 'wheat'], low: ['wheat', 'flowerOrange', 'flowerYellow'], lesson: 'wheat', flower: 'flowerOrange' }, plantMul: 1.0, grassMul: 1.35, grassTint: '#d8b85a', landmark: { name: 'windmill', s: 1.9, dx: -0.85, dz: -0.6 } },
  mind: { ground: { top: '#c9bd97', top2: '#b8ab84' }, noPonds: true, mix: { sig: ['standingStone'], mid: ['bush', 'rock'], low: ['pebble', 'rock', 'flowerWhite'], lesson: 'standingStone', flower: 'flowerWhite' }, plantMul: 0.4, grassMul: 0.35, grassTint: '#bdae85', sheet: { type: 'rings' }, landmark: { name: 'standingStone', s: 1.6, dx: 0.55, dz: 0.4 } },
  // Mountains - snow, stone, sparse evergreens.
  sport: { ground: { top: '#e6ecec', top2: '#ccd8d2' }, mix: { sig: ['snowPine', 'snowPine'], mid: ['rock', 'snowPine', 'bush'], low: ['flowerWhite', 'rock', 'flowerBlue'], lesson: 'snowPine', flower: 'flowerWhite' }, plantMul: 0.6, grassMul: 0.4, grassTint: '#dfe8df', landmark: { name: 'snowPine', s: 1.9, dx: 0.85, dz: -0.6 } },
  climate: { ground: { top: '#d8e6ee', top2: '#bdd2de' }, mix: { sig: ['iceberg', 'snowPine'], mid: ['rock', 'snowPine', 'rock'], low: ['rock', 'pebble', 'flowerWhite'], lesson: 'iceberg', flower: 'flowerWhite' }, plantMul: 0.5, grassMul: 0.3, grassTint: '#d5e2e8', landmark: { name: 'iceberg', s: 2.0, dx: -0.85, dz: 0.55 } },
  space: { ground: { top: '#a08bb0', top2: '#8d789c' }, mix: { sig: ['observatory'], mid: ['rock', 'bush', 'rock'], low: ['pebble', 'flowerWhite', 'rock'], lesson: 'observatory', flower: 'flowerWhite' }, plantMul: 0.45, grassMul: 0.25, grassTint: '#9c8bac', landmark: { name: 'observatory', s: 1.8, dx: 0.8, dz: -0.55 } },
  mathematics: { ground: { top: '#a4c76a', top2: '#93b55b' }, mix: { sig: ['terraces', 'tree'], mid: ['bush', 'flowerYellow', 'bush'], low: ['flowerWhite', 'rock', 'flowerYellow'], lesson: 'terraces', flower: 'flowerYellow' }, plantMul: 0.65, grassMul: 0.8, landmark: { name: 'terraces', s: 1.9, dx: -0.85, dz: -0.6 } },
  // Oceans - water is the family glue; growth is coral and reeds.
  ocean: { ground: { top: '#e6d9ae', top2: '#d6c895' }, noPonds: true, mix: { sig: ['coralHead', 'coralHead'], mid: ['coralHead', 'reed', 'coralHead'], low: ['pebble', 'coralHead', 'flowerBlue'], lesson: 'coralHead', flower: 'flowerBlue' }, plantMul: 1.1, grassMul: 0, sheet: { type: 'water', color: '#6fbccb', r: 2.92 }, landmark: { name: 'coralHead', s: 2.2, dx: -0.8, dz: 0.6 } },
  technology: { ground: { top: '#6f9a8a', top2: '#5d8878' }, mix: { sig: ['mangrove'], mid: ['reed', 'fern', 'reed'], low: ['reed', 'flowerWhite', 'pebble'], lesson: 'mangrove', flower: 'flowerWhite' }, plantMul: 0.75, grassMul: 0.5, grassTint: '#6b9585', sheet: { type: 'water', color: '#5f9a94', r: 1.9, dx: 0.9, dz: 0.8 }, landmark: { name: 'mangrove', s: 1.9, dx: -0.75, dz: -0.55 } },
  music: { ground: { top: '#97b06a', top2: '#86a05a' }, mix: { sig: ['blossomTree', 'reed'], mid: ['reed', 'flowerBlue', 'bush'], low: ['flowerBlue', 'flowerWhite', 'reed'], lesson: 'blossomTree', flower: 'flowerBlue' }, plantMul: 0.8, grassMul: 0.9, sheet: { type: 'river', color: '#7fc0d8' }, landmark: { name: 'blossomTree', s: 1.6, dx: 0.85, dz: 0.6 } },
  engineering: { ground: { top: '#8b9aa4', top2: '#77879a' }, mix: { sig: ['basaltColumns'], mid: ['rock', 'bush', 'rock'], low: ['pebble', 'rock', 'flowerYellow'], lesson: 'basaltColumns', flower: 'flowerYellow' }, plantMul: 0.55, grassMul: 0.35, grassTint: '#8b98a2', sheet: { type: 'water', color: '#5f7f8c', r: 1.6, dx: -1.1, dz: 0.9 }, landmark: { name: 'basaltColumns', s: 1.9, dx: 0.85, dz: -0.5 } },
  // Desert - emptiness is the aesthetic.
  geology: { ground: { top: '#d89a6a', top2: '#c98658' }, mix: { sig: ['hoodoo', 'cactus'], mid: ['agave', 'redRock', 'agave'], low: ['flowerOrange', 'redRock', 'pebble'], lesson: 'hoodoo', flower: 'flowerOrange' }, plantMul: 0.5, grassMul: 0.35, grassTint: '#c9986a', landmark: { name: 'hoodoo', s: 2.0, dx: -0.85, dz: 0.55 } },
  physics: { ground: { top: '#a05a42', top2: '#8a4a36' }, mix: { sig: ['volcanicVent', 'redRock'], mid: ['redRock', 'agave', 'redRock'], low: ['redRock', 'pebble', 'flowerOrange'], lesson: 'volcanicVent', flower: 'flowerOrange' }, plantMul: 0.45, grassMul: 0.25, grassTint: '#9a6248', landmark: { name: 'volcanicVent', s: 2.0, dx: 0.8, dz: -0.6 } },
  chemistry: { ground: { top: '#ded3b0', top2: '#cdc09c' }, mix: { sig: ['crystalCluster'], mid: ['agave', 'pebble', 'agave'], low: ['pebble', 'flowerWhite', 'agave'], lesson: 'crystalCluster', flower: 'flowerWhite' }, plantMul: 0.45, grassMul: 0.3, grassTint: '#d6c9a4', landmark: { name: 'crystalCluster', s: 1.9, dx: -0.8, dz: -0.6 } },
  history: { ground: { top: '#c9b183', top2: '#b89f73' }, mix: { sig: ['ruinColumn', 'tree'], mid: ['bush', 'agave', 'bush'], low: ['pebble', 'flowerYellow', 'rock'], lesson: 'ruinColumn', flower: 'flowerYellow' }, plantMul: 0.5, grassMul: 0.4, grassTint: '#c2ab7d', landmark: { name: 'ruinColumn', s: 1.8, dx: 0.85, dz: 0.6 } },
};

export const familyStyle = (ti) => STYLES[THEMES[ti].id] || null;
export const familyOf = (ti) => FAMILY_GROUPS.findIndex((g) => g.themes.includes(ti));

export const FAMILY_WORLD = { groups: FAMILY_GROUPS, centers: FAMILY_CENTERS, styleOf: familyStyle, noun: 'family' };
