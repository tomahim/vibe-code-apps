---
name: The Inscription
tagline: One Stone a Day - Curse Tablets, Beer Receipts and Boundary Stones, Deciphered With the Real Scholarship
pitch: Read one ancient inscription daily - Ogham stones, cuneiform tablets, Roman graffiti - guided from photograph to transliteration to translation by the actual published reading.
domains: [HIST, LEARN]
created: 2026-11-03T06:03:25Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Most ancient texts that survive are not epics - they are receipts, curses, boundary markers, love notes and graffiti, and they are the most direct voice the ancient world has. The Inscription deals you one a day. You start from the object itself: the photograph of a Bath curse tablet or a Sumerian beer account. Stage one: the script, with the sign list beside you - match what you see to what the tablet shows. Stage two: the transliteration, where your guesses resolve into actual words. Stage three: the translation with the published reading, and the story - who wrote it, why, and how scholars know. A growing script shelf tracks which writing systems you can now actually sound out (Ogham, cuneiform, hieroglyphic basics, runes), because reading even badly is a different relationship with the past than reading about.
- **Core Problem & Target User:** Epigraphy is the most romantic corner of historical scholarship and the least accessible: inscriptions sit in catalogs and museum labels reduced to a sentence, and nobody hands a beginner the photograph and the sign list and says "try." Target user: history readers who want contact with primary sources, language nerds, museum-goers who want the labels to come alive, and crossword people looking for a better puzzle.
- **Core Value Proposition:** The daily puzzle where the answer is two thousand years old: real objects, real scripts, real scholarship, and the slow genuine ability to sound out writing systems nobody has spoken in millennia.

#### 2. USER STORIES

- **Primary User Story:** "As a history lover, I want one real inscription a day guided from photograph to translation, so that I touch primary sources instead of summaries."
- **Secondary User Story:** "As a learner, I want to build working familiarity with ancient scripts over months, so that museum objects and site stones become readable rather than decorative."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The daily stone | One inscription per day in three guided stages (script matching, transliteration, translation with the published reading and its story). | Day 1 PoC |
| Core Mechanism: The script shelf | Your growing familiarity per writing system (signs learned, inscriptions read), with review drills on the signs you have met. | Day 1 PoC |
| Expansion 1: The catalog | Browsable archive by civilization and script, themed weeks (curses, receipts, love letters, borders), and harder modes that hide more of the scaffolding. | Month 1 MVP |
| Expansion 2: The field kit | Museum mode (type a label's inventory number, get the reading), site guides for inscription-rich places, and community-submitted stones with source review. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. A bundled launch set of about twenty inscriptions with public-domain or museum-open-access photographs, sign lists, transliterations and the published translation with source citation. The three-stage reading flow and the script shelf. No backend, no accounts; all content static. Works on phone, since museum mode is the future home.
- **Core 24-Hour Demo Flow:** Today's stone: a lead curse tablet from Roman Bath, thrown into the spring asking the goddess to punish a thief. Match the cursive letters, resolve the transliteration, then read the translation - "May he who carried off Vilbia from me become liquid as the water" - and the story of how hundreds of these were dredged from the spring. The "Aha!" moment: realizing you just read a stranger's anger across nineteen centuries, letter by letter, yourself.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first tablet is a better story than any quiz, and the three-stage flow makes decipherment feel achievable within ten minutes.
- **Growth Vector:** The daily format shares naturally ("today's stone was a Babylonian beer receipt"), museum mode ties the habit to real visits, and the script shelf gives a long-term progression that crossword habits understand.

#### 6. RISKS & MITIGATION

- **Accuracy risk:** Translations and readings carry scholarly debate; oversimplification miseducates. Mitigation: every inscription cites its published source, contested readings say so, and the app teaches that epigraphy is an argument, not an oracle.
- **Rights risk:** Photographs of inscriptions are often rights-restricted. Mitigation: launch set uses public-domain and open-access museum photography only, with attribution on every object.
- **Difficulty risk:** Real scripts can frustrate fast. Mitigation: the early shelf leans on high-scaffolding stages and short inscriptions, difficulty ramps by hiding help, and skipping to the translation is always allowed - the reading is the reward, not the test.
