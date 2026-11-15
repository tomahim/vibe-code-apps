# Low-poly ecosystem landscape studies

Two artifact-only variants share the canonical twenty-theme inventory:

- Low-poly tour: five groups of four neighbouring landscapes. Swipe/arrows move between groups; a territory opens its interior.
- Low-poly map: twenty ecosystems form one irregular shared-edge terrain mosaic. Narrow inset seams retain their boundaries. Drag, pinch/wheel and zoom controls explore the map; tapping terrain enters a theme. Phone map names appear after zooming so labels do not blanket the scenery.

The scenes follow the Simple visual rows of the twenty-theme Notion comparison catalog: layered forest canopies and clearings, coral lagoon, glacier, desert plateau, stratified mesa, geothermal field, crystal cavern, alpine massif, seasonal garden, raked-sand garden, farm terraces, cottage garden, wildflower prairie, waterfall gorge, antiquity coast, mangroves, basalt coast, rice terraces and grain fields. These are procedural 3D interpretations, not image-identical reproductions of the concept illustrations.

`territories.js` clips a shared polygon against Voronoi bisectors. Adjacent cells reuse the same border before a small inset. The layouts have no regular-hex/grid selector arrangement. `scenes.js` provides flat-shaded props, seeded planted ground layers, topographic masses and vertex-coloured faceted ground. Decorative geometry is merged to reduce draw calls.

Named scenery objects remain lesson spots. Interior chips track their exact object anchors, with leader lines when labels move for readability. Chips avoid one another and the header/control area. Tapping a chip opens an explicitly labelled layout placeholder. No real lessons, personal progress, API calls, app data or production-app integration.

A shared ten-state slider and autoplay preview growth in both variants. Every transition interpolates continuously with smoothstep easing over 1.9 seconds; entering a theme grows it into the currently selected state. Reduced motion snaps immediately and freezes ambient motion.

## Build and verification

From `ui`, run `node scripts/build-lowpoly-tour.mjs`, `npm test`, and `npm run build`. Assets are local geometry only, with no textures, downloaded models or runtime network requests. Only selected tabs load their renderer; leaving unloads the iframe.

Checks include all twenty interiors in both modes at 390px, canonical group headings, lesson-chip collision/screen bounds, stage extremes and intermediate fractional stages, terrain picking, mouse drag, native two-touch pinch, reset/back, placeholder cards, embedded desktop/phone layout, reduced motion and lazy iframe unload.

The local software-renderer map measurement after batching is roughly 480 draw calls / 163k triangles at full growth. Real-device FPS is not measured. The richer geometry is an intentional quality trade-off, not a performance guarantee. Rendering caps DPR at 1.5 and uses one 2048px shadow map. No paid assets or infrastructure changes.

## Controlled theme-shape comparison

The separate Little Grains shapes tab renders the full twenty-theme catalog on an open-ended spiral, with 3-5 invented sample paths per theme. The six views share the same demo timeline and preserve theme/path, camera and target. Initial demo week 16 shows every sample path fully grown; move the timeline back to preview growth.

The fresh-land scene baseline was checked against the current garden implementation: matching land species, geometry, seeded plant/grass scatter, lighting profiles and growth thresholds. This isolated demo carries the current minimum seedlings and next-lesson marker. It does not reproduce current account progress, live lesson UI, seasons or underwater themes. No live data or account integration.

Only outer theme slab/hover geometry changes between the four modes: regular hexes, path footprints (the union of the original path-cell positions, with an outer margin, a faceted top, bevel and matching soil strata), interlocking puzzle territories (each footprint dilated and clipped on neighbour bisectors with a visible seam, so shapes fit together without touching), and the same territories grouped into the five catalog worlds with swipe, arrow and keyboard navigation that blurs the other worlds. Path cells, lesson trail platform, planted scenery and progress remain fixed. The original older public sample renderer is untouched. Reduced motion snaps growth immediately. Demo controls are not production-app changes.


The compact studies add one planted hexagon per theme, with path hexagons hidden until theme entry. Four related five-theme constellations use different local silhouettes and uneven spacing: Earth & cosmos, Life & wellbeing, Science & making, Culture & society. Compact + focus adds swipe/arrow navigation and depth-based selective Gaussian blur. Interlocking focus keeps the original five catalog worlds. Focus framing fits terrain and plant-height bounds into the viewport left clear by controls and panels. Full-growth verification waits for growthReady(), not only camera readiness.
