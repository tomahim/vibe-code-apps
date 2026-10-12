# Three.js learning path

Open `/apps/threejs-learning-path`. The course contains 60 lessons in 12 ordered chapters, each estimated at 2–3 minutes. It assumes basic JavaScript and starts with no 3D prerequisites. All lessons are available to revisit or skip to; completion requires a running scene check and a correct concept answer.

## Add or change lessons

Each chapter is a JSON file in `lessons/`. `catalog.js` discovers **every `lessons/*.json` file** with Vite's `import.meta.glob`, sorts by `order`, and derives navigation, progress totals, search, and the overview. Add a lesson to a chapter's `lessons` array or add a new chapter file. No component changes or manual import list are needed. Rebuild/redeploy to publish static content changes.

Keep IDs stable: bookmarks, drafts, answers, and completion use lesson IDs, not list positions. Reordering a lesson preserves progress. Deleted lesson IDs are ignored on the next load. Use a new ID for a replacement exercise when its old completion should not carry over.

```json
{
  "id": "my-chapter",
  "order": 13,
  "title": "More experiments",
  "subtitle": "Keep exploring your 3D world.",
  "lessons": [
    {
      "id": "mint-background",
      "title": "A mint canvas",
      "minutes": 2,
      "concept": "Scene backgrounds",
      "body": [
        "The scene background can be a solid color. This does not add a mesh or change your lighting.",
        "Change the color below and watch the preview update."
      ],
      "task": "Set the background to #a9e8ce.",
      "hint": "Replace the existing hex color string.",
      "code": "scene.background = new THREE.Color('#10141f');\n",
      "solution": "scene.background = new THREE.Color('#a9e8ce');\n",
      "check": "scene.background.getHexString() === 'a9e8ce'",
      "quiz": {
        "question": "Does a background color add a mesh?",
        "options": ["Yes", "No"],
        "answer": 1,
        "explanation": "A solid background is a scene property, separate from geometry."
      },
      "reference": {
        "label": "Three.js Scene documentation",
        "url": "https://threejs.org/docs/pages/Scene.html"
      }
    }
  ]
}
```

`body` is an array of plain-text paragraphs rendered by React, not HTML or Markdown. `code` and `solution` are complete, independent lesson snippets. `quiz.answer` is zero-based. `check` is a JavaScript boolean expression evaluated in the same lexical scope as the snippet, so it can reference its local variables. Keep checks read-only. Test actual scene state where possible, rather than matching source strings. Interactive checks can require an event and are latched once achieved for that run, so moving to the completion button does not erase a successful hover. Editing or rerunning clears that latch.

Content is trusted repository code, not a user-uploaded executable format. An author should validate new checks, starter code, solutions, and educational claims before publishing.

## Runtime API

Each run creates a fresh scene, perspective camera, renderer, and controls. Lessons provide their own meshes, lights, and helpers. Code executes inside an async function, so top-level `await` is supported; static `import` statements are not. The workspace provides:

| Name | Description |
| --- | --- |
| `THREE` | Pinned Three.js r180 module namespace. |
| `scene` | Empty `THREE.Scene`. |
| `camera` | `PerspectiveCamera(45, aspect, 0.1, 100)` positioned at `(4, 3, 6)`. |
| `renderer` | WebGL2 renderer, responsive size, sRGB output, pixel ratio capped at 2 initially. |
| `controls` | OrbitControls, with damping and automatic per-frame updates. |
| `onFrame(fn)` | Register `fn({ elapsed, delta })`, in seconds, before each render. Delta is capped at 0.05 seconds. Pause stops these callbacks. |
| `onCleanup(fn)` | Register additional resource/event cleanup for the next run. |
| `pointer` | `Vector2` in canvas-relative normalized device coordinates; outside the range until the pointer enters. |
| `raycaster` | A reusable `Raycaster`. |
| `onPointer(type, fn)` | Register a canvas event listener that is removed on cleanup. |
| `useCamera(nextCamera)` | Switch active camera and OrbitControls, with responsive perspective/orthographic projection updates. |
| `GLTFLoader` | Loader constructor. The course uses embedded glTF via `parseAsync`; external network requests are intentionally blocked. |

The sandbox is an iframe with `sandbox="allow-scripts"` and an opaque origin. Learner code cannot read the parent DOM, cookies, or localStorage. CSP blocks external network requests; textures and glTF data are generated locally or embedded. The runtime is bundled as a classic script at build time so it works inside the opaque-origin iframe without an external CDN or cross-origin module imports. Parent/iframe messages are restricted by frame identity, a per-frame token, and a run revision. Old results cannot complete a newly edited exercise.

Scene geometry, materials, attached textures, shadow resources, controls, the animation loop, and the renderer are disposed between runs. Use `onCleanup` for resources removed from the scene or created outside that lifecycle. The iframe is a capability boundary, not a CPU time limit: an intentional infinite synchronous JavaScript loop can still hang a browser tab. Reload the tab if needed.

## Saved progress

LocalStorage key: `threejs-learning-path:v1`.

```js
{
  current: 'hello-scene',
  completed: ['hello-scene'],
  drafts: { 'hello-scene': '/* edited code */' },
  answers: { 'hello-scene': 0 }
}
```

Progress belongs to the current browser and origin. It does not require an account and does not sync between devices. Malformed storage falls back safely; a quota or access failure displays a warning. Reset code only restores the current starter and leaves completion intact. Export downloads the current JavaScript snippet with the runtime API described in its header.

## Run and verify

From `ui/`:

```sh
npm ci
npm run dev
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

For an existing local Chrome installation, set `PLAYWRIGHT_CHROME_PATH` to its executable when running browser tests. CI installs Chromium and runs the curriculum/storage checks, build, and browser suite before deploying to Railway. Browser tests render every starter and solution, exercise pointer interactions, and cover persistence, errors, manual run, sandbox isolation, gallery integration, mobile layout, and deep links.

`predev` and `prebuild` generate `public/threejs-runtime.js` from `runtime.js` with esbuild. That generated file is ignored in Git; the source and lockfile are committed. If you change runtime code while a dev server is running, run `node scripts/build-sandbox.mjs` and restart the preview iframe or reload the page.

## Moving beyond the workspace

To start a standalone project, install `three`, import it with your bundler, and explicitly create the pieces supplied here:

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(4, 3, 6);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Add the lesson's geometry, materials, lights, and objects here.
const timer = new THREE.Timer();
timer.connect(document);
renderer.setAnimationLoop(() => {
  timer.update();
  const delta = timer.getDelta();
  const elapsed = timer.getElapsed();
  // Place your onFrame callback's logic here.
  controls.update();
  renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
```

When removing the app, stop its animation loop, remove listeners, and dispose its renderer, controls, timer, geometries, materials, and textures as covered in the cleanup lesson.
