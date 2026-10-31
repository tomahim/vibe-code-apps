# Repo Factory artifact

Source for `src/artifacts/2026-10-30-repo-factory.html` ("The Little Factory"). Rebuild with `node scripts/artifacts/repo-factory/build.mjs` (esbuild bundles the three.js scene into one self-contained HTML file).

- Night-shift rework (2026-10-30, after Thomas's review): the camera is inside a dark futuristic hall. Robot arms work the assembly bays, moving spotlights sweep the production line, merged PRs assemble as machines fed by branch lines, direct-to-master commits arrive as supply crates, and each shipped machine adds a gear to the core tower. Scrub/play the timeline.
- Live data (2026-10-31): the home factory no longer embeds a baked snapshot — the old `data.js` export was removed. Every factory, home or guest, loads its data when the page opens through GitHub's anonymous API (no token, 60 requests/hour per visitor): repo info + up to 3 pages of recent closed PRs, merged ones only. The home repo (tomahim/vibe-code-apps) is just the default dataset. Per-PR commit counts and supply crates (direct-to-master commits) aren't available in live mode; the timing of crates inside a PR is spaced for the animation.
- "New factory" loads any other public repo through the same path.
- Navigation: drag/one finger orbits, wheel/pinch zooms, tap a machine for its PR card. Space toggles play, arrows scrub, +/- zoom.
- Desktop quality gets shadows and smoke; mobile runs lite (no shadows, capped particles, lower pixel ratio).
- All scene state is in memory inside the opaque-origin gallery sandbox. No storage, backend, or external runtime; the only network calls are the anonymous GitHub API reads when the page opens and when a visitor enters another repo.
