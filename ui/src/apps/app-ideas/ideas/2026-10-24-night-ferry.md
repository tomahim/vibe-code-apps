---
name: Night Ferry
tagline: Last Crossing at 23:40 - You Run the Old Cable Ferry, and the Radio Keeps You Company
pitch: A first-person narrative game about operating a small night ferry across a northern strait, where the passengers, the marine radio and the far shore tell a story the fog is hiding.
domains: [GAME, MEDIA]
created: 2026-10-24T03:16:58Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** The solitary-job mystery, set on moving water. You are the new operator of an old cable ferry on a northern strait - a fifteen-minute crossing, a handful of regulars, fog most nights, and a marine radio full of voices: the harbormaster, the fishing boats, the coast station that signs off at midnight. The work is tactile and rhythmic: check the cable, take the fares, read the water, log the crossing. The regulars become the story's fabric - the nurse on the late shift, the boy with the dog, a woman who crosses but seems never to arrive - and the mystery accretes through crossings: a light in a house that's been dark for years, a mayday relay you're not sure you heard, a passenger manifest from the 1960s left in the wheelhouse with one name crossed out. The ferry's smallness is the point: everyone on the water knows everyone, which means the truth is owned by people, not found in documents.
- **Core Problem & Target User:** The Firewatch-shaped hunger for quiet, voice-driven, place-soaked mystery is underserved; maritime night atmosphere is almost untouched in the genre. Target user: narrative-first players who want intimacy, weather, and a story told through work and small talk over a handful of evenings.
- **Core Value Proposition:** A crossing you make a hundred times, each one slightly different - ritual, fog, radio voices and a community mystery that surfaces the way things surface on water: slowly, then all at once.

#### 2. USER STORIES

- **Primary User Story:** "As a player, I want to run the night ferry through its crossings and rituals while a community mystery surfaces through passengers and radio voices, so that the job and the story become inseparable."
- **Secondary User Story:** "As a narrative gamer, I want relationships with the regulars and radio voices to shape what I can learn, so that trust is the mechanic that unlocks the truth."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The crossing | First-person low-poly ferry and strait at night: operate the crossing loop (cable check, fares, throttle, log), weather and fog states, passenger small-talk scenes on deck, the wheelhouse radio always murmuring. | Day 1 PoC |
| Core Mechanism: The voices | Scripted relationships: the harbormaster, three regulars, the coast-station operator; dialogue choices that build or spend trust; found artifacts (the old manifest, the log) that reframe what people tell you. | Day 1 PoC |
| Expansion 1: The full season | A 10-chapter arc across a winter season with ice, storms and one blackout night; trust-gated story branches; multiple endings based on who you believed; a free-crossing mode with ambient radio plays. | Month 1 MVP |
| Expansion 2: The living strait | A richer marine-radio layer (recorded radio plays, traffic you must work around), passenger story lines that resolve across nights, the strait's history as told by objects in the wheelhouse, and a dawn epilogue crossing. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Three.js. One ferry and strait scene with three weather states, a satisfying crossing control loop, scripted passenger scenes and radio dialogue trees, artifacts as readable in-world documents. All content local.
- **Core 24-Hour Demo Flow:** Run the 23:40 crossing with the nurse and the boy, then alone on the return leg the radio relays a faint mayday from inside the fog bank - and the coast station insists the channel was silent all night. **Aha moment:** standing in the wheelhouse between two contradictory voices you trust, with the crossing log in your own hand as the only evidence you're allowed to keep.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Open mid-crossing in fog with the cable humming underfoot and the harbormaster's voice saying "you'll get used to the night ones" - the place does the pitching.
- **Growth Vector:** Night-maritime atmosphere is fresh and clip-friendly, the regulars give the game quotable warmth, and the Firewatch-hungry audience recognizes the shape of the promise instantly.

#### 6. RISKS & MITIGATION

- **Formula fatigue:** A third solitary-job mystery must justify itself. Mitigation: the water changes the grammar - motion, weather as consequence, passengers as recurring relationships - and the trust mechanic makes community, not solitude, the engine.
- **Radio authenticity:** Fake-sounding marine radio breaks immersion. Mitigation: dialogue written with correct basic radio discipline, reviewed against public marine communication conventions, kept human rather than jargon-stacked.
- **Small-cast mystery fairness:** With few suspects, the truth must still earn its reveal. Mitigation: fair-play clueing through artifacts and overheard traffic, red herrings that resolve honestly, and an ending that recontextualizes rather than contradicts.
- **Repetition of the loop:** A hundred crossings could drag. Mitigation: the loop is short and pleasurable, every crossing varies one element (weather, passenger, radio event), and story beats are pinned to specific crossings on a strict rhythm.
