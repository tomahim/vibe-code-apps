# Learning-first low-poly navigation studies

Two artifact-only variants share the same small Three.js renderer and canonical twenty-theme inventory:

- Low-poly tour: five worlds with four themes, controlled horizontal swipe/arrows in the overview. Choosing a theme hides the other territories and opens a slightly richer low-poly scene.
- Low-poly map: all twenty themes on one open-ground scene. Drag, wheel/pinch or the zoom controls to explore and choose a territory. The theme view returns to that same map position and zoom.

The visual treatment borrows the existing learning-garden's warm paper palette, terracotta accent, serif theme names, spaced hex territories and low-poly trees. Scenery is deliberately secondary to labels. Theme interiors add a house, bridge, river, a few trees/rocks and a clear trail of lesson-layout placeholders. There is no lesson content, recorded progress, app data or production-app integration. The five lesson slots illustrate layout only, not an actual lesson count.

Both variants use 3D geometry on open ground rather than a rectangular background image. Territory gaps remain visible. The finite twenty-theme inventory is not an infinite content promise; the ground has no visible board frame or image edge. Theme view pan/zoom is bounded, while the full map has a wider exploration range.

## Build and performance

From `ui`, run `node scripts/build-lowpoly-tour.mjs`. This extracts only group/theme keys from the existing artifact and writes a small data entry beside the shared renderer and HTML. No textures, external image requests or model downloads are needed. The variants load only when selected and unload when leaving their tab. The shared engine is cached across both variants. Existing illustration and 3D comparisons remain unchanged.

The measured initial map uses about 154 draw calls and 5,299 triangles. Each theme has a distinct simple geometric landmark, such as a ringed planet, sailboat, goal, book, pot or crane. These are local structural measurements, not frame-rate guarantees. Rendering uses a 1.5 pixel-ratio cap and a single 1024px shadow map. Reduced motion freezes ambient bird motion and removes the world glide. No paid assets or infrastructure changes.

## Verification

Run `npm test` and `npm run build`. Inspect the actual embedded artifact on desktop and phone: all five worlds, all twenty theme labels, lesson-placeholder readability, no label overlap, swipe limits, theme entry/back, pan/zoom bounds, reset and reduced motion. Check both mouse and native two-touch pinch. Confirm lazy entry and iframe unload for both tabs.
