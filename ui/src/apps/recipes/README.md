# Etchebest recipe wheel

Open `/apps/recipes` from the gallery. This app reads the existing recipe API;
no new backend, credentials, or image assets are required.

- `GET /api/apps/recipes/recipes/` loads the eligible collection.
- `GET /api/apps/recipes/random/` chooses the winner on each spin.
- Both requests use the same comma-separated `ingredients` query. Filters are
  trimmed, lowercased, and deduplicated; the API applies AND matching.
- Ten wheel segments repeat small collections or randomly sample larger ones.
  If the API winner is outside the current subset, a new subset includes it
  before animation. Selection therefore stays open to the entire collection.
- The wheel uses one generated canvas texture (titles and generic cloches),
  a thick drum, raised hub, brass rims, pedestal, and soft contact shadow. A
  perspective camera makes a small orbit and dolly during each spin, returning
  to its home view at the result. The scene uses capped pixel ratio and renders only on resize,
  content change, or a spin. Uploaded photos appear only in the result. A result photo opens a viewport-sized viewer with a keyboard-accessible close button, Escape support, focus return, and fit-without-cropping scaling.
- Reduced motion shortens spins and disables camera movement. An SVG wheel works without WebGL. The recipe
  list, spin button, and result are available to keyboard and screen-reader users.
- List failures can be retried; random failures leave the wheel available for
  another attempt. Empty results never fall back to unrelated recipes.

The gallery deliberately overrides older API metadata linking this card to
Django admin, allowing the UI to deploy independently. Recipe management is
still linked in the app header.

Validation from `ui/`:

```sh
npm test
npm run test:browser -- tests/browser/recipes.spec.js
npm run build
```

Browser tests mock the API, including 24 candidates, repeated segments,
ingredient filtering, missing and failed photos, HTTP errors, reduced motion,
and unavailable WebGL. Production recipe data and storage are not modified.
