# Compact lesson reader

Local implemented UI captures, headed Firefox, viewport 390 x 844. Not
production captures or physical Android validation. The test fixture serves
the repository's Motor Cascade lesson text and photo, with eight real cards
and one question (nine fixture steps, not the production question selection).

- `open-firefox.png`: full title, breadcrumb and introduction in the scroll area.
- `scrolled-firefox.png`: those have scrolled away; only the controls remain.

Reproduce with:

```sh
cd ui
npm ci
npx playwright install firefox
xvfb-run -a npx playwright test --config playwright.firefox.config.js tests/browser/little-grains-reader.spec.js
```

The test writes the captures to `/tmp/lg-reader-open.png` and
`/tmp/lg-reader-scrolled.png`.
