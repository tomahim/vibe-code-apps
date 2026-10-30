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
