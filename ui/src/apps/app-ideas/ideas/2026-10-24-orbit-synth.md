---
name: Orbit Synth
tagline: A Synthesizer Where the Patch Is a Solar System You Rearrange
pitch: Build synth patches by arranging a tiny solar system in 3D - planets are oscillators, orbits are filters, moons are LFOs - and hear the sound change as you play with space.
domains: [3D, MEDIA, LEARN]
created: 2026-10-24T03:02:01Z
rating: 1
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Synthesizer patching is usually taught with cables and block diagrams, which reads like an electrical schematic to a beginner. Orbit Synth maps the signal chain to an intuitive physical metaphor: each oscillator is a planet (size = volume, spin speed = detune), each filter is an orbit ring the signal travels through (ring radius = cutoff), each LFO is a moon whose orbital speed sets the modulation rate, and gravity between bodies sets modulation depth. You build a bass patch by dragging a second planet closer until gravity wobbles the first. The 3D scene is the interface, rendered in Three.js, and the metaphor is honest: every visual parameter is wired to exactly one audio parameter, so what you see is literally what you hear.
- **Core Problem & Target User:** People who love the sounds of synthesizers give up on making them because a panel of 40 identical knobs teaches nothing about cause and effect. Target user: a curious music listener or producer-curious developer who learns spatially and would rather play with a toy orrery than read a subtractive-synthesis tutorial.
- **Core Value Proposition:** Synthesis taught as spatial play - one screen, no cables, and a memorable mental model ("closer moon = faster wobble") that transfers to real synths later.

#### 2. USER STORIES

- **Primary User Story:** "As a synth beginner, I want to build sounds by moving celestial bodies in 3D, so that I learn what oscillators, filters and LFOs do without reading a manual."
- **Secondary User Story:** "As a casual player, I want to save and share my little solar systems as links, so that a friend opens the page, hears my patch, and can perturb it."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The orrery | Three.js scene with up to 3 planets (oscillators: sine/square/saw), one orbit ring each (lowpass filter with radius = cutoff), and moons (LFOs). Dragging bodies updates WebAudio params in real time. | Day 1 PoC |
| Core Mechanism: Play and hear | A two-octave on-screen keyboard (touch-friendly) plus computer-keyboard mapping, with a master volume sun-slider and a start/stop audio toggle. | Day 1 PoC |
| Expansion 1: Save and share | Patch state serialized to a URL hash, a gallery of preset star systems (Bass Nebula, Glass Comet), and recording a 10-second loop to download. | Month 1 MVP |
| Expansion 2: Deeper space | Effects as asteroid belts (delay, reverb), FM synthesis as binary stars, a lesson trail that introduces one body type at a time, and MIDI controller input. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Three.js (already a repo dependency) for the scene, Tone.js or raw WebAudio for the signal graph. One-way binding: scene state -> audio params every animation frame. No backend; patch state lives in the URL hash.
- **Core 24-Hour Demo Flow:** Open the page, hear a default two-planet patch, drag a moon closer to its planet and hear the vibrato speed up, widen the orbit ring and hear the filter open, then play a short riff on the on-screen keyboard. **Aha moment:** realizing the wobble you hear is the moon you just moved - the abstract knob became a thing in space.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The scene is already making sound when you arrive (after the required tap to unlock audio), and the first nudge says "drag the moon - listen."
- **Growth Vector:** Every shared patch is a playable demo of the whole concept; music-toy links travel well in group chats and on social feeds because they sound impressive with zero skill.

#### 6. RISKS & MITIGATION

- **Metaphor leakage:** A spatial metaphor can teach wrong mental models if one visual parameter secretly drives three audio parameters. Mitigation: strict 1:1 mapping, documented in an "honest schematic" side panel showing the real signal chain as text.
- **Audio/visual jank on phones:** 3D rendering plus real-time audio is heavy. Mitigation: cap the scene at a handful of bodies, low-poly everything, throttle rendering to 30fps on small screens, audio graph kept minimal.
- **Autoplay friction:** Browsers block audio before a user gesture. Mitigation: a single inviting "tap to power up the system" gate that starts both the scene and the sound.
