# Cold-start loader

Local implemented UI captures, headed Firefox, viewport 390 x 844. Not
production captures or physical Android validation. The test fixture fakes
the health endpoint (503s, then ok) and the garden payload; no live account,
API or database is involved. For a stable capture the test freezes the
carton fill at a real mid-animation frame; in the app the fill loops while
the API wakes.

- `waking-firefox.png`: the API has not answered yet. The carton keeps
  filling and emptying; the attempt counter is the only real progress signal.
- `exhausted-firefox.png`: after the attempt budget, the loader offers a
  Try again button instead of hanging forever.

Reproduce with:

```sh
cd ui
npm ci
npx playwright install firefox
xvfb-run -a npx playwright test --config playwright.firefox.config.js tests/browser/little-grains-loader.spec.js
```

The test writes the captures to `/tmp/lg-loader-waking.png` and
`/tmp/lg-loader-exhausted.png`.
