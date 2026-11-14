// Twelve hands-on steps into live synthesis with the music engine.
// Each step is a short idea plus an editable score: press Play, change
// the code, press Play again. The engine is a real SuperCollider server
// (scsynth on WebAssembly); the scores drive it with JavaScript.

export const steps = [
  {
    id: "first-note",
    title: "Your first note",
    goal:
      "m.play(name, options) plays one note on an instrument. " +
      "Press Play, then change the note and listen again.",
    code: `// One warm note.
m.play("prophet", { note: "A4", dur: 2 });

// Try: "A4" -> "E4", "C5", or a MIDI number like 57.`,
  },
  {
    id: "notes-octaves",
    title: "Notes and octaves",
    goal:
      "Notes are letter + octave: C3 is low, C5 is high. " +
      "await m.sleep(seconds) waits between notes.",
    code: `// A little climb, one step per second.
m.play("prophet", { note: "C3", dur: 0.8 });
await m.sleep(1);
m.play("prophet", { note: "C4", dur: 0.8 });
await m.sleep(1);
m.play("prophet", { note: "C5", dur: 1.5 });

// Try: add more steps, or go back down.`,
  },
  {
    id: "rhythm",
    title: "Rhythm is sleeping",
    goal:
      "Short sleeps make fast rhythms, long sleeps make slow ones. " +
      "The pattern below marches: quick, quick, slow.",
    code: `// Quick, quick, slow - then again.
for (let i = 0; i < 4; i += 1) {
  m.play("sc808_bassdrum", { amp: 0.15 });
  await m.sleep(0.25);
  m.play("sc808_bassdrum", { amp: 0.15 });
  await m.sleep(0.25);
  m.play("sc808_snare", { amp: 0.12 });
  await m.sleep(0.5);
}

// Try: sleep(0.125) twice as fast, or a different drum.`,
  },
  {
    id: "instruments",
    title: "Same notes, new instrument",
    goal:
      "The first argument of m.play is the instrument. " +
      "The library shows every name under Available sounds.",
    code: `// One melody, three colours.
for (const synth of ["prophet", "pretty_bell", "tb303"]) {
  m.play(synth, { note: "E4", dur: 0.6 });
  await m.sleep(0.8);
  m.play(synth, { note: "G4", dur: 0.6 });
  await m.sleep(0.8);
}

// Try: "blade", "pluck", "hoover", "tri".`,
  },
  {
    id: "amp-pan",
    title: "Volume and space",
    goal:
      "amp sets loudness (0 to 1), pan places sound left (-1) " +
      "to right (1). Headphones make pan obvious.",
    code: `// A call wandering across the room.
m.play("pluck", { note: "A4", dur: 0.5, amp: 0.4, pan: -1 });
await m.sleep(0.7);
m.play("pluck", { note: "A4", dur: 0.5, amp: 0.4, pan: 0 });
await m.sleep(0.7);
m.play("pluck", { note: "A4", dur: 0.5, amp: 0.4, pan: 1 });

// Try: amp 0.1 for a whisper.`,
  },
  {
    id: "envelopes",
    title: "Attack and release",
    goal:
      "attack is how fast a note swells in, release how long it " +
      "fades out. Slow attack + long release = a pad.",
    code: `// The same chord, punched then breathed.
m.chord("prophet", ["C4", "E4", "G4"], { dur: 1, attack: 0.01, release: 0.2 });
await m.sleep(2);
m.chord("prophet", ["C4", "E4", "G4"], { dur: 4, attack: 2, release: 3 });

// Try: attack 0.01 vs 3 on your favourite chord.`,
  },
  {
    id: "filters",
    title: "Cutoff: opening the curtain",
    goal:
      "cutoff is a brightness filter: low is muffled, high is " +
      "brilliant. Sweep it to hear the harmonics appear.",
    code: `// A saw wave, darker then brighter.
for (const cutoff of [30, 50, 70, 90, 110]) {
  m.play("saw", { note: "A2", dur: 1, cutoff, res: 0.3 });
  await m.sleep(1.2);
}

// Try: res 0.8 makes the filter whistle.`,
  },
  {
    id: "chords",
    title: "Chords",
    goal:
      "m.chord(name, notes, options) plays several notes together. " +
      "Three or four notes are a mood.",
    code: `// Minor, then major: sad, then glad.
m.chord("blade", ["A3", "C4", "E4"], { dur: 3, attack: 0.5, release: 2 });
await m.sleep(3.5);
m.chord("blade", ["A3", "C#4", "E4"], { dur: 3, attack: 0.5, release: 2 });

// Try: change one note in each chord.`,
  },
  {
    id: "loops",
    title: "Loops that breathe",
    goal:
      "while (m.playing) repeats until you press Stop. " +
      "Every loop needs an await m.sleep inside, always.",
    code: `// An endless gentle pulse.
while (m.playing) {
  m.play("dull_bell", { note: "E5", dur: 1.5, amp: 0.15 });
  await m.sleep(2);
}

// Try: sleep(0.5), or two different notes alternating.`,
  },
  {
    id: "layers",
    title: "Layers with spawn",
    goal:
      "m.spawn(async (m) => {...}) starts a parallel layer with its " +
      "own clock. Music is layers talking to each other.",
    code: `// Bass below, bells above, independent.
m.spawn(async (m) => {
  while (m.playing) {
    m.play("tb303", { note: "A1", dur: 0.3, amp: 0.2, cutoff: 60 });
    await m.sleep(1);
  }
});
m.spawn(async (m) => {
  await m.sleep(0.5);
  while (m.playing) {
    m.play("pretty_bell", { note: "A4", dur: 1, amp: 0.1 });
    await m.sleep(2);
  }
});

// Try: a third layer with a drum.`,
  },
  {
    id: "randomness",
    title: "Happy accidents",
    goal:
      "m.choose(list) picks at random, m.rrand(a, b) rolls a number. " +
      "Same code, different music every time.",
    code: `// A generative chime that never repeats.
while (m.playing) {
  m.play("pretty_bell", {
    note: m.choose(["C5", "E5", "G5", "B5", "D6"]),
    amp: m.rrand(0.05, 0.15),
    pan: m.rrand(-0.8, 0.8),
    release: m.rrand(2, 5),
  });
  await m.sleep(m.rrand(0.4, 1.5));
}`,
  },
  {
    id: "compose",
    title: "Your composition",
    goal:
      "Everything together: a loop, two layers, a chord progression " +
      "and a pinch of randomness. This scaffold is yours to break.",
    code: `const CHORDS = [
  ["A3", "C4", "E4"],   // A minor
  ["F3", "A3", "C4"],   // F major
  ["C3", "E3", "G3"],   // C major
  ["G3", "B3", "D4"],   // G major
];

m.spawn(async (m) => {
  let i = 0;
  while (m.playing) {
    m.chord("prophet", CHORDS[i % CHORDS.length], {
      dur: 4, attack: 1, release: 2, amp: 0.2, cutoff: 60,
    });
    i += 1;
    await m.sleep(4);
  }
});

m.spawn(async (m) => {
  while (m.playing) {
    m.play("pluck", {
      note: m.choose(["A4", "C5", "E5", "G5"]),
      dur: 0.4, amp: m.rrand(0.1, 0.25), pan: m.rrand(-0.5, 0.5),
    });
    await m.sleep(0.5);
  }
});

// Make it yours: change the chords, the tempo, the instruments.`,
  },
];
