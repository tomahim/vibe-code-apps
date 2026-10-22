---
name: Mother Culture
tagline: Your Sourdough Starter as a Tamagotchi That Plans Your Bakes
pitch: Feed your starter on schedule, watch its mood, and get bake-day plans timed to its peak.
domains: [GAME, PROD]
created: 2026-10-22T05:02:45Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** A sourdough starter kept like a creature instead of a chore list. Your starter (the "mother") lives in a jar on screen with a mood shaped by feeding regularity, ratio, flour type and kitchen temperature you log in ten seconds. It rises and falls on a curve predicted from your logs, so the app does the useful part: working backward from "pizza Friday at 19:00", it schedules the feedings and levain build to land the starter at peak exactly then. A missed feeding shows on its face, and a long streak earns your starter a name day.
- **Core Problem & Target User:** Home bakers kill starters by forgetting feedings and misjudge timing, so bake day starts with a flat jar. Target user: a casual home baker who wants bread on a schedule without spreadsheets.
- **Core Value Proposition:** All the timing math of sourdough, hidden behind a pet you actually enjoy feeding.

#### 2. USER STORIES

- **Primary User Story:** "As a home baker, I want the app to plan feedings backward from my bake day, so that the starter peaks exactly when I need it."
- **Secondary User Story:** "As a beginner, I want my starter's mood to tell me what I did wrong, so that I learn feeding instincts fast."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The jar | Feeding log (ratio, flour, temp), a starter avatar with mood states, and a rise curve drawn from your history. | Day 1 PoC |
| Core Mechanism: Bake-day planner | Pick a target bake time and get the feeding schedule working backward, with reminders. | Day 1 PoC |
| Expansion 1: Other cultures | Kombucha, kefir and yogurt modes with their own rhythms, photo log of rise height, and fridge "hibernation" mode for holidays. | Month 1 MVP |
| Expansion 2: Community | Starter lineage sharing (gift a discake with its care history), bake recipes tied to your starter's strength, and discard recipes for the excess. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A small fermentation model seeded by baking literature defaults, localStorage, local notifications via the Notification API. No backend.
- **Core 24-Hour Demo Flow:** Log three feedings across the demo's fast-forward mode, set "bread Saturday 10:00", and receive the backward schedule. **Aha moment:** the starter's face drops when you skip a feeding in the demo, and you feel it.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Name your starter and watch it take its first breath in the demo.
- **Growth Vector:** Starter gifting is already a real-world ritual; the lineage card makes it shareable.

#### 6. RISKS & MITIGATION

- **Accuracy risk:** Fermentation varies with flour and weather. Mitigation: the model learns from the user's own log and presents ranges, never fake precision.
- **Engagement risk:** Daily logging fatigue. Mitigation: a feeding log is two taps, and hibernation mode pauses the streak pressure.
- **Scope Creep:** A recipe database. Mitigation: Day 1 plans the starter only; recipes arrive in Expansion 2 as links.
