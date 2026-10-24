---
name: Modular Postcards
tagline: Generative Music Patches You Mail Like Postcards, Remixed at Every Stop
pitch: Snap together a tiny generative music patch - an oscillator, a sequencer, a delay - and send it as a link; the recipient hears your piece evolve and can twist one knob before mailing it on.
domains: [MEDIA, WRITE]
created: 2026-10-24T03:02:04Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Modular synthesis is the most social-looking music gear (people film their racks constantly) and the least shareable in practice: a patch dies when the cables come out. Modular Postcards makes the patch itself the message. You build a small generative system from a dozen node types - note source, sequencer, oscillator, filter, delay, chance - and the app renders it as a postcard: a beautiful little circuit drawing on the front, the living generative piece on the back. You send the link to a friend. They open it, the piece plays and never repeats itself, and the one rule of the chain is that you may change exactly one knob before forwarding it. Each postcard accumulates its route: Paris to Lyon to Berlin, one twist per stop.
- **Core Problem & Target User:** Generative music is delightful to make and impossible to share - exports flatten it into a fixed recording. Target user: a curious non-musician who likes sending people things, and the modular-curious who want patching without a 2000-euro rack.
- **Core Value Proposition:** The first music format that is alive, mailable and cumulative: a gift that keeps composing itself and carries everyone's fingerprints.

#### 2. USER STORIES

- **Primary User Story:** "As a non-musician, I want to snap together a small generative patch and send it to a friend, so that I can give music the way I give postcards."
- **Secondary User Story:** "As a recipient, I want to hear the piece, twist one knob, and pass it on, so that the postcard evolves as it travels through our group."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The workbench | A node canvas with ~10 node types (note source, sequencer, scale quantizer, oscillator, filter, delay, chance, envelope), drag-to-connect, live WebAudio rendering. | Day 1 PoC |
| Core Mechanism: The postcard | Patch serialized into a shareable link that opens a player view: the piece playing generatively, the patch drawn as a circuit diagram, a "twist one knob and forward" action. | Day 1 PoC |
| Expansion 1: The route | Each forward appends the twister's name, city and knob change to the postcard's route log, rendered as a travel map on the card back. | Month 1 MVP |
| Expansion 2: The post office | A public gallery of well-traveled postcards, seeded daily postcard prompts, duet patches where two people each own half the nodes. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Tone.js for the audio graph. Patch state is a compact JSON serialized into the URL hash (lz-string compressed), so a postcard needs no backend or account. Circuit-diagram rendering via SVG from the same patch JSON.
- **Core 24-Hour Demo Flow:** Build a three-node patch (random note source -> scale quantizer -> plucky oscillator with delay), hear it generate endlessly, copy the link, open it in a second tab, twist the delay time, and see the route log gain a stop. **Aha moment:** realizing the link you sent is not a recording but the living piece itself, still composing.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** The landing page plays a featured postcard immediately (after the audio-unlock tap) and offers "remix this one" as the first action instead of a blank canvas.
- **Growth Vector:** The format is intrinsically viral - every postcard is sent person to person by design, and the one-knob rule gives every recipient a reason to forward it.

#### 6. RISKS & MITIGATION

- **Blank-canvas paralysis:** Node editors intimidate beginners. Mitigation: start from one of five playable templates and frame building as modifying, never from scratch.
- **Link length limits:** A serialized patch in a URL can balloon. Mitigation: keep the node count capped at 12, compress the state, and fall back to a short-code store only if hashes overflow.
- **Cacophony risk:** Random-twist chains can degrade a patch into noise. Mitigation: the one-knob rule with constrained ranges, plus a "hear it before you send it" step and the ability to revert to any earlier stop on the route.
