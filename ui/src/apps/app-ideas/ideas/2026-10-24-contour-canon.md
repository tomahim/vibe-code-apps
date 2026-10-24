---
name: Contour Canon
tagline: Draw a Landscape in 3D, and the Terrain Plays Itself
pitch: Shape a 3D terrain - or import the elevation profile of a real hike - and a ball rolling down the slopes plays it as music: altitude is pitch, steepness is velocity, ridges are rhythm.
domains: [3D, MEDIA]
created: 2026-10-24T03:02:05Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Music sequencers are grids; landscapes are anything but. Contour Canon turns terrain into a score. You sculpt a small low-poly landscape in 3D - push up a ridge, carve a valley, drop a lake - and then release a ball at the summit. As the ball rolls, the terrain under it plays: altitude maps to pitch, slope to note velocity, and each ridge crossing triggers a percussive tick. A mountain is a crescendo; a switchback trail is a melody. The import that makes it personal: paste a GPX track from a real hike or run and the app rebuilds that route as a playable 3D diorama, so your Sunday trail becomes a piece of music with the climb you felt in your legs as the dramatic peak.
- **Core Problem & Target User:** Procedural-music toys are fun for five minutes because they are abstract; nothing about them is yours. Target user: a hiker or trail runner who likes data souvenirs, and anyone who enjoys sculpting toys and wants the result to do something beautiful.
- **Core Value Proposition:** A music toy where the score is a place - drawn from imagination or from a route you actually walked - so every piece has a story attached.

#### 2. USER STORIES

- **Primary User Story:** "As a hiker, I want to import my route's elevation and hear it played as music in a 3D diorama, so that my effort becomes a piece I can share."
- **Secondary User Story:** "As a playful creator, I want to sculpt a terrain and release balls down it, so that I compose by shaping a landscape instead of placing notes."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The diorama | Three.js low-poly terrain on a heightfield grid, sculpting by drag (raise/lower/smooth), water plane at low altitude, pleasing diorama lighting. | Day 1 PoC |
| Core Mechanism: The roll | Ball physics down the heightfield; altitude-to-pitch mapping on a pentatonic scale (always consonant), slope-to-velocity, ridge-crossing ticks; loop the roll. | Day 1 PoC |
| Expansion 1: GPX import | Paste a GPX file; the elevation profile becomes a ridge diorama with the route drawn on it, and the roll follows the actual track including its switchbacks. | Month 1 MVP |
| Expansion 2: Ensemble and export | Multiple balls as a canon (each offset in time and octave), choose instrument timbres per ball, record the piece to audio, share a diorama link. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Three.js (already a repo dependency) for terrain and ball, simple custom heightfield physics (no physics engine needed for one ball), Tone.js for sound. Pentatonic quantization guarantees consonance. No backend; terrains serialize to URL hash.
- **Core 24-Hour Demo Flow:** Load a default valley, drag one hill higher and hear the roll gain a high note, then release the ball and watch it trace the melody as it descends. **Aha moment:** the melody visibly follows the shape you just sculpted - cause and effect with zero music theory.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** A pre-built mountain starts rolling and playing on arrival (after the audio-unlock tap); the first prompt is "grab the ridge and pull."
- **Growth Vector:** The GPX import turns every hiker's activity feed into a content source - "listen to yesterday's climb" is a natural share in any trail-running group chat.

#### 6. RISKS & MITIGATION

- **Honest mapping:** If the mapping from terrain to notes is arbitrary or hidden, the toy feels fake. Mitigation: one visible legend (height = pitch, slope = loudness, ridge = tick), pentatonic quantization stated openly, and a note trail rendered on the terrain as the ball plays.
- **Physics feel:** A ball that slides or floats breaks the spell. Mitigation: tuned friction and gravity on the heightfield, capped speed, and a camera that follows the roll smoothly.
- **GPX quality:** Real tracks are noisy and flat stretches make boring music. Mitigation: resample and smooth elevation, compress altitude range to keep melodies singable, and show a preview before generating.
