# Little Grains garden artifact

Source for `src/artifacts/2026-10-28-little-grains-garden.html`. Rebuild with `node scripts/artifacts/little-grains/build.mjs` (esbuild bundles the three.js scene into one self-contained HTML file, no network).

- Garden: one hexagon per theme, instanced plants, wind grass, butterflies.
- Theme: one hexagon per learning path.
- Path: successive hex tiles (one per lesson) with a dot per card; plants grow with fake progress (week slider, Water).
- Desktop tab is detailed with shadows. Mobile tab is low-poly without shadows. Both lazy-create and dispose their scene.
- Navigation: drag/one finger pans, wheel/touchpad scrolls, ctrl+wheel/pinch zooms, right-drag/two fingers rotate, arrow keys, +/-.
- All data is sample data.
