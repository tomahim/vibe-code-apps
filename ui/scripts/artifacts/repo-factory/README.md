# Repo Factory artifact

Source for `src/artifacts/2026-10-30-repo-factory.html` ("The Little Factory"). Rebuild with `node scripts/artifacts/repo-factory/build.mjs` (esbuild bundles the three.js scene into one self-contained HTML file, no network at runtime for the home factory).

- Night-shift rework (2026-10-30, after Thomas's review): the camera is inside a dark futuristic hall. Robot arms work the assembly bays, moving spotlights sweep the production line, merged PRs assemble as machines fed by branch lines, direct-to-master commits arrive as supply crates, and each shipped machine adds a gear to the core tower. Scrub/play the timeline.
- `data.js` is generated from the GitHub API and git history (see `factory-data` generation notes in the PR). PR numbers, titles, branches, authors, dates, commit counts and line changes are real; the timing of crates inside a PR is spaced for the animation.
- "New factory" loads any public repo client-side through the anonymous GitHub API (no token, 60 requests/hour per visitor): repo info + up to 3 pages of recent closed PRs, merged ones only. Guest factories show merged PRs only; per-PR commit counts and supply crates stay home-factory-only.
- Navigation: drag/one finger orbits, wheel/pinch zooms, tap a machine for its PR card. Space toggles play, arrows scrub, +/- zoom.
- Desktop quality gets shadows and smoke; mobile runs lite (no shadows, capped particles, lower pixel ratio).
- All scene state is in memory inside the opaque-origin gallery sandbox. No storage, backend, or external runtime; the only network calls are the visitor-initiated anonymous GitHub API reads for guest factories.
