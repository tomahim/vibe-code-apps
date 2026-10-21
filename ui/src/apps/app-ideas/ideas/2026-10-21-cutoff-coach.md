---
name: Cutoff Coach
tagline: Build a Checkpoint Pacing Plan From the Race's Own Past Results
pitch: Build a per-checkpoint pacing plan with cutoff buffers derived from the race's own past results.
domains: [SPORT, PROD]
created: 2026-10-21T05:59:11Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Pacing plans are usually made from hope. Cutoff Coach builds one from evidence: paste the race GPX and a past edition's results, and it derives realistic section times for your target finish (winner pace, mid-pack, or cutoff-minus-buffer), accounting for the section profile and where past runners actually slowed down. Output is a race-day table: arrive at each aid station by this clock time, leave by this one, and here is your buffer against the cutoff at every checkpoint.
- **Core Problem & Target User:** Mid-pack ultra runners DNF at aid stations they could have survived with an honest plan. Target user: a trail runner preparing a 50 to 100 km race with checkpoints and cutoffs.
- **Core Value Proposition:** A pacing sheet grounded in how runners like you actually moved through this exact course.

#### 2. USER STORIES

- **Primary User Story:** "As a mid-pack ultra runner, I want per-checkpoint target times derived from past results, so that I pace against reality, not hope."
- **Secondary User Story:** "As a racer, I want my cutoff buffer visible per checkpoint, so that I know during the race how much trouble I am in."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The plan | GPX plus results CSV input, checkpoint extraction, percentile-based section times, three pacing targets, and a printable race-day table with cutoff buffers. | Day 1 PoC |
| Expansion 1: Personalization | Calibrate to your own past race or training paces, night slowdown factor, crew notes per aid station, local storage of plans. | Month 1 MVP |
| Expansion 2: Race-day mode | Live race-day screen (big text, current buffer), fetch results platforms directly, share plan with crew via link, post-race comparison of plan versus actual. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. GPX and CSV parsing in the browser, percentile maths as pure functions, print-first table CSS. No backend.
- **Core 24-Hour Demo Flow:** Load the bundled sample race, pick "mid-pack", and get the full checkpoint table with buffers; one checkpoint shows a red 8-minute buffer. **Aha moment:** within 30 seconds you see the exact aid station where the race will be decided.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A finished sample plan is visible on load.
- **Growth Vector:** Plans shared with crew and pacers before race day spread the tool per race.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Live tracking integration. Mitigation: static plan first, race-day mode later.
- **Technical:** Results rarely include checkpoint splits. Mitigation: support split files when present, degrade to even-split estimates clearly labelled.
- **Retention/Engagement:** Used a few times a year. Mitigation: post-race comparison and plan library for future editions.
