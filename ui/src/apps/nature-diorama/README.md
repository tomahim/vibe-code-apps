# Nature layered diorama

A standalone, full-viewport artifact at `/artifacts/2026-11-15-nature-layered-diorama`.

Build the local bundle with `node scripts/build-nature-diorama.mjs` from `ui/`. This embeds existing botanical alpha artwork and water texture as data URLs so WebGL textures also load in the gallery's opaque sandbox. There are no remote dependencies or new generated paintings.

## Composition and controls

- Explicit overview -> Enter Nature -> three lesson destinations -> Leave Nature.
- Simple ground, pond, paths and tree-trunk geometry, with independently depth-placed foliage, flower, fern, log, mushroom, pine and mossy-rock artwork.
- A bounded front-facing camera moves gently between destinations. Drag to drift, pinch/wheel or +/- to zoom only the world. The DOM controls stay fixed. Whole clearing resets the view; lesson buttons remain reachable even when a marker is outside the viewport.
- Shared ten-step growth control, unequal added-planting density curves. State 1 has zero added pieces; state 5 is 80% / 37% / 0%; state 10 is full. Permanent trees, old trunk, rocks and scenery stay fixed. No saved learning state.
- Repeated cards are instanced and trunk geometry merged. Decorative rendering is capped at 30fps and paused while hidden. Reduced motion removes camera easing and moving water.

## Limits

This is a simpler newly assembled clearing, not a recreation matching the earlier painting's art quality. Most foliage and mossy rocks are flat cutouts, so there is no free orbit. Soft contact shadows are approximate. Tree-age growth stages and real-phone hardware performance are not proven. The study tests depth, scene-only camera controls and independent lesson planting, rather than claiming a production performance result.

The existing multi-variant ecosystem artifact and its unfinished-growth notices are preserved. No additional artwork generation is scheduled by this change.
