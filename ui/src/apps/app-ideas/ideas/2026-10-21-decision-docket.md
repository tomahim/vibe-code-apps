---
name: Decision Docket
tagline: Argue Every Fantasy Trade in Court, Then Let the Season Pass Verdict
domains: [SPORT, GAME, WRITE]
created: 2026-10-21T05:02:05Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Fantasy managers make trades and lineup calls on gut feeling and forget their reasoning. Here each decision is a court case. You file it with a one-line prosecution (why not) and defence (why), pick a "judge" confidence, and seal it. When enough games pass, the season delivers a verdict from the actual points, and your reasoning is scored. You see which arguments you reliably win and which cognitive habits cost you points.
- **Core Problem & Target User:** Fantasy league players cannot tell luck from judgment. Target user: a Swiss National League fantasy hockey player who trades and sets lineups every round.
- **Core Value Proposition:** Learn from your own decisions by treating them as testable arguments.

#### 2. USER STORIES

- **Primary User Story:** "As a fantasy manager, I want to log my trade reasoning before the result, so that I can later judge whether it was sound."
- **Secondary User Story:** "As a competitive player, I want stats on my best and worst kinds of decisions, so that I improve my next trade."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: File, seal, verdict | A case form (decision type, players, prosecution, defence, confidence), a seal stamp, a manual "points after N games" entry, a verdict screen (win, lose, hung jury) and a record of wins by decision type. | Day 1 PoC |
| Expansion 1: Patterns and reminders | Bias tags (recency, star-chasing, loyalty), decision timeline, auto verdict window by games played, CSV export and import, local storage. | Month 1 MVP |
| Expansion 2: League and data | Shared docket for a league of friends with public verdicts, optional stats feed import for auto verdicts, season retrospective, playful judge personas. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Cases in localStorage, verdict from a simple points-difference rule, CSS stamp animation. Mobile-first. No external data.
- **Core 24-Hour Demo Flow:** File a sample swap, seal it, enter later results, and see a verdict with a short explanation. **Aha moment:** within 30 seconds the verdict screen shows your decision hit rate by type.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Three pre-filed sample cases show how verdicts work immediately.
- **Growth Vector:** League friends can post verdict cards, and trash talk becomes content.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Stats scraping. Mitigation: manual points entry in the PoC.
- **Technical:** Noisy small samples. Mitigation: verdict window of several games and a hung-jury state.
- **Retention/Engagement:** Logging takes effort. Mitigation: a two-field minimal form and an optional detail mode.
