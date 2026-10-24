---
name: Eight Bars
tagline: A Browser DAW With One Rule - 4 Tracks, 8 Bars, 10 Minutes
pitch: An Ableton-style clip grid that fits on a phone, constrained to 4 tracks and 8 bars with a 10-minute session timer, so you always finish a loop and share it instead of abandoning a project.
domains: [MEDIA, PROD, GAME]
created: 2026-10-24T03:02:07Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Every "DAW in the browser" project tries to recreate the whole desktop giant and drowns in complexity. Eight Bars takes the one part of Ableton people actually love - the Session View clip grid - and shrinks everything else with hard constraints: exactly 4 tracks (drums, bass, chords, lead), exactly 8 bars, and a 10-minute session timer ticking at the top. Clips are colored blocks you tap to launch, exactly like Ableton's scene launching, and everything you launch locks to the beat so it is impossible to sound off-time. When the timer ends, the app renders your loop and gives you the share link whether you feel ready or not. The constraint is the product: a finished loop every session, like a constraint card game for music.
- **Core Problem & Target User:** Music software suffers from the unfinished-project graveyard: endless options mean nothing gets done. Target user: a producer-curious person on a break, in a queue, on the bus - someone who wants the flow of launching clips without a laptop, a controller, or an evening.
- **Core Value Proposition:** The Ableton Session View feeling compressed into a 10-minute mobile ritual that always ends with a finished, shareable loop.

#### 2. USER STORIES

- **Primary User Story:** "As a casual beatmaker, I want a clip grid with hard limits and a session timer, so that I finish a loop every time instead of tinkering forever."
- **Secondary User Story:** "As a returning user, I want my finished loops collected with their grid layouts, so that I build a catalog of daily sketches I can revisit."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The grid | A 4x8 clip grid with sample-based instruments per track, tap to record/launch/stop clips, all launches quantized to the bar, tempo and key fixed per session card. | Day 1 PoC |
| Core Mechanism: The timer | 10-minute session countdown; at zero the loop is rendered via OfflineAudioContext and presented with a share link. Sessions and loops stored locally. | Day 1 PoC |
| Expansion 1: The deck | Daily session cards as creative prompts ("95 BPM, minor, no snare on 1"), loop catalog with grid thumbnails, mute/solo per track, one FX send (delay). | Month 1 MVP |
| Expansion 2: The league | Weekly shared session card where everyone works under the same constraints and votes on each other's loops; duet sessions where two phones share one grid. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Tone.js for transport-scheduled clip launching and mixing, OfflineAudioContext (via Tone.Offline) for the final render. Sample library bundled as a small curated set. No backend; share links serialize the grid state and settings into the URL.
- **Core 24-Hour Demo Flow:** Start a session, tap-record a drum clip in the first cell, launch a bass loop under it, layer chords, and watch the timer force you to commit - then hear the rendered loop and copy the link. **Aha moment:** at minute ten you actually have a finished thing, which no unlimited DAW ever gave you.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The first session starts prefilled with a drum clip already playing, so the first tap is adding your own layer, not facing an empty grid.
- **Growth Vector:** Every loop link is self-demonstrating ("made this in 10 minutes on my phone"), and daily session cards give people a reason to come back tomorrow.

#### 6. RISKS & MITIGATION

- **Timing drift:** Web timing is not sample-accurate and sloppy quantization ruins the feel. Mitigation: all launches scheduled against the audio clock (never setTimeout), and record quantize to 16ths by default.
- **Small-screen ergonomics:** Finger-sized clips on a phone grid are the whole product. Mitigation: minimum 64px cells, tap-and-hold for options instead of tiny icons, landscape optional but never required.
- **Sound sameness:** A fixed bundled kit makes every loop sound alike. Mitigation: per-session sound palette cards (different kit each session), tempo/key variety from the session card, and the weekly shared card that turns sameness into a game.
