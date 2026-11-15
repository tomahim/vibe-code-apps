# Nature interior art comparisons

The Interior lab preserves earlier variants and compares two Nature-only directions:

- Authored pond: an independently authored closer scene, a separate animated swimming character and wake, masked water motion and bounded parallax/pan/zoom. This is explicitly 2.5D, not free-orbit 3D. The overview and interior are different artworks, connected by a short transition rather than a claim of continuous geometry. The 1672x941 background gains new pond detail versus the overview, but extreme zoom still softens it.
- Painted-material study: real terraced terrain, branching trunks, botanical cards, moss/flowers, animated cascades and small wildlife. This remains a stylized comparison, below the authored painting's visual fidelity.

No lesson content is invented. These studies do not complete the other 19 interiors or replace the five-world, four-theme navigation objective.

## Loading and sandbox

`node scripts/build-interior.mjs` rebuilds the original Nature interior and both comparison entries. Comparison scenes are loaded only when Interior lab is selected. Switching approaches replaces the iframe; leaving the tab unloads it, releasing its render loop and scene. Reduced-motion preferences freeze ambient animation and disable the arrival transition.

The artifact runs in a sandboxed iframe. Image-loader requests from a nested sandbox do not share the app origin, so scene textures are packed as data URLs into each lazy scene bundle. This avoids weakening sandbox settings. The hybrid bundle is about 3.1 MB uncompressed; the 3D comparison is about 5.2 MB uncompressed. They are intentionally not inlined into the main artifact. Source image assets remain beside the generated bundles for reproducible builds. Static geometry is merged by material in the 3D study to avoid one draw call per branch or flower.

## Checks

Verify the actual embedded artifact on desktop and phone, not only standalone scene pages: textures, transitions, both navigation approaches, no lesson claims, no overlapping controls, and unload on tab exit. Test touch pinch/pan and reduced motion. Earlier variants must remain available.
