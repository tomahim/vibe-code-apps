const code = `// "First Light" - a slow sunrise in D major.
// Airy pads, string swells an octave up, and bells like early birds.
//
// The code below IS the music: change a chord, a synth name or a
// sleep time, then press Play again to hear your version.
//
// Useful moves:
//   m.play("hollow", { note: "D3", attack: 4, dur: 10, release: 6 })
//   m.chord("prophet", ["D3", "A3", "F#4"], { attack: 4, dur: 10, release: 6 })
//   await m.sleep(4)          wait 4 seconds
//   m.spawn(async (m) => {...}) start a concurrent layer
//   m.note("F#3") + 12        one octave up
//   m.choose([...]) / m.rrand(0.2, 0.6)  pick / random

const CHORDS = [
  ["D3", "A3", "E4", "F#4"],   // D add9
  ["B2", "F#3", "A3", "D4"],   // Bm7
  ["G2", "D3", "B3", "E4"],    // Gmaj7 colour
  ["A2", "E3", "C#4", "G4"],   // A suspended
];
const SPARK = ["A4", "B4", "C#5", "D5", "E5", "F#5", "A5"];

// Layer 1 - the sky: a hollow pad, one slow swell per chord.
m.spawn(async (m) => {
  let i = 0;
  while (m.playing) {
    m.chord("hollow", CHORDS[i % CHORDS.length], {
      attack: 8, dur: 18, release: 9,
      amp: 0.3, cutoff: 70, noise: 0.6,
    });
    i += 1;
    await m.sleep(16);
  }
});

// Layer 2 - strings answering an octave up, every other chord.
m.spawn(async (m) => {
  await m.sleep(16);
  let i = 1;
  while (m.playing) {
    const up = CHORDS[i % CHORDS.length].slice(1).map((n) => m.note(n) + 12);
    m.chord("blade", up, {
      attack: 6, dur: 14, release: 8,
      amp: 0.16, cutoff: 65, vibrato_rate: 4.5, vibrato_depth: 0.12,
    });
    i += 2;
    await m.sleep(32);
  }
});

// Layer 3 - first birds: sparse bright bells.
m.spawn(async (m) => {
  await m.sleep(10);
  while (m.playing) {
    m.play("dull_bell", {
      note: m.choose(SPARK),
      amp: m.rrand(0.06, 0.18),
      pan: m.rrand(-0.8, 0.8),
      release: m.rrand(4, 9),
    });
    await m.sleep(m.rrand(1.2, 3.2));
  }
});

// Layer 4 - the sun itself: a low warm swell under everything.
m.spawn(async (m) => {
  await m.sleep(32);
  while (m.playing) {
    m.play("prophet", {
      note: "D2", attack: 10, dur: 22, release: 10,
      amp: 0.22, cutoff: 40,
    });
    await m.sleep(64);
  }
});
`;

export default {
  id: "first-light",
  title: "First Light",
  mood: "Dawn ambience",
  minutes: "endless loop",
  description:
    "A hopeful sunrise: D major pads opening like a sky, string swells " +
    "answering an octave up, and small bells waking up one by one.",
  synths: ["hollow", "blade", "dull_bell", "prophet"],
  code,
};
