---
name: Watt Fiction
tagline: An Audio Adventure Where Your Power Zones Are the Choices
pitch: An audio adventure where your power zones are the choices: intervals are chases, recoveries are campfires.
domains: [SPORT, GAME, WRITE]
created: 2026-10-21T06:13:04Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** An indoor riding app with no world map at all: it is an interactive audio drama driven by your effort. You are a courier crossing a mountain valley in a storm; holding zone 2 keeps the story walking, surging to zone 4 outruns the wolves, and dropping below target lets the plot catch up with you. Structured workouts are the chapters: intervals are chases, recoveries are campfires with dialogue, and your coach's plan becomes this week's episode arc.
- **Core Problem & Target User:** Intervals indoors are boring, and gamified worlds still feel like watching numbers. Target user: a cyclist or runner on a treadmill or trainer who wants to be somewhere else entirely during structured workouts.
- **Core Value Proposition:** A story so tied to your legs that finishing the interval is how you find out what happens.

#### 2. USER STORIES

- **Primary User Story:** "As an indoor athlete, I want an audio story that responds to my power zones, so that intervals feel like plot, not suffering."
- **Secondary User Story:** "As a training-plan follower, I want my workouts mapped to chapters, so that the story respects the plan instead of fighting it."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Zones drive plot | A scripted episode engine (JSON scenes with zone targets and branches), synthetic or recorded narration, a manual effort slider as stand-in input, and chapter summary at the end. | Day 1 PoC |
| Expansion 1: Sensor input and workout import | FTMS or heart rate input, import of structured workouts as episode skeletons, 3 episode arcs, local save of choices. | Month 1 MVP |
| Expansion 2: Season and writers | A full season with persistent choices, community-written episodes with a schema, multiplayer episodes where the group's watts share the danger, podcast-quality production. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Episode engine over JSON scenes, Web Audio for narration, slider and keyboard input to simulate zones, localStorage. No backend.
- **Core 24-Hour Demo Flow:** Start episode one, hear the storm, and feel the narration demand a surge; hit the zone and the story escapes with you. **Aha moment:** within 30 seconds the interval timer disappears into the plot.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Episode one cold-opens mid-chase, no setup.
- **Growth Vector:** Community episodes and season cliffhangers discussed in club chats.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Audio production cost. Mitigation: synthetic narration and strong writing in the PoC.
- **Technical:** Sensor latency breaking pacing. Mitigation: smooth zone detection over a rolling window.
- **Retention/Engagement:** Linear story ends. Mitigation: branching choices and community episodes.
