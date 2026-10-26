---
name: The Waiting List
tagline: Everything You're Waiting On, In One Place - Who, What, and Since When
pitch: A calm tracker for open loops that live in other people's hands: replies, deliveries, decisions and promises, with gentle nudge suggestions when the wait runs long.
domains: [PROD]
created: 2026-10-26T06:03:08Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Task managers track what YOU must do; almost nothing tracks what you're waiting for. The Waiting List is the other half of a todo list: every open loop that lives in someone else's hands - the email they haven't answered, the package in transit, the reimbursement in approval, the friend who said "I'll send it tonight", the landlord's repair promise. Each entry is one line (who, what, since when) filed in five seconds, and the app does the remembering: a daily glance shows everything pending with its age, aging entries drift from fresh to amber to "time to nudge", and one tap drafts a gentle follow-up ("Hi - just bumping this up your inbox"). The psychology is deliberate: filing the wait closes the loop in your head, because the list holds it so you don't have to. Resolving an entry is a small satisfaction - and the resolved archive quietly becomes a record of how long things actually take, which recalibrates your expectations of every person and vendor in your life.
- **Core Problem & Target User:** Mental overhead doesn't come from tasks alone - it comes from open loops you can't act on but can't drop: the waiting. These live in your head because no tool owns them. Target user: anyone juggling vendors, colleagues, bureaucracy, and friends; freelancers waiting on invoices; everyone who has remembered a forgotten follow-up at 2am.
- **Core Value Proposition:** Out of your head, onto the shelf: every pending wait visible with its age, gentle nudges when it's time, and a quiet record of who and what actually comes through.

#### 2. USER STORIES

- **Primary User Story:** "As a juggler, I want to file every thing I'm waiting on in five seconds and see them all with their ages, so that my head stops holding the loops."
- **Secondary User Story:** "As a follow-upper, I want nudge suggestions with a pre-drafted gentle message when a wait runs long, so that chasing people costs no composition effort."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The shelf | Five-second entry (who, what, optional expected-by), a daily-glance list sorted by age with fresh/amber/nudge drift, and satisfying one-tap resolution with an optional outcome note. | Day 1 PoC |
| Core Mechanism: The nudge | Per-entry nudge timing, a gentle follow-up message drafted per entry type (reply, delivery, payment, favor), and the resolved archive with per-person and per-vendor average wait times. | Day 1 PoC |
| Expansion 1: Connected filing | Forward-an-email or share-sheet filing with the counterparty pre-filled, expected-date extraction, reminders tied to real dates (visa validity, return windows), and a weekly "what came through" review. | Month 1 MVP |
| Expansion 2: The full picture | Calendar and email integration to auto-suggest open loops, vendor reliability stats across users (anonymized, opt-in), templates for common waits (landlord, insurance, invoice), and a "clear the shelf" monthly ritual. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. The shelf, aging logic, nudge drafts and archive in localStorage, seeded with four example waits at different ages so the drift is visible on first open. No integrations in the PoC.
- **Core 24-Hour Demo Flow:** File "Sam - apartment deposit confirmation" (already 9 days old), watch it land amber, tap nudge and get a two-line gentle follow-up ready to send - then resolve the seeded "reimbursement" entry and see its 23-day wait join Sam's reliability record. **Aha moment:** the first full glance at the shelf - six things you'd half-forgotten you were waiting on, all in one place, and the 2am remembering simply stops.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** "What are you waiting for right now?" - most people can name three things in ten seconds, and filing them is the entire onboarding.
- **Growth Vector:** The relief is immediately felt and told ("it's the other half of a todo list"); freelancers and consultants spread it as an invoice-chasing tool, and the weekly review becomes a ritual people show each other.

#### 6. RISKS & MITIGATION

- **Just another list to maintain:** If filing feels like work, the shelf empties. Mitigation: entry is deliberately five seconds with no required fields beyond who and what, resolution is one tap, and the app never punishes a stale shelf - it just waits with you.
- **Nudge tone:** Chasing messages must not read as passive-aggressive. Mitigation: drafts are written warm and short, per-relationship tone settings (formal vendor, casual friend), and the user edits before anything sends - the app drafts, never sends.
- **Judgment creep:** Per-person wait stats could sour relationships if read as scores. Mitigation: stats are framed as expectation-setting ("reimbursements here average 3 weeks"), private by default, and people-stats focus on your peace of mind, never shared rankings.
- **Privacy of the shelf:** The list reveals your affairs. Mitigation: local-first storage, no social features, PIN lock option, and vendor stats (Expansion) are opt-in and anonymized before any aggregation.
