---
name: Summit Standings
tagline: Your Fantasy Season Carved Into a Mountain Range
pitch: See your fantasy season standings carved into a 3D mountain range where each team is a peak.
domains: [SPORT, 3D]
created: 2026-10-20T08:05:48Z
issue: 55
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Reimagine the fantasy league standings table as procedural terrain. Each round of the season adds a new segment to a 3D mountain ridge: altitude comes from your points versus the league average, slope shows your streak, and a snowline marks the rounds where you reached the podium. A mid-season collapse becomes a literal cliff. Instead of reading a table, you fly along your own ridge and feel the season's shape.
- **Core Problem & Target User:** Fantasy players (hockey, football, any season-long league) follow a ranking table that flattens 30 rounds of drama into one number. The story of the season, the hot streak in November, the collapse in February, is invisible and the league chat has no shared artifact to argue about.
- **Core Value Proposition:** Paste your weekly scores and watch your whole season rise as a flyable 3D mountain in under a minute.

#### 2. USER STORIES

- **Primary User Story:** "As a fantasy hockey manager, I want to see my season results rendered as a mountain range, so that I can relive the arc of my season instead of reading a flat table."
- **Secondary User Story:** "As a league member, I want to compare my ridge with a rival's side by side, so that our trash talk has a visual artifact to back it up."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Ridge from scores | Manual entry of weekly scores for one manager (paste or 10 number fields). Deterministic procedural ridge generated with Three.js: altitude = points delta vs league average, slope = streak. Fly-over camera along the ridge, snowline flags on top-3 rounds, hover a peak for the round detail. | Day 1 PoC |
| Expansion 1: Rival ridges and weekly ritual | Add a second manager's ridge side by side for comparison, a one-minute weekly update ritual (enter this week's score, watch the range extend), and a shareable snapshot image of your mountain. | Month 1 MVP |
| Expansion 2: League worlds | CSV or API import from fantasy platforms, weather systems over the terrain (storm clouds on losing streaks, northern lights on a title win), animated season replay, and a shared league world where every manager's range forms one mountain chain. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber. One plane geometry displaced by a deterministic seeded height function driven by the scores array (not free noise). A small input form plus a paste field for weekly scores. localStorage persistence. No accounts, no external API. Works on desktop and mobile browsers, with a plain HTML list fallback if WebGL is unavailable.
- **Core 24-Hour Demo Flow:** Open the app and a fictional manager's 8-round season is already loaded, so the mountain range appears before any input. Drag to fly along the ridge. Hover the highest peak: "Round 14, 78 pts, best week". Edit one score in the form and watch the terrain reshape live. The "Aha!" moment (numbers becoming a mountain) lands in under 30 seconds with zero setup.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The sample season renders on first load; nobody faces an empty scene or a signup wall.
- **Growth Vector:** The exportable "my season as a mountain" snapshot image is built for league group chats, and the weekly ritual of extending the range gives a natural retention loop across the season.

#### 6. RISKS & MITIGATION STRATEGIES

- **Scope Creep Risk & Mitigation:** Live fantasy-platform API integration is tempting on day 1. Mitigation: manual entry only in the PoC; import is explicitly deferred to Expansion 2 after the visual loop proves delightful.
- **Technical Risk & Mitigation:** Procedural terrain can look random or ugly. Mitigation: the height field is a fixed deterministic function of the scores with light seeded noise only for texture, so the same season always produces the same mountain; a 2D list view covers missing WebGL.
- **Retention / Engagement Risk & Mitigation:** A one-off visualization gets viewed once and forgotten. Mitigation: the weekly update ritual, rival ridge comparisons, and shareable snapshots tie it to the existing rhythm of the fantasy season.
