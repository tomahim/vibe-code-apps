const code = `// "Neon Rain" - a slow, rain-soaked city ambience.
// Deep drones in C minor under sparse bell droplets.
//
// The code below IS the music: change a chord, a synth name or a
// sleep time, then press Play again to hear your version.
//
// Useful moves:
//   m.play("prophet", { note: "C3", attack: 2, dur: 6, release: 3 })
//   m.chord("blade", ["A2", "E3", "B3"], { attack: 4, dur: 10, release: 6 })
//   await m.sleep(4)          wait 4 seconds
//   m.spawn(async (m) => {...}) start a concurrent layer
//   m.choose([...]) / m.rrand(0.2, 0.6)  pick / random

const ROOTS  = ["C2", "G#1", "D#2", "A#1"]; // Cm | Ab | Eb | Bb
const CHORDS = [
  ["C4", "D#4", "G4"],   // C minor
  ["G#3", "C4", "D#4"],  // Ab major
  ["D#4", "G4", "A#4"],  // Eb major
  ["A#3", "D4", "F4"],   // Bb major
];
const PENTA = ["C5", "D#5", "F5", "G5", "A#5", "C6"];

// Layer 1 - the deep drone, one dark_ambience note per chord.
m.spawn(async (m) => {
  let i = 0;
  while (m.playing) {
    m.play("dark_ambience", {
      note: ROOTS[i % ROOTS.length],
      attack: 6, dur: 16, release: 8,
      amp: 0.5, cutoff: 60, ring: 0.4, room: 100,
    });
    i += 1;
    await m.sleep(14); // shorter than dur: drones melt into each other
  }
});

// Layer 2 - a soft minor pad swelling above the drone.
m.spawn(async (m) => {
  let i = 0;
  while (m.playing) {
    m.chord("prophet", CHORDS[i % CHORDS.length], {
      attack: 7, dur: 15, release: 7,
      amp: 0.28, cutoff: 55, res: 0.5,
    });
    i += 1;
    await m.sleep(14);
  }
});

// Layer 3 - rain: sparse bells falling at random heights.
m.spawn(async (m) => {
  await m.sleep(6);
  while (m.playing) {
    m.play("pretty_bell", {
      note: m.choose(PENTA),
      amp: m.rrand(0.05, 0.16),
      pan: m.rrand(-0.7, 0.7),
      release: m.rrand(3, 7),
    });
    await m.sleep(m.rrand(0.7, 2.4));
  }
});

// Layer 4 - a low growl far away, every couple of bars.
m.spawn(async (m) => {
  await m.sleep(28);
  while (m.playing) {
    m.play("growl", {
      note: "C1", attack: 3, dur: 6, release: 5,
      amp: 0.3, cutoff: 45,
    });
    await m.sleep(56);
  }
});
`;

export default {
  id: "neon-rain",
  title: "Neon Rain",
  mood: "Dark city ambience",
  minutes: "endless loop",
  description:
    "A slow film-noir cityscape: C minor drones melting into each other, " +
    "a soft analog pad, and bells falling like rain somewhere above the streets.",
  synths: ["dark_ambience", "prophet", "pretty_bell", "growl"],
  code,
};
