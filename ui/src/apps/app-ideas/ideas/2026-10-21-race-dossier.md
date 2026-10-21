---
name: Race Dossier
tagline: Paste a Trail Race, Get the Briefing Its Organizers Never Wrote
pitch: Paste a trail race and get a one-page briefing from its GPX and past results: finisher rate, DNF hotspots, cutoff pressure.
domains: [SPORT, MEDIA]
created: 2026-10-21T05:59:09Z
rating: 2
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Every trail race hides its real character across the organizer page, old results spreadsheets, and forum posts. Race Dossier compiles a one-page intelligence briefing for any race you paste: distance and D+ from the GPX, finisher rate and cutoff pressure from past editions results, the hour the winners usually finish, where most DNFs happen, and what the profile really feels like section by section. Presented like a case file, with evidence, not marketing copy.
- **Core Problem & Target User:** Choosing or preparing a race means hours of digging through PDFs and result sheets. Target user: a trail runner eyeing a new 50 to 100 km race who wants the truth about it in five minutes.
- **Core Value Proposition:** One page that tells you what the race actually is, backed by its own historical data.

#### 2. USER STORIES

- **Primary User Story:** "As a trail runner, I want a compiled briefing of any race from its public data, so that I can decide and prepare without hours of research."
- **Secondary User Story:** "As an anxious racer, I want DNF hotspots and cutoff pressure per section, so that I know where the race is really lost."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The file | Paste race info (GPX plus a results CSV) or use a bundled sample race, and get the dossier: profile, section breakdown, finisher stats, DNF analysis, typical winning time. | Day 1 PoC |
| Expansion 1: Race library | 50 pre-scraped European ultras from public results pages, comparison of two races side by side, a "is it harder than X" verdict, local storage of dossiers. | Month 1 MVP |
| Expansion 2: Live fetch and alerts | Automatic fetch from results platforms and ITRA pages, weather history overlay for race week, registration opening alerts, printable race-week checklist. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. GPX and CSV parsing in the browser, stats as pure functions, dossier as a single scrollable page with print CSS. No backend.
- **Core 24-Hour Demo Flow:** Open the bundled sample race file and scroll a finished dossier; then paste your own race's GPX and results. **Aha moment:** within 30 seconds you learn the race's real finisher rate and the section where dreams die.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A famous race dossier is ready to read on load.
- **Growth Vector:** Dossiers shared in runner forums and club chats before registration deadlines.

#### 6. RISKS & MITIGATION

- **Scope Creep:** Scraping every results platform. Mitigation: file-based input first, curated library second.
- **Technical:** Results files vary wildly. Mitigation: a tolerant CSV mapper with manual column assignment.
- **Retention/Engagement:** Used a few times per season. Mitigation: race comparison and registration alerts give repeat value.
