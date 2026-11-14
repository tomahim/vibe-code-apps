const code = `// "Night Pursuit" - an action-film chase in D minor.
// Driving 808 percussion, an acid bass ostinato, string stabs and a
// heroic hoover motif rising over the pursuit.
//
// The code below IS the music: change a pattern, a synth name or a
// sleep time, then press Play again to hear your version.
//
// Useful moves:
//   m.play("sc808_bassdrum", { amp: 0.9 })        one drum hit
//   m.play("tb303", { note: "D2", dur: 0.2, cutoff: 75, release: 0.15 })
//   m.chord("blade", ["D4", "F4", "A4"], { dur: 0.35, attack: 0.005 })
//   await m.sleep(4)          wait 4 seconds
//   m.spawn(async (m) => {...}) start a concurrent layer
//   m.choose([...]) / m.rrand(0.2, 0.6)  pick / random

const B = 60 / 140;    // one beat at 140 BPM
const S = B / 4;       // one sixteenth note
const BAR = 4 * B;

const CHORDS = [
  ["D4", "F4", "A4"],    // D minor
  ["A#3", "D4", "F4"],   // Bb major
  ["G3", "A#3", "D4"],   // G minor
  ["A3", "C#4", "E4"],   // A major - the pull back home
];
const BASSLINE = [
  "D2", "D2", "F2", "D2", "C2", "D2", "G2", "F2",
  "D2", "D2", "F2", "G2", "A2", "G2", "F2", "C2",
];
const MOTIF = ["D5", "F5", "G5", "A5", "C6", "A5", "G5", "F5"];

// Layer 1 - the chase: 808 kit. Kick pushes, snare cracks on 2 and 4,
// hats run in eighths, a tom fill closes every 8-bar phrase.
m.spawn(async (m) => {
  const KICK_A = [0, 6, 8, 14];
  const KICK_B = [0, 3, 6, 8, 11, 14];
  let bar = 0;
  while (m.playing) {
    const phraseBar = bar % 8;
    const kicks = bar % 2 === 0 ? KICK_A : KICK_B;
    for (let slot = 0; slot < 16; slot += 1) {
      if (phraseBar === 7 && slot >= 8) {
        // Tom fill, then the crash back to the top.
        const fill = ["sc808_tomhi", "sc808_tomhi", "sc808_tommid",
                      "sc808_tommid", "sc808_tomlo", "sc808_tomlo",
                      "sc808_snare", "sc808_cymbal"];
        m.play(fill[slot - 8], { amp: slot === 15 ? 0.45 : 0.35, pan: (slot - 12) * 0.2 });
      } else {
        if (kicks.includes(slot)) m.play("sc808_bassdrum", { amp: 0.6 });
        if (slot === 4 || slot === 12) m.play("sc808_snare", { amp: 0.45 });
        if (slot === 12 && bar % 4 === 3) m.play("sc808_clap", { amp: 0.28 });
        if (slot === 7) m.play("sc808_rimshot", { amp: 0.2, pan: 0.3 });
        if (slot % 2 === 0) {
          m.play("sc808_closed_hihat", { amp: slot % 4 === 2 ? 0.26 : 0.15, pan: -0.2 });
        }
        if (slot === 14 && bar % 2 === 1) m.play("sc808_open_hihat", { amp: 0.24, pan: -0.2 });
        if (slot === 0 && phraseBar === 0) m.play("sc808_cymbal", { amp: 0.35, release: 4 });
      }
      await m.sleep(S);
    }
    bar += 1;
  }
});

// Layer 2 - the engine: a tb303 bass ostinato in relentless eighths.
m.spawn(async (m) => {
  let i = 0;
  while (m.playing) {
    m.play("tb303", {
      note: BASSLINE[i % BASSLINE.length],
      dur: 0.2, attack: 0.005, release: 0.15,
      amp: 0.22, cutoff: m.rrand(65, 85), res: 0.4,
    });
    i += 1;
    await m.sleep(S * 2);
  }
});

// Layer 3 - string stabs: short syncopated hits, one chord per two bars.
m.spawn(async (m) => {
  let bar = 0;
  while (m.playing) {
    const chord = CHORDS[Math.floor(bar / 2) % CHORDS.length];
    if (bar % 2 === 0) {
      m.chord("blade", chord, {
        at: 6 * S, dur: 0.35, attack: 0.005, release: 0.25,
        amp: 0.18, cutoff: 75, vibrato_rate: 5, vibrato_depth: 0.08,
      });
      m.chord("blade", chord, {
        at: 14 * S, dur: 0.3, attack: 0.005, release: 0.2,
        amp: 0.14, cutoff: 70, vibrato_rate: 5, vibrato_depth: 0.08,
      });
    }
    bar += 1;
    await m.sleep(BAR);
  }
});

// Layer 4 - low brass: a D pedal swelling under each chord change.
m.spawn(async (m) => {
  while (m.playing) {
    m.chord("prophet", ["D2", "A2"], {
      attack: 0.5, dur: 6, release: 3,
      amp: 0.12, cutoff: 52, res: 0.4,
    });
    await m.sleep(BAR * 2);
  }
});

// Layer 5 - the hero: a hoover motif rises every second 8-bar phrase,
// a tubular bell marks each phrase turn.
m.spawn(async (m) => {
  let phrase = 0;
  while (m.playing) {
    m.play("dull_bell", { note: "A5", amp: 0.07, release: 6, pan: 0.4 });
    phrase += 1;
    if (phrase % 2 === 0) {
      for (let j = 0; j < MOTIF.length; j += 1) {
        m.play("hoover", {
          note: MOTIF[j], dur: 0.4, attack: 0.02, release: 0.3,
          amp: 0.14, cutoff: 80,
        });
        await m.sleep(S * 2);
      }
      await m.sleep(BAR * 8 - MOTIF.length * S * 2);
    } else {
      await m.sleep(BAR * 8);
    }
  }
});

// Layer 6 - danger: a low growl stalks the last two bars of each phrase.
m.spawn(async (m) => {
  while (m.playing) {
    await m.sleep(BAR * 6);
    m.play("growl", {
      note: "D1", attack: 1, dur: 3, release: 1.5,
      amp: 0.16, cutoff: 45,
    });
    await m.sleep(BAR * 2);
  }
});
`;

export default {
  id: "night-pursuit",
  title: "Night Pursuit",
  mood: "Action film chase",
  minutes: "endless loop",
  description:
    "A night chase in D minor: driving 808 drums and an acid bass " +
    "ostinato under cinematic string stabs, low brass, a rising hoover " +
    "motif and a growl of danger at every turn.",
  synths: [
    "sc808_bassdrum", "sc808_snare", "sc808_clap", "sc808_rimshot",
    "sc808_closed_hihat", "sc808_open_hihat", "sc808_cymbal",
    "sc808_tomhi", "sc808_tommid", "sc808_tomlo",
    "tb303", "blade", "prophet", "hoover", "dull_bell", "growl",
  ],
  code,
};
