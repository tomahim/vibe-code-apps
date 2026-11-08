// The performance runtime: turns the composition code shown in the editor
// into scheduled OSC on the SuperSonic engine.
//
// Compositions are plain async JavaScript. They get one argument, `m`, the
// music API:
//
//   m.play("prophet", { note: "C3", attack: 2, dur: 6, release: 3 })
//   m.chord("blade", ["A2", "E3", "B3", "F#4"], { attack: 4, dur: 10, release: 6 })
//   await m.sleep(4)          // advance the musical clock
//   m.spawn(async (m) => {...}) // a concurrent layer with its own clock
//   while (m.playing) {...}   // loops until Stop
//   m.note("F#3"), m.notes("C3 E3 G3"), m.choose([...]), m.rrand(0.2, 0.6)
//
// Timing: sleep() keeps the code running a little ahead of the audio clock
// and every note is sent as a timestamped OSC bundle, so the engine renders
// it sample-accurately whatever the JS timers do.

const LOOKAHEAD_SECONDS = 1.0; // how far code may run ahead of the audio clock
const MAX_EVENTS = 4000;       // safety valve against runaway loops
const START_DELAY = 0.4;       // silence before the first note

const NOTE_OFFSETS = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

export function noteNameToMidi(name) {
  const match = /^([a-gA-G])([#b]?)(-?\d+)$/.exec(String(name).trim());
  if (!match) return null;
  let semitone = NOTE_OFFSETS[match[1].toLowerCase()];
  if (match[2] === "#") semitone += 1;
  if (match[2] === "b") semitone -= 1;
  const octave = parseInt(match[3], 10);
  return (octave + 1) * 12 + semitone;
}

function toMidi(note) {
  if (typeof note === "string") {
    const midi = noteNameToMidi(note);
    if (midi === null) throw new Error(`Unknown note name: ${note}`);
    return midi;
  }
  if (typeof note === "number" && Number.isFinite(note)) return note;
  throw new Error(`A note must be a name ("C#3") or a MIDI number, got: ${note}`);
}

export function createPerformance(engine, { onError = () => {}, onEnd = () => {} } = {}) {
  let playing = false;
  let startNtp = 0;
  let startReal = 0;
  let eventCount = 0;
  const timers = new Map(); // id -> reject

  function later(ms) {
    return new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        timers.delete(id);
        resolve();
      }, ms);
      timers.set(id, reject);
    });
  }

  function cancelTimers() {
    for (const [id, reject] of timers) {
      clearTimeout(id);
      reject(new Error("__stopped__"));
    }
    timers.clear();
  }

  // One section = one concurrent layer with its own musical clock (in seconds
  // since the performance started).
  function makeSection(startAt) {
    let vTime = startAt;

    async function sleep(seconds) {
      vTime += Math.max(0, seconds);
      const aheadBy = vTime - (performance.now() / 1000 - startReal);
      const wait = aheadBy - LOOKAHEAD_SECONDS;
      if (wait > 0) await later(wait * 1000);
      if (!playing) throw new Error("__stopped__");
    }

    function play(synth, options = {}) {
      if (!playing) throw new Error("__stopped__");
      if (++eventCount > MAX_EVENTS) {
        throw new Error(`Stopped after ${MAX_EVENTS} notes - is a loop missing "await m.sleep(...)"?`);
      }
      const { note = 60, at = 0, dur, ...rest } = options;
      const params = { ...rest };
      params.note = toMidi(note);
      if (typeof dur === "number") {
        const attack = params.attack ?? 0.01;
        const release = params.release ?? 0.5;
        params.attack = attack;
        params.release = release;
        params.decay = 0;
        params.sustain = Math.max(0.05, dur - attack - release);
      }
      const when = startNtp + vTime + at;
      const ahead = when - engine.ntpNow();
      if (ahead > 60) {
        throw new Error("Scheduling too far ahead - add \"await m.sleep(...)\" between phrases.");
      }
      engine.scheduleNote(when, synth, params);
    }

    function chord(synth, notes, options = {}) {
      const { strum = 0, ...rest } = options;
      notes.forEach((n, i) => play(synth, { ...rest, note: n, at: (rest.at ?? 0) + i * strum }));
    }

    function spawn(fn) {
      // The layer gets its own musical clock: user code receives it as the
      // callback argument (convention: `m.spawn(async (m) => {...})`).
      const child = makeSection(vTime);
      run(() => fn(child), child);
    }

    return {
      get playing() { return playing; },
      sleep,
      play,
      chord,
      spawn,
      note: (name) => toMidi(name),
      notes: (names) => String(names).trim().split(/\s+/).map(toMidi),
      choose: (items) => items[Math.floor(Math.random() * items.length)],
      rrand: (lo, hi) => lo + Math.random() * (hi - lo),
      irand: (lo, hi) => Math.floor(lo + Math.random() * (hi - lo + 1)),
    };
  }

  const pending = new Set();

  function run(makePromise) {
    const p = (async () => {
      try {
        await makePromise();
      } catch (err) {
        if (err && err.message === "__stopped__") return;
        onError(err instanceof Error ? err.message : String(err));
      }
    })();
    pending.add(p);
    p.finally(() => {
      pending.delete(p);
      if (playing && pending.size === 0) onEnd();
    });
  }

  return {
    get playing() { return playing; },

    // The engine must be booted already (user gesture requirement handled
    // by the caller, which boots from the Play button).
    start(code) {
      this.stop();
      playing = true;
      eventCount = 0;
      startNtp = engine.ntpNow() + START_DELAY;
      startReal = performance.now() / 1000 + START_DELAY;
      let fn;
      try {
        // The editor content becomes the body of an async function.
        fn = new Function("m", `"use strict";\nreturn (async () => {\n${code}\n})();`);
      } catch (err) {
        playing = false;
        onError(`Syntax: ${err.message}`);
        return false;
      }
      const main = makeSection(0);
      run(() => fn(main));
      return true;
    },

    stop() {
      if (!playing && timers.size === 0) return;
      playing = false;
      cancelTimers();
      engine.stopAll();
    },
  };
}
