---
name: The Black Line
tagline: A Companion for the Solitary Lap Swimmer - Sets, Focus and Proof You're Getting Faster
pitch: A swim training companion that builds today's set, keeps one technique focus per session, and turns lonely laps into a visible arc of progress.
domains: [SPORT, LEARN]
created: 2026-10-24T05:03:07Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Lap swimming is the loneliest endurance sport: no view, no music, just the black line and your own thoughts - and most swimmers show up with no plan, so every session feels the same and improvement is invisible. The Black Line embraces the solitude and structures it. Before you leave, it builds today's set from your level and goal (endurance base, threshold work, technique rebuild), sized to your pool length and your available time, written in the terse card language swimmers actually use. Each session carries ONE technique focus - "quiet head", "finish the stroke", "count your breath" - delivered as a single sentence to hold underwater. After, you log times and feel, and the app charts the arc that pool swimming never shows you: pace trends per distance, stroke-rate drift, the day your 400m threshold moved. A "lane notes" tradition lets you pin one sentence about the session, building a swimmer's diary in the margins of the data.
- **Core Problem & Target User:** Recreational lap swimmers train alone with no coach, no plan and no feedback; swim apps assume a watch and a triathlete's obsession. Target user: the 2-4 times-a-week pool swimmer who wants structure and progress without buying a gear ecosystem.
- **Core Value Proposition:** A coach's card in your pocket: today's set, one thing to think about, and over months the proof - in seconds and in diary lines - that the lonely laps are working.

#### 2. USER STORIES

- **Primary User Story:** "As a lap swimmer, I want a session built for my level, pool and available time, so that I never arrive at the lane wondering what to do."
- **Secondary User Story:** "As a progressing swimmer, I want my times and one-line notes to accumulate into a visible arc, so that improvement I can't feel week to week becomes undeniable month to month."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Today's set | Set builder from level, goal, pool length and time budget, rendered as a classic swim card (warm-up, main set, cool-down, total meters, interval notation explained once), printable and phone-lock-screen friendly. | Day 1 PoC |
| Core Mechanism: The focus and the log | One technique focus per session, post-session logging of times and feel, pace-trend charts per distance, and the lane-notes diary. | Day 1 PoC |
| Expansion 1: Real progression | Multi-week plans with periodization, pace zones calibrated from logged times, rest-day and missed-session adaptation, and seasonal reset tests. | Month 1 MVP |
| Expansion 2: The full lane | Watch integration for auto-set display and lap counting, drill video library tied to the focus, Masters-group sharing for lane mates, and open-water season mode with safety-first guidance. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A set generator over a structured workout library (by level and goal), the swim-card view designed for a wet-glance phone screen, logging and charts from localStorage. No wearables, no backend.
- **Core 24-Hour Demo Flow:** Set level intermediate, 25m pool, 45 minutes, goal threshold - get a card: 400 easy, 8x50 drill with "quiet head", 5x200 at threshold pace, 200 loose. Log the 200s after, and the pace chart bends. **Aha moment:** the 3-month chart with the diary lines on it - "felt smooth" beside the day the line dropped - the loneliness of the lane made visible as progress.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "What do you do when you get to the pool?" - most swimmers answer "I just swim", and the first generated card in thirty seconds shows what they've been missing.
- **Growth Vector:** Swim cards are a shared culture - people photograph and trade them; the monthly progress chart is a natural brag artifact, and every January and pre-summer brings a wave of returning swimmers.

#### 6. RISKS & MITIGATION

- **Notation literacy:** Swim cards read like code to newcomers. Mitigation: every abbreviation is explained once inline, a beginner mode writes sets in plain sentences, and the notation is taught gradually as the swimmer levels up.
- **No sensor truth:** Self-reported times are imperfect. Mitigation: the app frames logs as honest self-timing with guidance (pace clock reading tips), never pretends to sensor precision, and watch integration is explicitly Expansion scope.
- **Technique claims:** One-line cues must be sound. Mitigation: the focus library sticks to widely accepted fundamentals, keeps cues single and simple, avoids medical or injury claims, and points persistent pain to a real coach or clinician.
- **Motivation through solitude:** Without community, retention relies on ritual. Mitigation: the lane-notes diary and progress arc are the retention engine by design; no social feed, no gamified pressure, just the swimmer and their line - which is the brand.
