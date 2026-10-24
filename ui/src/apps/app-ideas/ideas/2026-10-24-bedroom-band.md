---
name: Bedroom Band
tagline: Hum a Melody, Get a Band That Jams Along With You
pitch: Hum a tune into your phone and a cast of stylized band characters builds an arrangement around it - swap members, deal style cards, and conduct the mix by tapping people in and out.
domains: [MEDIA, GAME]
created: 2026-10-24T03:02:02Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Most "make music easily" apps start from loops and grids, which still assumes you think like a producer. Bedroom Band starts from the one instrument everyone has: humming. You hum eight bars; the app extracts the melody and key, then assembles a band of characters - a bassist, a drummer, a keys player, a singer doubling your melody - each rendered as a small animated figure with a name and a personality. The twist: the band is cast like a troupe. You swap the funk drummer for a bossa drummer and the whole feel changes; you deal a style card ("half-time, no cymbals, walking bass") as a constraint and the band rearranges. Tapping a member mutes them, turning your song into a live arrangement you conduct.
- **Core Problem & Target User:** People with melodies in their head have no path from "I can hum it" to "I can hear it as a real song" without learning a DAW. Target user: a shower-singer, a parent inventing songs with kids, anyone who has ever hummed an idea and lost it.
- **Core Value Proposition:** From hum to a full, characterful band arrangement in under a minute, with arrangement decisions framed as casting and conducting instead of mixing.

#### 2. USER STORIES

- **Primary User Story:** "As a non-musician with a melody in my head, I want to hum it and hear a band play it back, so that my idea becomes a real song sketch."
- **Secondary User Story:** "As a casual player, I want to swap band members and deal style constraint cards, so that one hummed idea becomes five different songs."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: Hum capture | MediaRecorder capture of up to 8 bars, pitch-tracking to a monophonic melody, auto key and tempo estimate, quantize toggle. | Day 1 PoC |
| Core Mechanism: The band | Four generated backing parts (drums, bass, keys, harmony) built from the detected key/tempo using pattern libraries, each bound to a character card with tap-to-mute. | Day 1 PoC |
| Expansion 1: Casting and cards | A roster of 12+ band members (funk drummer, bossa drummer, synth-pad player...) and constraint cards that rearrange the parts; save three arrangements per melody. | Month 1 MVP |
| Expansion 2: The setlist | Chain three hums into a mini-set with transitions, share a song link with animated band, duet mode where a friend hums a second melody over yours. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS. Pitch detection via a WASM pitch tracker (e.g. a CREPE-tiny or autocorrelation fallback), playback via Tone.js with sample-based instruments. Characters are CSS/SVG animations synced to the beat. No backend; melodies stored locally.
- **Core 24-Hour Demo Flow:** Hum "Happy Birthday" or an original line, watch the pitch trace appear as notes, hear the band count in and play your melody with bass, drums and keys, then mute the drummer and swap the keys player. **Aha moment:** hearing your own hummed line come back as a real band groove within seconds.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Big record button on first open with a metronome count-in; the band starts playing your hum back before you have touched a single setting.
- **Growth Vector:** The output is inherently shareable ("listen to the song I hummed on the bus"), and the characterful band members give each share a personality people react to.

#### 6. RISKS & MITIGATION

- **Pitch tracking on noisy phone mics:** Bad detection makes the band play wrong notes, which kills trust instantly. Mitigation: show the detected notes before the band plays, offer an edit step (drag notes, retap tempo), and quantize hard by default.
- **Cheesy output:** Pattern-library backing can sound like a 2005 keyboard demo. Mitigation: a small number of well-chosen patterns per style, good samples, and honest lo-fi character framing rather than fake polish.
- **Copyright worries:** Users may hum existing songs. Mitigation: the app makes arrangements, not copies; shared links are the user's own generated backing with their own recording.
