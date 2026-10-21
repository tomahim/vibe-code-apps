---
name: Index Climb
tagline: Watch Your UTMB Index Move and Pick the Races That Move It
pitch: See your UTMB index history as a mountain ascent and pick the races that would realistically raise it.
domains: [SPORT, GAME, LEARN]
created: 2026-10-21T05:59:10Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** The UTMB index is a number that quietly drives race eligibility, but nobody shows it as a journey. Index Climb renders your index history as a mountain ascent: each race result is a step up or down with the why attached, your current level is base camp, and the next eligibility thresholds (the races you could enter) are flagged peaks above you. A race picker mode ranks candidate races by how much index they could realistically gain you given your level.
- **Core Problem & Target User:** Runners check their index on a cold results page and cannot tell what it means or how to grow it. Target user: a trail runner with a UTMB account who targets index-gated races like a 90K major.
- **Core Value Proposition:** Your index as a visible climb, with a concrete shortlist of races that raise it.

#### 2. USER STORIES

- **Primary User Story:** "As a trail runner, I want my index history and current level visualized, so that I understand where I stand and why."
- **Secondary User Story:** "As a racer planning a season, I want candidate races ranked by realistic index gain, so that I pick the ones that unlock my goal race."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The ascent | Manual entry of race results (distance, D+, time, field size) or CSV import, an index estimate per race with a documented formula, an ascent chart, and threshold flags for race categories. | Day 1 PoC |
| Expansion 1: Race picker | A curated list of index races with dates and countries, realistic-gain scoring from your level, season planner view, local storage, export of the plan. | Month 1 MVP |
| Expansion 2: Live index | UTMB account connection or page import, automatic result detection, registration date alerts for shortlisted races, friend comparison climbs. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Index estimation as a transparent approximation formula (labelled as estimate, not official), ascent chart in SVG, localStorage. No backend.
- **Core 24-Hour Demo Flow:** Enter three past results, watch the ascent chart draw itself and the next threshold flag light up with the gap to reach it. **Aha moment:** within 30 seconds you know exactly how far you are from your goal race's gate.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Enter one result and the climb appears.
- **Growth Vector:** The race picker shortlist is inherently shareable in training groups planning a season.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Replicating the official formula. Mitigation: clearly labelled estimate with a link to the official index.
- **Technical:** Race database freshness. Mitigation: curated list with dates reviewed per season.
- **Retention/Engagement:** Index changes a few times a year. Mitigation: the season planner and registration alerts keep it useful between results.
