# Learning-first low-poly navigation studies

Two artifact-only variants share the same small Three.js renderer and canonical twenty-theme inventory:

- Low-poly tour: five worlds with four themes, controlled horizontal swipe/arrows in the overview. Choosing a theme hides the other territories and opens a slightly richer low-poly scene.
- Low-poly map: all twenty themes on one open-ground scene. Drag, wheel/pinch or the zoom controls to explore and choose a territory. The theme view returns to that same map position and zoom.

The scenes follow the simple direction of the 20-theme low-poly design catalog: one calm ecosystem per theme on a cream hex territory (oak and deer for Nature, observatory dome and crater for Space, cottage, pond and terracotta pot for Languages, and so on). The terracotta accent, serif names and spaced hex territories carry over from the learning garden.

Each scenery element can be a lesson spot (a tree, an animal, a rock, a pond). Spots show a small terracotta marker; inside a theme each one has a small name chip, and tapping it opens a short card. Scenes are data in `scenes.js` (kind, position, size, stage it appears at, optional spot name). There is no lesson content, recorded progress, app data or production-app integration; the cards say so.

A ten-stage growth slider (with play) sits in both tabs. Elements appear at their stage and grow to full size three stages later while the ground colour fills in, so each theme can be watched growing from bare ground to fully grown. The stage is shared by the overview, the map and the theme interior.

Both variants use 3D geometry on open ground rather than a rectangular background image. Territory gaps remain visible. The finite twenty-theme inventory is not an infinite content promise; the ground has no visible board frame or image edge. Theme view pan/zoom is bounded, while the full map has a wider exploration range.

## Build and performance

From `ui`, run `node scripts/build-lowpoly-tour.mjs`. This extracts only group/theme keys from the existing artifact and writes a small data entry beside the shared renderer and HTML. No textures, external image requests or model downloads are needed. The variants load only when selected and unload when leaving their tab. The shared engine is cached across both variants. Existing illustration and 3D comparisons remain unchanged.

Measured locally in headless Chrome (software GL) at full growth: the open map starts at about 740 draw calls and 14,000 triangles, a tour overview at about 150 calls and 2,600 triangles, a theme interior at about 60 calls and 1,000 triangles. These are local structural measurements, not frame-rate guarantees. Rendering uses a 1.5 pixel-ratio cap and a single 1024px shadow map. Reduced motion freezes ambient bird motion and removes the world glide. No paid assets or infrastructure changes.

## Verification

Run `npm test` and `npm run build`. Inspect the actual embedded artifact on desktop and phone: all five worlds, all twenty theme labels, lesson-placeholder readability, no label overlap, swipe limits, theme entry/back, pan/zoom bounds, reset and reduced motion. Check both mouse and native two-touch pinch. Confirm lazy entry and iframe unload for both tabs.
