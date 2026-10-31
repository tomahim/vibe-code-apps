# Little Drops

Independent, front-end-only exploration app at `/apps/little-drops`. No Little Grains imports, API, analytics, account or server state. Gallery metadata and route live in the existing UI shell.

## First journey
A fictional reservoir-to-tap supply system with five stops, a real Three.js city/cutaway, guided playback, height/pressure lab, treatment-sequence lab, source links and browser-local discovery notebook (`little-drops:v1:discoveries`). No water-safety or engineering claims about any real city.

All explanatory text and checked sources live in `content.js`. Pressure is ideal **gauge** pressure, not absolute pressure or actual flowing network pressure: density 1000 kg/m³, gravity 9.81 m/s², kPa output. Treatment dots and model dimensions are illustrative only.

WebGL failure leaves all explanations and experiments available. Motion is reduced with the OS preference. Keyboard-accessible stop/camera buttons offer an alternative to model picking. Canvas resources, listeners and animation frames are released on unmount. No additional dependencies.

## Verification
- `npm test`
- `npm run build`
- `npx playwright test little-drops.spec.js gallery-search.spec.js`
- Firefox: `xvfb-run -a npx playwright test little-drops.spec.js --config=playwright.firefox.config.js`. Software WebGL under Xvfb is tested, not physical Android hardware.

## Development priorities
Make mechanisms understandable and fun before adding more journeys. Next candidates: stronger visual branching in the pipe network, a demand/storage experiment, and a first original soundscape with opt-in audio. Backend remains out of scope until Thomas approves it.

## Release 002
Valves & routes is a graph-connectivity toy, not a hydraulic calculation. All eight valve combinations are unit-tested. SVG status, patterns and valve symbols work without color or WebGL. The city branches are illustrative and independent of the toy topology. Guided playback lives in React so it also works on the non-WebGL fallback, pauses in a hidden tab and stops on the final stop.

## Release 003
Storage & demand uses equal-duration fictional steps and arbitrary volume units. The pure model conserves water: previous storage + inflow = delivered + next storage + overflow. Capacity comparisons start half full, so the larger tank also has a larger starting reserve. No real demand, safety, engineering, pressure or energy prediction is made. The hand-stepped interface needs no animation or WebGL.
