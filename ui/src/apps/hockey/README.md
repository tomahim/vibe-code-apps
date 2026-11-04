# Hockey Lab

Authenticated frontend at `/apps/hockey/players`, `/compare`, `/teams`, and `/simulator` (all below `/apps/hockey`). Uses the shared Bearer-JWT helper and sign-in flow. No credentials, real user rosters, or demo data are bundled.

- Player search, club/position filters, details and an eight-player selection that survives filters.
- Weekly comparison charts with metric selection, legend and an accessible data table. Missing weeks are not interpolated. Weeks across January remain in season order.
- Account-owned fantasy teams and local planning rosters. Manual entries do not imply a live HM import or known acquisition cost.
- Equal-size transfer what-ifs, saved to the account's team. No real trade route exists. Unknown acquisition costs suppress estimates, even if an older API returned a number. Known-cost estimates are labeled as estimates from a 140 M initial budget, not actual HM balances. Position, nationality and transfer eligibility remain unchecked and are stated as such.
- Official standings consume the exact `/standings/` API, including shootout splits, source, capture day and source update time. Empty data never becomes an inferred table.

This view deliberately warns that import coverage is not verified. A season total is not a weekly history. No synthetic statistics are used at runtime. Tests use clearly named fixture players and mocked API responses.

Checks:

```sh
npm test
npm run build
npx playwright test tests/browser/hockey.spec.js
npx playwright test --config playwright.hockey.config.js
```

The hockey-specific config runs Firefox at 393x852. Tests cover auth/deep links, expiry, filters, selection, detail, graphs, empty/error states, standings contract and suppression of unsafe budget estimates. API owner isolation remains a backend responsibility; this UI uses only `/my/teams/` endpoints for private records.
