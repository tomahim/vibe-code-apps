# Lithothèque

A frontend-only app at `/apps/lithotheque`, listed in the main app gallery. No API, database, storage, new account, paid resource or infrastructure is needed. All specimen data ships in the Vite build. It works without the API, including a direct route visit.

The interface is the "Bench" direction Thomas picked from the three design studies on 2026-11-03: a dark mineralogist's workbench with a filterable specimen catalogue, a drag-to-turn specimen stage, an instrument rail of species reference readouts, and a tabbed dossier per specimen.

## Honest modelling

- The 3D specimens are original procedural Three.js study models (engine.js): correct habit, colour and lustre character per species, but stylized placeholders. They are not scans, not photogrammetry and not measured specimens, and the app says so wherever a model appears ("study model"). Realistic minerals are a separately planned later phase.
- Instrument rail entries (scratch pick, streak plate, acid dropper, UV lamp) are published species reference values, labelled "Reference:", never measurements of a specific sample. Selecting the UV lamp relights the stage under a violet lamp; that is a viewing mood, not a simulated fluorescence measurement.
- No measurement scale bars, no fabricated provenance, no copied museum scans or textures. The noise, geometry and canvas textures are generated in engine.js.

## Rendering

- One Three.js WebGL scene per visible specimen card (six on the catalogue), one on the detail stage; `three` is the repo's existing dependency, with `RoomEnvironment` image-based lighting, ACES tone mapping and a contact-shadow ground.
- Render resolution is capped at 2x DPR, offscreen canvases skip renders via IntersectionObserver, and renderers, geometry, materials and textures are disposed on unmount.
- `prefers-reduced-motion` stops the idle spin; dragging still works. A WebGL failure swaps the canvas for a labelled placeholder frame and leaves every dossier readable.

## Data and sources

Six starter species (kyanite, nepheline, quartz, pyrite, fluorite, calcite) in `minerals.js`, chosen so the catalogue filters and dossier tabs can be judged on real content. Facts are species-level references from the sources linked in each dossier (Mindat, Handbook of Mineralogy, Geology.com, Wikipedia), checked 2026-11-03. Text is original, not copied from these publications.
