---
name: Offseason
tagline: Ride Your Own Summer Routes Indoors, Against the Ghost of Your Best Day
domains: [SPORT, 3D, GAME]
created: 2026-10-21T06:13:03Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Zwift gives you fantasy islands. Offseason gives you back your own roads: it turns your outdoor GPX history into rideable indoor routes rendered as stylised 3D terrain, with the exact elevation profile driving a smart trainer. The twist is the field: every past ride of the same route becomes a ghost riding beside you at its real recorded pace, so your Tuesday trainer session is a race against five versions of your summer self.
- **Core Problem & Target User:** Indoor training worlds feel generic and disconnected from the riding you actually love. Target user: a cyclist or trail athlete with a trainer and a season of outdoor GPX files who wants winter miles to feel personal.
- **Core Value Proposition:** Your own routes, your own ghosts: indoor rides with the emotional pull of your real season.

#### 2. USER STORIES

- **Primary User Story:** "As a cyclist, I want to ride my own outdoor routes indoors with the real profile on my trainer, so that winter training feels like my roads."
- **Secondary User Story:** "As a competitive rider, I want ghosts of my past rides pacing me, so that every session is a race I care about."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Replay roads | GPX import, a stylised 3D route replay with a rider dot and ghost dots at recorded paces, a speed slider as a stand-in for trainer input, and finish comparison. | Day 1 PoC |
| Expansion 1: Trainer control | FTMS smart trainer connection (grade to resistance), power and cadence display, ERG mode on flatter sections, route library, local storage. | Month 1 MVP |
| Expansion 2: Season league | Ghost selection by conditions (your best, your median), friend route exchange, winter league on shared segments, video or satellite texture overlay, outdoor completion badges. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, React Three Fiber with drei. GPX parsing, simplified terrain ribbon rendering, ghost replay from timestamps, localStorage. Trainer connection explicitly post-PoC.
- **Core 24-Hour Demo Flow:** Drop two GPX files of the same climb, press ride, and watch your two selves pull apart on the first switchback. **Aha moment:** within 30 seconds you are behind your own ghost and pedalling harder at a screen.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A bundled famous climb with three ghost efforts plays on load.
- **Growth Vector:** Route exchange between friends spreads both routes and the app.

#### 6. RISKS & MITIGATION

- **Scope Creep:** A full virtual world. Mitigation: route-ribbon rendering only, no free-roam world.
- **Technical:** Bluetooth trainer support varies. Mitigation: PoC is replay-only, FTMS in Expansion 1 with a simulator fallback.
- **Retention/Engagement:** Needs a route library. Mitigation: friend exchange and the winter league.
