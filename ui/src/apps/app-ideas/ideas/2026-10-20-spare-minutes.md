---
name: Spare Minutes
tagline: Learn One Idea in the Gap Life Just Gave You
domains: [LEARN, PROD]
date: 2026-10-20
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Flip learning apps from "set a daily goal" to "tell me how long you have". You tap the size of the gap you just got (2, 5, or 12 minutes: a nap, a queue, a kettle) and the app serves exactly one atomic lesson that finishes inside it, drawn as a sand timer that empties as you learn. A lesson that is not finished returns to the pile without any guilt or streak loss.
- **Core Problem & Target User:** People with fragmented days, such as new parents and busy professionals, cannot commit to a fixed study slot. Streak-based apps punish them. Target user: someone curious about general culture with unpredictable free time.
- **Core Value Proposition:** Zero planning, zero guilt: whatever time you have becomes one small thing learned.

#### 2. USER STORIES

- **Primary User Story:** "As a person with unpredictable free time, I want to choose how many minutes I have, so that I get one lesson that fits exactly."
- **Secondary User Story:** "As a curious learner, I want a map of everything I have learned in small pieces, so that I can see my general culture growing over time."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Gap in, lesson out | Three gap buttons (2, 5, 12 min), 30 authored atomic lessons tagged by duration (fact card, mini story, micro quiz), a sand-timer UI, and a one-question recall check at the end. | Day 1 PoC |
| Expansion 1: Pile and map | Unfinished-lesson pile, spaced recall of past lessons inside gaps, a topic constellation map of learned atoms, local progress, dark mode for night feeds. | Month 1 MVP |
| Expansion 2: Lesson sources | Import of any saved article into a timed lesson with a summariser, shared lesson packs as markdown files, optional notification when a typical gap opens (naps, commute), exportable learning log. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Lessons as a JSON file. CSS-animated sand timer. localStorage for learned and pending lessons. No auth, no backend.
- **Core 24-Hour Demo Flow:** Open the app, tap "5 min", read a card while the sand falls, answer one question, and see a new dot added to your map. **Aha moment:** under 30 seconds from opening to reading a lesson that is already sized for your gap.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** No account and no setup: the first screen is only three big buttons.
- **Growth Vector:** Shareable lesson packs and "I learned this in a 2-minute gap" cards.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Content authoring can balloon. Mitigation: 30 lessons for the PoC and a markdown format for later packs.
- **Technical:** Fitting lessons precisely to a duration is imprecise. Mitigation: use word-count based reading time and a tolerance band.
- **Retention/Engagement:** No streaks may reduce pull. Mitigation: use the growing constellation map and gentle spaced recall instead of guilt.
