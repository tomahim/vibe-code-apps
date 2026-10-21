---
name: Anniversary Desk
tagline: Write the Front Page for Today's Date, Any Year in History
pitch: Get three facts from this date in a past year plus a voice constraint, and write a 60-word dispatch for your wall.
domains: [HIST, WRITE]
created: 2026-10-21T05:02:04Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Every morning the app opens a desk on the same calendar date in a different historical year. You get three raw facts and one constraint ("write as a local shopkeeper", "in 60 words", "no names"). You write a tiny dispatch from that day. Past dispatches pin onto a wall organised by year, building a personal wall of history written by you instead of consumed.
- **Core Problem & Target User:** On-this-day feeds are skimmed and forgotten, and writing habits need prompts. Target user: a history fan who wants a 5 minute daily writing ritual that also teaches.
- **Core Value Proposition:** Learn one real moment of the past by writing about it, and build an archive of short pieces.

#### 2. USER STORIES

- **Primary User Story:** "As a history fan, I want a daily date-based prompt with facts, so that I write a short piece about a real day in the past."
- **Secondary User Story:** "As a blogger, I want my pieces collected by year and exportable, so that they can become posts later."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Today's desk | 60 hand-authored dated events (with 3 facts each), a perspective constraint picker, a 60-word editor with live count, a save button that pins the note to a timeline wall. | Day 1 PoC |
| Expansion 1: Wall and archive | Wall by year and by theme, streak-free calendar of days written, markdown export, search, optional "reveal the real account" card after writing. | Month 1 MVP |
| Expansion 2: Full calendar | 366 days of events from open data with sources, region packs (France, Switzerland), rewrite suggestions, shareable dispatch card images, weekly digest. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Events in JSON keyed by month-day, date from the browser clock, localStorage for notes. Newspaper-style CSS. No backend.
- **Core 24-Hour Demo Flow:** Open the app, read three facts for today, choose a voice, write 60 words, and see the card pinned to the wall. **Aha moment:** under 30 seconds you have a prompt that is real, specific, and doable.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** No account, today's desk is ready when you land.
- **Growth Vector:** Dispatch cards shareable as images, and a daily same-prompt hook for friends.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Building a big events dataset. Mitigation: 60 curated events for the PoC.
- **Technical:** Accuracy of facts. Mitigation: keep to well sourced events and add a source link on each.
- **Retention/Engagement:** Writing fatigue. Mitigation: very short format and a skip button without penalty.
