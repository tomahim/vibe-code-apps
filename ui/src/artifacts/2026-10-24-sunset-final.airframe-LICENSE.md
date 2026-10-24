# Airframe mesh provenance — 2026-10-24-sunset-final

The aircraft model embedded in `2026-10-24-sunset-final.html` is:

- **Asset:** "Narrow-body airliner" (original Innerscene model)
- **Author / publisher:** Innerscene
- **Source page:** https://www.innerscene.com/tools/library/3d-parts/narrow-body-airliner-8c1aee2c
- **Download URL:** https://www.innerscene.com/api/library/narrow-body-airliner-8c1aee2c/download (glTF/GLB)
- **Retrieved:** 2026-10-24
- **License:** Public domain (CC0). The source page states: "Public domain (CC0).
  Free to use, modify and redistribute for any purpose, including commercially, with
  no credit required." CC0 deed: https://creativecommons.org/publicdomain/zero/1.0/

## Modifications

- Converted offline from GLB to a compact custom binary (positions/normals/UVs/indices,
  grouped by material) embedded as base64 in the HTML artifact; no runtime fetches.
- Material base-color textures downscaled to 1024px JPEG and embedded as data URLs.
- Coordinate shift: y -= 4.15 so the origin is the fuselage centerline (wheel bottoms at y=0).
- No geometry, proportion, or material-assignment changes.

Original model facts: A320-class real-world dimensions (37.6 m length, 34.2 m span,
10.1 m height), 286 meshes, ~148,572 triangles, 11 PBR materials, modeled landing gear,
turbofan blades, window apertures. No scene-node transforms (all geometry in world space).
