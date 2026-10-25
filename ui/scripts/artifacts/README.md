# Maison des heures

The gallery artifact remains a single offline HTML file and matching metadata, per `src/artifacts/README.md`. Its editable source lives here so the bundled Three.js runtime does not make future changes difficult.

```sh
cd ui
node scripts/artifacts/build-maison.mjs
npm run build
PLAYWRIGHT_CHROME_PATH=/usr/bin/google-chrome npx playwright test tests/browser/maison-des-heures.spec.js tests/browser/maison-views.spec.js
```

`maison-des-heures.js` creates the geometry, materials, resident animations, camera and interactions. `maison-des-heures.template.html` owns layout and controls. The build uses the existing pinned Three.js and esbuild dependencies; no new dependencies or network assets are introduced. The generated HTML bundles the runtime and preserves its license notice.

The original five-floor building and its furniture are modeled procedurally. The visual and exploration reference is [Jav's Modular Habitat video](https://x.com/javpixel_art/status/2114189150597304680), not a model or code source. Characters use small procedural arm/body movements, not motion capture or inverse kinematics. This is an architectural toy, not a structural or construction model. Facade mode adds the front mullion/rail framework; it is intentionally not an opaque exterior that would conceal the interior.

All scene state is in memory inside the opaque-origin gallery sandbox. No storage, backend, remote fonts, images, analytics or external runtime is used. The source credit is the only external link.

Accessibility: labeled floor/room/zoom controls, keyboard focus, keys 1-5 for floors, Escape/0 for the house, left/right for orbit, +/- for zoom, and reduced-motion startup (life animation paused and camera transitions immediate). Controls remain available without precision clicking on geometry. Pinch and drag are handled by OrbitControls. Repeatedly selecting a room returns to the whole floor.

Rendering: static meshes are merged by material within each room; renderer pixel ratio is capped at 1.75. The whole-house view is about 52,000 triangles and 270 draw calls, including animated residents. WebGL failure gets a readable fallback. Software-rendered screenshots validate layout and appearance, not real-device frame rate. Local browser tests are not evidence that the private Railway deployment is reachable.
