# Little Grains — two worlds, both ways

Independent benchmark artifact: **Ocean and Nature only**. The original Hybrid
journey files and assets are unchanged. The private application is not a runtime
dependency and no private application code is included.

Open `/artifacts/2026-11-15-little-grains-orientations` in the artifact catalog, or
`/artifact-assets/2026-11-15-little-grains-orientations/index.html` directly.
Append `#ocean` or `#nature` for a particular scene.

## Artwork

Four lush paintings are authored with the built-in image generator. Each theme
has a distinct horizontal arrangement and vertical arrangement; neither is an
orientation crop. Each contains its three catalog landmarks. The generated
islands have real alpha margins and a contact shadow. The app composites them
over exact RGB **243, 232, 208** (`#f3e8d0`), avoiding baked paper seams.

| Theme | Portrait | Landscape | Landmarks |
| --- | --- | --- | --- |
| Ocean | 1086 × 1448 | 1672 × 941 | Coral garden, Reef crest, Deep lagoon |
| Nature | 1086 × 1448 | 1672 × 941 | Old oak, Stream, Beaver lodge |

**Resolution limitation:** these are native benchmark dimensions, below the
requested 1200px minimum short side. No upscaling is passed off as generated
detail. Final production-resolution artwork remains a separate finishing step.
The landscape ratio is within 0.06% of 16:9; portraits are exactly 3:4.

`artwork-manifest.json` records dimensions, bytes, orientation-specific anchors
and endpoint filenames. Eight lossless WebP assets total approximately 15.9 MiB.
Only the current pair and its alternate orientation preload; the decoded LRU is
bounded to six images. The current pair also has active rendering references.

`prompts.json` contains the final generation/edit prompts. To encode new native
RGBA exports and compute dormant endpoints, use:

```sh
cd ui
uv run --with pillow python scripts/artifacts/little-grains-orientations/prepare_artwork.py /path/to/source-images
```

Input names are `ocean-portrait-alpha.png`, `ocean-landscape-alpha.png`,
`nature-portrait-alpha.png`, and `nature-landscape-alpha.png`. The preparation
script preserves dimensions and alpha; it does not crop or invent compositions.

## Interaction

- Viewport **shape**, not device identity, selects the painting. Resizing a
  desktop through square or rotating a phone swaps composition without resetting
  the selected theme, growth step, open lesson or discoveries.
- Every lesson has separate portrait/landscape anchor coordinates. Labels are
  fixed 148 × 48 CSS pixels, independently placed to avoid collisions and linked
  back to their anchor by a leader. They never scale with the painting.
- A ten-step slider and optional replay reveal lush vegetation through a fixed,
  deterministic spatial mask. The dormant endpoint maps vegetation hues to muted
  earthy colors while preserving alpha, water and the composition. This is a
  **color/dormancy preview, not structural sapling-to-tree growth**. Existing tree
  silhouettes and landmarks remain at every step.
- Full screen preserves clickable lesson labels, the two named theme choices
  and the growth slider. It uses native fullscreen when permitted and falls back
  to an expanded in-frame view. Escape or the back button exits.
- Three sample lesson dialogs per theme can be marked discovered. Discovery
  state uses browser-local storage when available and session state in opaque
  artifact frames. There is no production account data or API.

## Verification

The focused unit suite covers complete pairs and hashes, aspect ratios,
viewport-shape selection, crop-free fitting, collision-free fixed-size labels
and deep links. Existing catalog and Hybrid journey tests also pass.

Browser checks cover 390 × 844 and 1440 × 900 layouts, the dormant and lush
endpoints, lesson completion across an orientation swap, and theme navigation
while expanded with labels and the growth slider visible.

The repository-wide production build was attempted on macOS and failed in the
unchanged Lithotheque app: `Glossary` resolves to `glossary.js` rather than the
component. The standalone artifact runs independently of that unrelated import.
