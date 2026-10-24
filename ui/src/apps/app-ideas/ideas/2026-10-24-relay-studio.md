---
name: Relay Studio
tagline: A Two-Person Browser DAW Where You Pass the Song Like a Relay Baton
pitch: An asynchronous collaborative DAW in the browser: one friend lays a drum loop and sends a link, the other adds bass and sends it back, and the project grows a branch tree of every pass like git for songs.
domains: [MEDIA, GAME]
created: 2026-10-24T03:02:08Z
---

#### 1. CREATIVE CONCEPT & PROBLEM STATEMENT

- **Creative Twist / Re-imagining Angle:** Real-time collaborative DAWs assume two musicians free at the same time with the same skills - almost never true. Relay Studio makes collaboration asynchronous and playful: it works like a relay race. You open a minimal browser DAW (a few tracks, clip loops, simple instruments), record one contribution - say a drum groove - and pass a link. Your friend opens it, hears your take, and records exactly one layer on top before passing it back. Every pass is committed to a visible version tree, like git branches for the song: you can fork the song at pass 3 to try a different chorus, and a "merge conflict" - both of you changed the same part - becomes a remix battle where both versions survive as sibling branches.
- **Core Problem & Target User:** Making music with friends is the most fun way to make music and the hardest to organize; shared project files and screen-shares kill the joy. Target user: two friends, at most one of whom is "a musician", who want a low-pressure creative back-and-forth like a chess-by-mail game.
- **Core Value Proposition:** Music collaboration reduced to one rule - add one layer, pass it on - with a version tree that makes the friendship visible in the song's history.

#### 2. USER STORIES

- **Primary User Story:** "As a casual music maker, I want to send a loop to a friend and get it back with their layer added, so that we build a song together without scheduling anything."
- **Secondary User Story:** "As a returning player, I want to see the song's version tree and fork it, so that we can explore alternate directions without destroying what we had."

#### 3. SCOPE & ROADMAP (1-DAY POC VS 3-MONTH SCALE)

| Feature Name | Functional Description | Timeline Scope |
| --- | --- | --- |
| Core Mechanism: The take | A minimal 8-track loop DAW (drums + melodic instruments, clip and live-record modes), with the current pass highlighted and everything else locked for listening. | Day 1 PoC |
| Core Mechanism: The pass | One contribution per pass enforced by the flow; the pass link carries the full project state (compressed JSON) so no account is needed. | Day 1 PoC |
| Expansion 1: The tree | A visual version tree of passes with branch names and audio previews, fork-from-any-pass, and diff view showing which track changed between passes. | Month 1 MVP |
| Expansion 2: The club | Remix battles (both versions kept, friends vote), three- and four-person relays with a turn order, and end-of-song mastering render with the tree printed as album art. | Month 3 Polish |

#### 4. DAY 1 POC EXECUTION SPECIFICATION

- **Minimal Technical Setup:** React, TypeScript, Vite, Tailwind CSS, Tone.js for the audio engine. Project state is track/clip JSON plus optional short recorded audio (base64, capped); serialized compressed into the share URL, with a tiny optional backend only if URLs overflow. No accounts.
- **Core 24-Hour Demo Flow:** Record a four-bar drum loop, pass the link (or open it in a second tab), add a bass line over it, and see the version tree grow from one node to two. **Aha moment:** hearing your loop come back dressed in your friend's bass line - the relay feeling in one pass.

#### 5. ADOPTION OPPORTUNITIES & DRIVERS

- **Instant Onboarding Hook:** Start from a single "lay the first brick" screen with a metronome and one big record button; the DAW's full interface is revealed only after the first pass exists.
- **Growth Vector:** Every pass is a personal message to a specific friend, which is the strongest sharing mechanic there is - the app spreads exactly along friendships.

#### 6. RISKS & MITIGATION

- **Audio in URLs:** Recorded audio does not fit in a link hash. Mitigation: cap takes at 8 bars and compress hard; if the state overflows, the link carries an ID and the blob goes to a minimal store with expiry, disclosed honestly in the UI.
- **Skill asymmetry:** A non-musician friend may freeze when handed the baton. Mitigation: quantize everything, offer one-tap "smart layer" suggestions (a bassline that fits the drums' key), and frame passes as playful, not precious.
- **Relay abandonment:** A pass left unanswered kills the song. Mitigation: a gentle nudge ("Léa has been holding the baton for 3 days"), baton-passing to a third person allowed, and solo continuation always possible.
