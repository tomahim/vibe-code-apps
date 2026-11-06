# Hockey Lab

Authenticated frontend at `/apps/hockey/players`, `/compare`, `/standings`, `/teams`, and `/simulator` (all below `/apps/hockey`). Uses the shared Bearer-JWT helper and sign-in flow. No credentials, real user rosters, or demo data are bundled.

- Player search, club/position filters, details and an eight-player selection that survives filters and sorting.
- Server-side sorting (`ordering` param, applied before the 500-row cap): name, SIHF points/goals/assists/games and HM price, both directions, unknown values always last. The UI never sorts only the loaded page.
- The selection bar is pinned to the bottom of the viewport while any player is selected, so the count, Compare and Clear actions stay reachable in long tables. On the compare page it offers a jump to the charts instead. Table headers stick while scrolling.
- Weekly comparison charts with metric selection, legend and an accessible data table. Missing weeks are not interpolated. Weeks across January remain in season order.
- Roster rows (own and read-only shared teams) show each player's nationality exactly as Hockey Manager displays it (its flag code, with the observation date; HM's flag is not verified import-license eligibility) and the player's latest medical report from swisshockeynews.ch with its date and a link to the source article. No report never renders as "healthy"; uncaptured nationality never renders as Swiss or foreign.
- Account-owned fantasy teams and local planning rosters. Own roster rows show the latest imported HM snapshot (current price, total HM points, per-match average; snapshot date noted, not live values), shared read-only rosters never do. Manual entries do not imply a live HM import or known acquisition cost. Goalkeeper pairs render as indivisible pair entries; their observed price is labelled as not an acquisition cost.
- Teams shared read-only by another account appear separately under "Shared with you", labelled with the owner, without any prices, edits, removals or simulations.
- Equal-size transfer what-ifs, saved to the account's team. No real trade route exists. Unknown acquisition costs suppress estimates, even if an older API returned a number. Known-cost estimates are labeled as estimates from a 140 M initial budget, not actual HM balances. Position, nationality and transfer eligibility remain unchecked and are stated as such.
- Official standings have their own tab and consume the exact `/standings/` API, including shootout splits, source, capture day and source update time. Empty data never becomes an inferred table.

This view deliberately warns that import coverage is not verified. A season total is not a weekly history. No synthetic statistics are used at runtime. Tests use clearly named fixture players and mocked API responses.

Checks:

```sh
npm test
npm run build
npx playwright test tests/browser/hockey.spec.js
npx playwright test --config playwright.hockey.config.js
```

The hockey-specific config runs Firefox at 393x852. Tests cover auth/deep links, expiry, filters, selection, detail, graphs, empty/error states, standings contract and suppression of unsafe budget estimates. API owner isolation remains a backend responsibility; this UI uses only `/my/teams/` endpoints for private records.
