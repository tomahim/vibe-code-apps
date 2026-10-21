---
name: Breach Files
tagline: Replay Famous Security Breaches and Pick the Fix Before the Reveal
pitch: Step through a famous breach as the on-call responder, choose the fix, then see what really happened.
domains: [LEARN, GAME, PROD]
created: 2026-10-21T20:47:31Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Famous security breaches rebuilt as short interactive case files, in the spirit of an incident postmortem you get to steer. Each case (Equifax, Capital One, Log4Shell, MOVEit, the PHP2Shell leak of Oct 2026) opens with the first public signal: a weird log line, a traffic spike, a leaked CVE ID. You make the responder's calls in order: contain or investigate first, which system to isolate, which patch path to take, what to tell users and when. Every choice branches the timeline, and the final reveal lays your decisions next to the real timeline, including the mistakes the actual team made and what the fix ended up being.
- **Core Problem & Target User:** Developers and curious techies read breach headlines but never the postmortems, so the same lessons (patch windows, least privilege, embargo handling) stay abstract. Target user: a developer who wants real security instincts from real cases, in ten minutes per case.
- **Core Value Proposition:** Learn how famous breaches happened and how they were fixed by making the calls yourself, with the real timeline as the answer key.

#### 2. USER STORIES

- **Primary User Story:** "As a developer, I want to replay a famous breach as the responder, so that I learn what to do when it is my turn."
- **Secondary User Story:** "As a tech lead, I want each case to end with the real fix and the lesson, so that I can share it with my team as a discussion starter."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: One case file | A single hand-authored case (Equifax or the PHP2Shell leak): 6 to 8 decision points on a timeline, each with 2 to 3 plausible options, consequences, and sources linked. Fully client-side JSON. | Day 1 PoC |
| Core Mechanism: The reveal | A side-by-side of your choices vs the real timeline, the actual fix explained in plain words, and the one lesson to remember per case. | Day 1 PoC |
| Expansion 1: Case library | Five to eight cases spanning web, cloud, supply chain and process failures, on a shared case schema with an editorial checklist (sources, no invented quotes, uncertainty marked). | Month 1 MVP |
| Expansion 2: Team mode | Score nothing, discuss everything: a facilitator view for team sessions, case packs exported as PDF, and community-submitted cases under review. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. The case is a JSON graph of decision nodes; a timeline strip shows the breach unfolding as you choose. localStorage for progress. No backend.
- **Core 24-Hour Demo Flow:** Open the case, read the first signal, make 6 to 8 calls in ten minutes, then scroll the reveal comparing your line with the real one. **Aha moment:** the choice you were sure about is the one the real team also got wrong, and the fix was something else entirely.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first case starts mid-incident with the log line already on screen.
- **Growth Vector:** Each case ends with a shareable "I survived Equifax with 2/8 good calls" card, timed to land whenever a new breach is in the news.

#### 6. RISKS & MITIGATION

- **Content risk:** Getting facts wrong about real companies. Mitigation: every claim in a case links a public source, postmortem or CERT advisory; uncertainty is written as uncertainty.
- **Tone risk:** Gamifying real harm. Mitigation: cases focus on decisions and fixes, never on victims, and credit the teams that published honest postmortems.
- **Scope Creep:** Branching complexity. Mitigation: linear timeline with local branches that rejoin, never a full tree.
