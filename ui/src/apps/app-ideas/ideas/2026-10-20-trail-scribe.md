---
name: Trail Scribe
tagline: Turn Every Run Into One Line and the Season Into a Book
domains: [SPORT, WRITE]
created: 2026-10-20T20:17:05Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** After each run you get a "page prompt" built from your own data: a cold 6 am start, a long climb, a slow last kilometre. You write one line about it. A run without a line stays a blank page in your season book. Pages bind into chapters by training block, and the finished season can be exported as a small zine. The motivation is to have something worth writing about.
- **Core Problem & Target User:** Running logs hold numbers but lose the feel of the run. Target user: a runner who enjoys writing or reflection and wants a motivating, low-effort journal ritual.
- **Core Value Proposition:** Runs become memories you keep, and a blank page the next morning nudges you out the door.

#### 2. USER STORIES

- **Primary User Story:** "As a runner, I want a prompt from my run data, so that writing one line takes seconds."
- **Secondary User Story:** "As a runner preparing a big race, I want my season as a readable book, so that I can look back at the journey."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Data to prompt to page | Manual run entry (distance, D+, time, feel), a prompt generator from templates and the data, a 140-character line input, and a book view where each run is a page with its stats and line. | Day 1 PoC |
| Expansion 1: Chapters and import | Chapters by training block, cover design by season, GPX and Strava export import, search and tags, markdown export, local storage. | Month 1 MVP |
| Expansion 2: Zine and sharing | Printable PDF zine layout, race chapter with a longer entry, optional share of single pages as images, Strava OAuth sync, yearly recap. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Prompt templates as JSON, localStorage for pages, CSS page-turn animation for the book view. Mobile-first.
- **Core 24-Hour Demo Flow:** Log a 22 km run with 1100 m D+, get the prompt "Where did the climb get quiet?", write one line, and see a new page join the book. **Aha moment:** under 30 seconds you have a page you will want to reread.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first prompt appears right after the first logged run, no setup.
- **Growth Vector:** Share single page images and the finished zine with the running community.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Layout and printing can balloon. Mitigation: a simple on-screen book only in the PoC.
- **Technical:** Prompts may feel generic. Mitigation: use several data-aware templates and rotate them.
- **Retention/Engagement:** Writing may feel like homework. Mitigation: a strict one-line limit and skip-friendly blank pages that nudge instead of punish.
