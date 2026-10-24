---
name: Knob Conservatory
tagline: Learn Synthesis One Knob at a Time, Proving Each Lesson by Ear
pitch: Atomic synthesis lessons on a vintage-synth replica - one knob, one sound goal per lesson - with ear-matching exams where you recreate a target sound blind.
domains: [LEARN, MEDIA]
created: 2026-10-24T03:02:06Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Synth tutorials dump the whole panel on you at once. Knob Conservatory teaches subtractive synthesis the way a conservatory teaches an instrument: one gesture at a time, graded by ear. The app is a faithful-looking replica of a classic three-oscillator monosynth, but lessons unlock its panel progressively - lesson 1 gives you only the filter cutoff and asks you to make the sound "open like a curtain". Each lesson pairs a 30-second explanation with a sound goal you must hit. Exams are ABX-style: the app plays a target sound, you turn the knobs you have learned so far until your sound matches, and the app scores how close you got - by ear, not by peeking at the target settings.
- **Core Problem & Target User:** Synthesis learning materials are either videos you passively watch or manuals you read without touching anything; knowledge never reaches the hands. Target user: a producer-curious beginner who wants real ear skills and knob intuition, in five-minute daily sessions on the phone.
- **Core Value Proposition:** Ear-first synthesis training with progressive unlocks and blind sound-matching exams - the difference between knowing what a filter is and being able to hear one.

#### 2. USER STORIES

- **Primary User Story:** "As a beginner, I want one-knob lessons with instant sound feedback, so that I build real intuition for what each control does."
- **Secondary User Story:** "As a returning learner, I want blind sound-matching exams, so that I can prove I actually hear the parameters instead of memorizing positions."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The replica | A WebAudio subtractive synth (3 oscillators, filter, 2 envelopes, LFO) behind a vintage-styled panel, touch-friendly knobs, everything playable via a small keyboard strip. | Day 1 PoC |
| Core Mechanism: The lessons | A lesson path as JSON: each lesson unlocks one knob, gives a short explanation, and a sound goal validated by ear-matching against a target patch within tolerance. | Day 1 PoC |
| Expansion 1: The exam hall | Graded ABX exams per chapter (match 5 sounds), streaks and review lessons resurfacing earlier knobs, a daily five-minute practice session. | Month 1 MVP |
| Expansion 2: The workshop | Free-play mode with the full panel, save and share patches, community challenges ("make the saddest bass"), and a second synth replica (FM) as an advanced course. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, WebAudio (or Tone.js) for the synth engine. Lessons as JSON files (same pattern as the repo's Three.js and Rust learning apps), progress in localStorage. Knob components are custom SVG with pointer-drag handling.
- **Core 24-Hour Demo Flow:** Lesson 1 unlocks only the cutoff knob: sweep it and hear the sound open, then match a target brightness within tolerance to pass; lesson 2 adds resonance. **Aha moment:** passing a blind match - you turned one knob until it sounded right, and the app confirms your ear was correct.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** First lesson takes under two minutes and ends with a pass stamp; the panel visibly has 30+ locked knobs, which makes the path ahead tangible.
- **Growth Vector:** Passing exam certificates ("Chapter 2: Envelopes, matched 5/5 by ear") are shareable proof of a real skill, and the free-play patch sharing extends into the community.

#### 6. RISKS & MITIGATION

- **Matching tolerance:** Exact parameter matching is frustrating; loose matching teaches nothing. Mitigation: tolerance bands per parameter tuned by testing, partial credit shown as a distance meter, and a "cheat" that reveals the gap after three failed tries.
- **Mobile knob ergonomics:** Rotary knobs are fiddly on phones. Mitigation: vertical-drag everywhere (no circular gestures), large hit targets, and fine-adjust mode on long press.
- **Content depth:** Good lessons are the hard part. Mitigation: the JSON lesson format is easy to extend, lessons are ordered by what a working sound designer would teach first, and exams reuse generated target patches so content scales without writing.
