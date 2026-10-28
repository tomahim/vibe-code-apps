---
name: Still Life
tagline: Describe the Same View Every Day for a Year, and Watch Attention Become a Portrait
pitch: Pick one object or view, write one short paragraph about it each day, and the app binds your accumulating descriptions into a portrait of how you see.
domains: [WRITE, HIST]
created: 2026-10-28T06:03:08Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Painters return to the same haystack, the same mountain, the same bowl of fruit until seeing itself becomes the subject. Still Life gives writers the same discipline: you choose one fixed subject (the view from your kitchen window, a plane tree on your street, a brass lamp on your desk) and describe it in one short paragraph each day. No prompts, no topics - the constraint is the point. The app binds the entries chronologically into a portrait, and its reading view lets you scrub through the year watching light, weather, mood and attention shift across the same unmoving subject. Annotations mark where your eye learned something new ("first time I noticed the crack in the sill").
- **Core Problem & Target User:** Daily writing habits die from topic fatigue: the blank page asks "what today?" until the answer is "nothing." Meanwhile the most interesting thing a writer owns is their own attention, which is exactly what generic journals never isolate. Target user: people who want a writing practice with zero topic decisions, and anyone curious what sustained looking does to their prose.
- **Core Value Proposition:** One permanent subject removes all friction except the writing itself, and the accumulation becomes something no single entry could be: a time-lapse of your own perception, written in your own hand.

#### 2. USER STORIES

- **Primary User Story:** "As a writer, I want to describe the same subject in one paragraph each day, so that I build a daily practice with no topic decisions and prose that visibly deepens."
- **Secondary User Story:** "As the portrait's reader, I want to scrub through months of entries over the same subject, so that I can see how seasons, events and my own attention changed the description."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The daily sitting | Choose your subject once (name, optional photo); each day offers one clean writing field for today's paragraph, stamped with date and weather if allowed. | Day 1 PoC |
| Core Mechanism: The portrait | All entries bound in a chronological reading view with a scrubber; flipping through reads like time passing over one unmoving subject. | Day 1 PoC |
| Expansion 1: The painter's eye | Annotation marks for noticed-firsts, word-frequency drift across the year ("how often you say light"), season groupings, and a gentle nudge at your chosen hour. | Month 1 MVP |
| Expansion 2: The exhibition | Export the portrait as a print-ready booklet, a paired view of first and latest entry, and an optional second subject once the first portrait closes at one year. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Subject setup screen, daily writing field, and the bound portrait with a month scrubber. localStorage only; no backend, no accounts, no photo upload on day 1. Mobile-first, since the daily sitting should fit a spare minute.
- **Core 24-Hour Demo Flow:** Open the app and a sample portrait of a plane tree is already a month deep: scrub through thirty short paragraphs and watch October arrive in the writing. Then name your own subject, write today's paragraph, and see it join the binding. The "Aha!" moment: scrolling the sample portrait and realizing paragraph twenty notices things paragraph one walked past.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The sample month demonstrates the payoff before any commitment, and the first sitting asks for one paragraph about something already in front of you.
- **Growth Vector:** Paired first-and-latest excerpts are inherently shareable ("day 1 vs day 90 of the same tree"), and the one-year bound booklet is a keepsake people finish habits for.

#### 6. RISKS & MITIGATION

- **Engagement risk:** Repetition is the concept and also the dropout risk; some days the subject genuinely does not change. Mitigation: entries have no minimum length, "nothing changed today" is a legitimate and sometimes beautiful entry, and the scrubber makes even flat stretches pay off in accumulation.
- **Tone risk:** The app could feel precious or prescriptive about good writing. Mitigation: no scores, no style feedback, no streaks with guilt - the only metric is the growing binding.
- **Scope creep risk:** Multiple subjects, social galleries, AI critique. Mitigation: one subject until the first portrait closes; sharing is export-only; the app describes nothing itself.
