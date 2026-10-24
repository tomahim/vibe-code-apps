---
name: Mix Night School
tagline: A Browser Mixing Desk That Teaches You to Mix, One Blind Test at a Time
pitch: Load real multitrack stems in a browser console and a coach walks you through one mixing move per night - level, pan, EQ, compression - then grades you with a blind ABX test against a reference mix.
domains: [LEARN, MEDIA]
created: 2026-10-24T03:02:09Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Mixing is the dark art of music production: everyone knows it matters, almost nobody can hear what to do, and tutorials are someone else's song, someone else's screen. Mix Night School turns it into nightly practice. You get a real multitrack session (drums, bass, keys, vocals) in a clean browser console - faders, pans, a three-band EQ, one compressor per channel - and a coach that teaches exactly one move per session: tonight, "the vocal sits 2 dB above the snare, find it by ear." Then the exam: the app plays the reference mix and your mix blind, in random order, and asks which is closer to balanced - and over nights it scores whether you can actually hear the moves you are learning. It is Ableton's mixer stripped to the 20% that matters, wrapped in a course.
- **Core Problem & Target User:** Bedroom producers finish songs that sound muddy next to anything on a playlist, and mixing advice does not stick because it is never practiced by ear. Target user: a hobbyist producer with a few finished tracks who suspects the mix, not the songwriting, is what sounds "demo".
- **Core Value Proposition:** Ear training for mixing on real multitracks, one skill per night, with blind tests that prove - to you, not to a video - that you can hear the difference.

#### 2. USER STORIES

- **Primary User Story:** "As a hobbyist producer, I want nightly guided mixing exercises on real stems, so that I build practical mixing skills instead of collecting tips."
- **Secondary User Story:** "As a returning learner, I want blind ABX exams against the reference mix, so that I know my ears - not my eyes - are improving."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The console | A WebAudio channel strip per stem: fader, pan, 3-band EQ, one-knob compressor; five bundled multitrack sessions in different genres; solo/mute, and a master bus meter. | Day 1 PoC |
| Core Mechanism: The lesson | One skill per session (gain staging, vocal level, panning space, EQ carving, bus glue) with a short explainer, a guided exercise, and a blind ABX exam against the reference. | Day 1 PoC |
| Expansion 1: The curriculum | A 30-night curriculum with progressive sessions, review nights, streaks, and a hearing-profile summary ("your weak spot: low-mid buildup"). | Month 1 MVP |
| Expansion 2: Your own mixes | Import your own stems for coached mixing, community sessions where everyone mixes the same song and votes blind, and mix-down export. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, WebAudio (GainNode, StereoPanner, BiquadFilters, DynamicsCompressor) with stems as bundled audio files, lessons as JSON (same pattern as the repo's other learning apps), progress in localStorage. ABX engine shuffles playback order and scores choices.
- **Core 24-Hour Demo Flow:** Night 1 lesson: balance drums and bass by fader alone. You mix, then the app plays your balance and the reference blind three times and asks you to pick the reference; you pass at 2 of 3. **Aha moment:** failing the first blind test and hearing why - suddenly "I can't hear 2 dB" is a concrete, trainable fact.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Night 1 takes five minutes and ends with a score; the curriculum map showing 30 nights makes the journey feel like a game board.
- **Growth Vector:** "I mix one song a night and my ears are measurably improving" is a compelling identity to share, and community same-song mixes are inherently social.

#### 6. RISKS & MITIGATION

- **Loudness bias:** Louder always sounds better in AB tests, which corrupts the lesson. Mitigation: automatic loudness matching (LUFS normalization) before every comparison, stated openly as part of the method.
- **Stems licensing:** Real multitracks have rights issues. Mitigation: bundle commissioned or openly licensed multitracks (e.g. Cambridge MT-style open stems), and keep user imports clearly personal-use.
- **Reference dogma:** There is no single correct mix, and a rigid reference can teach bad taste. Mitigation: the coach teaches ranges and trade-offs ("more vocal = intimacy, less = energy"), and later nights present two valid references with different aesthetics.
