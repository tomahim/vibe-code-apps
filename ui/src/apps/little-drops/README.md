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

## Release 004
The pocket notebook lists all stops and revisits opened discoveries with focus returned to the explanation. Markdown export is generated locally from opened content and its existing source links; there is no upload, sync or new permission. Clearing discoveries requires confirmation and does not remove downloaded files. Failed storage writes return a visible in-memory-only warning. Browser tests inspect actual downloaded bytes and cover cancel/reset/persistence/storage failure.

## Release 005
Optional dusk lighting is decorative, not a time-of-day simulation. The renderer stops scheduling frames while hidden or outside an 80px viewport margin. Reduced motion draws only on changes and snaps the selected marker/cutaway instead of animating. Context loss cancels the loop and keeps the reading fallback. Visibility, intersection and media listeners are cleaned up on unmount. A preserved drawing buffer keeps single-frame renders visible/capturable between changes; no measured battery or Android frame-rate claim is made.

## Release 006
The four experiment panels stay mounted for the current visit, with inactive panels `hidden` from keyboard/assistive-technology navigation. This preserves the storage cycle, valve challenge, treatment stage and prediction while switching. The choice group supports arrow/Home/End keys; story shortcuts focus/scroll the workbench. State is not saved across reload. No timers or network work run in hidden labs.

## Release 007
The optional route trace shows an ordered tower-to-home path and outlines its edges without animation. A deterministic breadth-first search chooses one path through open connections; this is not a hydraulic shortest/best-route recommendation or a flow-split calculation. Valve changes immediately update the route and its accessible text list, including a disconnected state. Existing challenge/reset behavior is unchanged.
