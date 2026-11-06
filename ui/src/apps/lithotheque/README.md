# Lithothèque

A frontend-only app at `/apps/lithotheque`, listed in the main app gallery. No API, database, storage, new account, paid resource or infrastructure is needed. All specimen data ships in the Vite build. It works without the API, including a direct route visit.

The interface is the "Bench" direction Thomas picked from the three design studies on 2026-11-03: a dark mineralogist's workbench with a filterable specimen catalogue, a drag-to-turn specimen stage, an instrument rail of species reference readouts, and a tabbed dossier per specimen.

## Honest modelling

- The 3D specimens are built in Three.js (engine.js).
- All six species are higher-detail rebuilds (2026-11-03). Kyanite came first (parametric tapered blades with gentle curvature and chisel tips, lengthwise striations and cleavage steps, blue colour zoning, pearly lustre patches, foliated mica-schist matrix with glinting flakes and milky quartz intergrowth). The realism pass on the other five: quartz (hexagonal prisms with alternating major/minor rhombohedral terminations, horizontally striated prism faces, milky cloudy interiors on a granite-like matrix), pyrite (intergrown cubes with per-face striations, perpendicular on adjacent faces, on dark shale), fluorite (bevelled cubes with darker rim zoning, a cleaved octahedral fragment, and its UV glow, on pale limestone), calcite (dogtooth scalenohedra with cleavage rhombs on warm limestone), nepheline (stubby greasy hexagonal prisms among massive intergrown grains on a syenite-like matrix). They remain stylized study models, not photogrammetry.
- Instrument rail entries cover scratch, streak, acid and UV observations. Selecting the UV lamp relights the stage under a violet lamp.
- No measurement scale bars, no fabricated provenance, no copied museum scans or textures. The noise, geometry and canvas textures are generated in engine.js.

## Rendering

- One Three.js WebGL scene per visible specimen card (six on the catalogue), one on the detail stage; `three` is the repo's existing dependency, with `RoomEnvironment` image-based lighting, ACES tone mapping and a contact-shadow ground.
- Render resolution is capped at 2x DPR, offscreen canvases skip renders via IntersectionObserver, and renderers, geometry, materials and textures are disposed on unmount.
- `prefers-reduced-motion` stops the idle spin; dragging still works. A WebGL failure swaps the canvas for a labelled placeholder frame and leaves every dossier readable.

## Data and sources

Six starter species (kyanite, nepheline, quartz, pyrite, fluorite, calcite) in `minerals.js`, chosen so the catalogue filters and dossier tabs can be judged on real content. Facts are species-level references from the sources linked in each dossier (Mindat, Handbook of Mineralogy, Geology.com, Wikipedia), checked 2026-11-03. Text is original, not copied from these publications.


## Bilingual glossary

The Glossaire / Glossary button opens static two-sided cards: French first, English via a touch/keyboard-accessible language button. Search matches either language, ignoring accents. Seven broad category tabs group the entries. Definitions, source links and image credits ship in `glossary.js`; images are embedded remote Wikimedia URLs (internet needed for images, with an unavailable-image fallback). No API, backend, database or upload storage is used.

The initial set includes Thomas's GEO terms and a small starter vocabulary chosen to populate the themes. Sources are linked per language; every image links to its Commons file page with author and reusable license. Images generally use Commons-generated 640px thumbnails; the small andesite and gabbro originals are embedded directly because their thumbnail endpoints returned rate errors during validation. The content is short original wording, not copied article text.

When Thomas says `GEO <word>`, add the bilingual term and definition under the relevant theme, with a sourced and licensed representative image. Commas separate multiple entries. Check existing FR/EN terms before adding so repeats update rather than duplicate. This is a conversational addition convention, not a command parsed in the app. Future additions remain normal source-code changes and deployments.
