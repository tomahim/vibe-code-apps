---
name: Ornithopter
tagline: Build History's Doomed Flying Machines, Fly Them, and Learn Exactly Why They Fell
pitch: Assemble historical aircraft designs (da Vinci's flapper, Lilienthal's glider, early failures and first successes) in 3D, test-fly them in a gentle physics sandbox, and discover the engineering each one taught.
domains: [3D, HIST]
created: 2026-11-02T06:03:31Z
rating: 3
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Flight was invented by people whose machines mostly did not fly - and every crash taught the specific lesson the next design needed. Ornithopter is a workshop of history's flying machines, glorious and doomed alike. Each aircraft arrives as a period blueprint you assemble piece by piece in 3D: da Vinci's flapping wings, Cayley's governable parachute, Lilienthal's bat-wing glider, Ader's bat-like Eole, the Wright Flyer. Then you fly it in a soft physics sandbox tuned for learning rather than simulation purism - and watch what the historical record said would happen, happen: the ornithopter beats frantically and goes nowhere (not enough power, too much structure), the glider soars until the gust (insufficient control). Each flight ends with the lesson card: the engineering principle this machine proved, disproved or died for, and the design that learned from it next.
- **Core Problem & Target User:** The prehistory of flight is told as a montage of crackpots until 1903, which hides the actual story: a century of systematic failure, each one isolating a variable (lift, power, control) that the Wrights finally combined. Target user: aviation-curious minds, engineering students, makers, and anyone who learns physics best by watching beautiful things fail informatively.
- **Core Value Proposition:** The history of flight as a hands-on failure museum: assemble the machines, reproduce their outcomes, and absorb the aerodynamics each era paid for - no equations required, all of it real.

#### 2. USER STORIES

- **Primary User Story:** "As a learner, I want to assemble historical aircraft and fly them in a sandbox, so that I understand why each succeeded or failed by seeing it happen."
- **Secondary User Story:** "As a history lover, I want each machine's real story and the lesson it taught, so that the path from flapping wings to the Flyer reads as engineering rather than luck."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The workshop | One aircraft as a 3D assembly puzzle from its period blueprint, with annotated parts (what each piece was meant to do). | Day 1 PoC |
| Core Mechanism: The proving ground | A gentle flight sandbox (wind, slope launch, simple lift and drag) where the assembled machine reproduces its historical behavior, ending in the lesson card. | Day 1 PoC |
| Expansion 1: The full hangar | Five to eight machines across the century, free-build mode mixing historical parts, and a timeline wall connecting each failure to the design that learned from it. | Month 1 MVP |
| Expansion 2: The wind tunnel | A visible-airflow mode (streamlines over wings), design-your-own machine with a test-pilot scoring run, and shareable flight clips of your most instructive crashes. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. One machine (Lilienthal's glider: dramatic, well-documented, actually flies) as the assembly blueprint, the slope-launch sandbox with simplified aerodynamics, and its lesson card. Blueprint and story content bundled. No backend, no accounts.
- **Core 24-Hour Demo Flow:** Assemble the bat-wing glider rib by rib over its 1891 blueprint, carry it to the hill, and launch: a soaring few seconds, then the gust that Lilienthal's weight-shifting control cannot answer - and the lesson card explaining that control, not lift, was the century's real missing piece. The "Aha!" moment: the crash stops being funny and becomes the syllabus.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** One machine, one flight, one lesson - the full loop runs in minutes and the assembly alone is satisfying.
- **Growth Vector:** Crash clips are inherently shareable, the failure-museum framing is a natural fit for educators and museums, and free-build mode gives tinkerers a reason to stay.

#### 6. RISKS & MITIGATION

- **Physics risk:** A toy simulation that contradicts reality teaches wrong lessons. Mitigation: the sandbox is tuned so each historical machine reproduces its documented behavior, and lesson cards separate verified aerodynamics from the simplified model.
- **Tone risk:** Doomed inventors are easy to mock; Lilienthal died at his work. Mitigation: the framing is honorific throughout - these machines are presented as experiments that bought knowledge, with the people treated as the engineers they were.
- **Scope creep risk:** Full flight sim, combat, multiplayer. Mitigation: the loop stays assemble, fly, learn; realism features (airflow, free-build) serve the same teaching goal.
