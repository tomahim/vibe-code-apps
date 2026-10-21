---
name: Rumour Mill
tagline: Score Every Transfer Rumour and Learn Which Journalists to Trust
pitch: File transfer rumours with their source, resolve them when the window closes, and build a trust table of journalists.
domains: [SPORT, MEDIA]
created: 2026-10-20T17:35:16Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Sports news tracking flipped into a credibility game. Instead of reading transfer and trade rumours, you file them into a grinding stone: each rumour is a grain, tagged with the journalist and the claim. When the window closes, the mill resolves each claim as true, false, or half-true and the journalist's trust rating moves. Over a season you get a living league table of reporters, not of clubs.
- **Core Problem & Target User:** Fans drown in rumours with no memory of who was right. Target user: a fantasy or pronostic player who follows news closely and wants a sharper filter.
- **Core Value Proposition:** Know which sources deserve your attention, backed by your own scored history.

#### 2. USER STORIES

- **Primary User Story:** "As a sports news follower, I want to log rumours and later score them, so that I know which journalists are reliable."
- **Secondary User Story:** "As a fantasy player, I want a confidence meter per rumour weighted by the source track record, so that I can act on lineup or transfer news faster."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: File and resolve | A form to add a rumour (player, claim, source, date), a grinding-stone animation on submit, a resolve button (true, false, half), and a ranked journalist table with hit rate. Seeded with 20 sample rumours. | Day 1 PoC |
| Expansion 1: Confidence and decay | Per-source confidence score with recency decay, filters by league and club, rumour timeline, window countdown, CSV and JSON export, local storage. | Month 1 MVP |
| Expansion 2: Shared mill | Paste a feed URL or article to extract the claim with a summariser, public leaderboards via static JSON, season replays, swipe-to-resolve on mobile. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. State in localStorage. Hit-rate maths in a small pure function. CSS-only grinding animation. No backend, no scraping.
- **Core 24-Hour Demo Flow:** Open the seeded mill, resolve three rumours with one tap each, and watch the journalist table reorder. **Aha moment:** under 30 seconds you see a famous source drop from first to fifth because of your own verdicts.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Pre-filled sample rumours make the table interesting before any data entry.
- **Growth Vector:** Shareable "trust table" images fuel debates in fan groups.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Automatic rumour extraction is tempting. Mitigation: manual entry only for the PoC.
- **Technical:** Resolving a claim is subjective. Mitigation: three explicit verdicts and a visible note field.
- **Retention/Engagement:** Value only appears after windows close. Mitigation: seasonal windows and a weekly resolve reminder inside the app.
