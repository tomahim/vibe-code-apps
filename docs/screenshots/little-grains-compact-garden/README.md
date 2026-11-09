# Compact garden UI

Local Chromium screenshots with synthetic rewards (1284 drops / 212 carrots)
and seven themes at 20% card-reading progress. These are not production accounts
or evidence of production API recovery.

- `mobile-fixture.png`: 390 × 844, expanded panel, two-column theme tiles,
  compact reward chips, no root Garden pill or mobile hint/zoom buttons.
- `desktop-fixture.png`: desktop root with the same selected simplifications;
  desktop gesture hint, +/- buttons and existing paths-growing stat remain.
- `mobile-path-fixture.png`: deeper Garden / theme / path breadcrumbs remain.

The last theme still needs scrolling on the phone. All-seven-visible is not a
claim of this change. Touch drag and pinch are checked with native Chromium
touch events. Headless Firefox cannot initialize WebGL in the local test setup;
no physical Android Firefox or production end-to-end verification is claimed.
