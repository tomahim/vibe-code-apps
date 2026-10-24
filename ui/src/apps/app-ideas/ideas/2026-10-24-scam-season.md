---
name: Scam Season
tagline: Know the Script Before the Scammer Reads It to You
pitch: A living field guide to the scam scripts circulating right now, with a branching simulator that lets you practice the conversation safely.
domains: [LEARN, GAME, MEDIA]
created: 2026-10-24T02:51:43Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Scams are scripts: the fake bank fraud call, the wrong-number romance, the delivery fee text, the "hi mum, new phone" message. They follow beats, and beats can be rehearsed. Scam Season tracks which scripts are circulating this month (from public reporting and consumer-protection sources) and presents each as a field-guide entry: the opening line, the pressure moves, the moment money or codes get requested, and the exit lines that work. Each entry pairs with a practice run: a branching chat simulation where the scammer role-plays the script and you pick your replies, with the simulation pausing at the critical juncture to explain what just happened ("this is where they isolate you from verification"). A season pass framing keeps it current: this month's three active scripts get refreshed as reporting shifts.
- **Core Problem & Target User:** Fraud losses keep climbing because the scripts mutate faster than awareness campaigns, and the people most targeted (older relatives especially) never get to practice. Target user: anyone who wants to recognize a scam mid-conversation, and the family member who ends up being the help desk after a parent gets a suspicious call.
- **Core Value Proposition:** Rehearsal, not lecture: you have already heard this script and already picked the right exit line, before a real criminal ever tries it on you.

#### 2. USER STORIES

- **Primary User Story:** "As a potential target, I want to read and rehearse the scam scripts circulating right now, so that I recognize the opening beats when a real one reaches me."
- **Secondary User Story:** "As a family help desk, I want to send my parents one current script with a two-minute practice run, so that protecting them does not depend on me answering the phone in time."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The field guide | Three current scripts (fake bank call, delivery fee text, family-impersonation message) as readable entries: beats, pressure moves, red-flag moments, working exit lines, and sources for currency. | Day 1 PoC |
| Core Mechanism: The practice run | A branching chat simulator per script: the scammer plays its role, the user picks replies, wrong turns get a gentle rewind with an explanation, finishing earns a "spotted it" stamp. | Day 1 PoC |
| Expansion 1: Living season | Monthly refresh of active scripts from consumer-protection agencies and public reporting, a report-a-script form whose submissions inform the guide, and per-region editions. | Month 1 MVP |
| Expansion 2: Family circles | A share flow that sends one script to a relative with a gentle framing, completion signals back ("mum finished the bank-call practice"), and a voice-call simulation mode for phone scripts. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Scripts and dialogue trees are typed content files authored from public consumer-protection guidance; the simulator is a local state machine. No backend, no AI generation in the PoC, which keeps every word reviewed and safe.
- **Core 24-Hour Demo Flow:** Open the "fake bank fraud department" entry, skim the beats, then run the practice: the caller says there are suspicious charges and you must move money to a safe account; pick "I will call the number on my card" and the simulation pauses: "Correct. Real banks never ask you to move money. The script just lost." **Aha moment:** users physically feel how fast the pressure escalates, and how one sentence ends it.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The landing page plays the first three lines of the most common current script and asks "what do you say next?" - everyone wants to know if they would pass.
- **Growth Vector:** Every viral scam wave is a relaunch: "the delivery-text script is back" posts send people to practice, and the family-share flow turns worried adult children into the distribution channel.

#### 6. RISKS & MITIGATION

- **Teaching the wrong lesson:** A simulator could over-train pattern matching on stale scripts. Mitigation: every entry teaches the invariant rule (hang up, verify through a known channel, never move money or share codes) above the specific beats, and entries carry a last-verified date.
- **Currency burden:** Stale guidance is worse than none. Mitigation: the season framing makes refresh the product's core loop, sources are cited per script, and unverifiable scripts are dropped rather than left to rot.
- **Distressing content:** Rehearsing a scam can unsettle exactly the people it protects. Mitigation: gentle tone, no real victim stories, instant exit from any simulation, and the rewind framing keeps it playful rather than frightening.
- **Misuse of scripts:** Publishing scripts hands template material to bad actors. Mitigation: scripts are paraphrased and incomplete on purpose, omitting the operational details; the goal is recognition, and every beat is already widely documented by consumer agencies.
