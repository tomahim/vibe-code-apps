---
name: The Handoff
tagline: End Your Workday Like a Keeper Ending a Watch - Log It, Seal It, Ring the Bell
pitch: A two-minute end-of-shift ritual that parks your open loops in a shift log and writes tomorrow's first move, so the day actually ends and tomorrow starts fast.
domains: [PROD, WRITE]
created: 2026-10-27T06:03:19Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Lighthouse keepers, ship's officers and hospital nurses never just stop working; they hand over. The Handoff brings the change-of-watch ritual to knowledge work. At the end of your day you fill the shift log: what moved, what is parked and why, what the next watch (tomorrow's you) should pick up first. Then you seal the log and ring the bell - the day is formally over, and the app goes dark until morning. Tomorrow opens not with a blank todo list but with last night's log waiting at the top: "The previous watch left you three notes and a first move."
- **Core Problem & Target User:** Knowledge work has no closing time, so open loops follow people to dinner and open loops greet them at 9am. Shutdown rituals are known to help but are too vague to stick. Target user: developers and other knowledge workers whose days blur into evenings and whose mornings start with twenty minutes of reloading context.
- **Core Value Proposition:** A two-minute ritual with a real artifact: yesterday gets sealed instead of abandoned, and tomorrow's first move is already written, so evenings close and mornings open.

#### 2. USER STORIES

- **Primary User Story:** "As a knowledge worker, I want to log my open loops and tomorrow's first move in a two-minute ritual, so that I can stop thinking about work after work."
- **Secondary User Story:** "As tomorrow's me, I want the previous watch's log waiting when I start, so that I reload context in one read instead of reconstructing my afternoon."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The shift log | A guided three-field handover (what moved, what is parked and why, the next watch's first move) written into a dated log entry with a seal action that closes the day. | Day 1 PoC |
| Core Mechanism: The morning watch | Next time the app opens, the sealed log from the previous watch is presented first: the parked loops and the pre-written first move, ready to accept. | Day 1 PoC |
| Expansion 1: The standing orders | Recurring context pinned across watches (project names, current sprint, people you are waiting on), a week view of past logs, and streak of sealed days. | Month 1 MVP |
| Expansion 2: The full watch bill | Optional calendar-aware prompt at your chosen end-of-day time, plain-text export of a log for an actual teammate handover, and a monthly watch-book summary. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Two screens: the evening log form with its seal animation, and the morning handover view. Entries dated and kept in localStorage; a sealed day renders the app in a quiet "off watch" state until the next open. No backend, no accounts, no notifications on day 1. Mobile and desktop.
- **Core 24-Hour Demo Flow:** Open the app in "evening" and a sample log is half filled: "Parked: the invoice bug, waiting on Marie's review." Write your three fields, hit Seal the Day, and the log stamps itself closed. Reopen and the morning watch greets you with that same log at the top and one question: "First move: reopen the invoice branch?" The "Aha!" moment: seeing how different tomorrow feels when yesterday bothered to leave a note.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first seal takes two minutes and the effect is felt the same evening; no setup, no import, no integrations needed to start.
- **Growth Vector:** The ritual is contagious inside teams (real handover export makes it useful between actual colleagues), and the sealed-day streak gives a gentle daily pull without gamifying rest.

#### 6. RISKS & MITIGATION

- **Engagement risk:** End-of-day rituals die exactly when days get hard. Mitigation: the log is three fields and two minutes by design, a partial log still seals, and the seal (not the streak) is the rewarded act.
- **Boundary risk:** An "off watch" state could become another source of guilt or a lockout people resent. Mitigation: the sealed state is soft (one tap to peek, logged honestly), never punitive; it marks the day, it does not police it.
- **Scope creep risk:** Task manager features, integrations, team dashboards. Mitigation: the app is deliberately not a todo list; parked loops are prose, and task sync is out of scope through Month 3.
