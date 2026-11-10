// Computer-keyboard playing for the synth keyboard. The classic two-row
// layout: home row A S D F G H J K for the white keys, W E T Y U for the
// black keys. Keys are matched by letter (event.key), and both QWERTY and
// AZERTY letters map to the same physical positions so the layout survives
// a French keyboard (AZERTY home row starts with Q, its top row has Z and W
// where QWERTY has W and Z).

const NOTE_KEY_TO_OFFSET = {
  a: 0, q: 0, // C (QWERTY a / AZERTY q)
  w: 1, z: 1, // C# (QWERTY w / AZERTY z)
  s: 2, // D
  e: 3, // D#
  d: 4, // E
  f: 5, // F
  t: 6, // F#
  g: 7, // G
  y: 8, // G#
  h: 9, // A
  u: 10, // A#
  j: 11, // B
  k: 12, // top C
};

// Letter shown on each on-screen key (QWERTY spelling; AZERTY players use
// the same positions, which the hint line says).
export const WHITE_KEY_LABELS = { 0: "A", 2: "S", 4: "D", 5: "F", 7: "G", 9: "H", 11: "J", 12: "K" };
export const BLACK_KEY_LABELS = { 1: "W", 3: "E", 6: "T", 8: "Y", 10: "U" };

export function offsetForKey(key) {
  if (typeof key !== "string" || key.length !== 1) return null;
  const offset = NOTE_KEY_TO_OFFSET[key.toLowerCase()];
  return offset === undefined ? null : offset;
}

// Typing a preset name (or any text) must never play notes or steal keys.
export function isTextEntryTarget(target) {
  if (!target || typeof target.closest !== "function") return false;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

// Held computer keys as a last-note-priority stack: while several keys are
// down the newest one sounds (the engine is monophonic), and releasing it
// falls back to the note still held underneath. Entries are keyed by the
// keyboard letter so an octave shift mid-press still releases the right
// note.
export class HeldNotes {
  constructor() {
    this.stack = []; // [{ key, midi, offset }]
  }

  press(key, midi, offset) {
    if (this.stack.some((entry) => entry.key === key)) return null;
    this.stack.push({ key, midi, offset });
    return midi;
  }

  release(key) {
    const index = this.stack.findIndex((entry) => entry.key === key);
    if (index === -1) return null;
    const wasSounding = index === this.stack.length - 1;
    this.stack.splice(index, 1);
    if (!wasSounding) return null;
    const top = this.stack[this.stack.length - 1];
    return top ? top.midi : "off";
  }

  clear() {
    const had = this.stack.length > 0;
    this.stack = [];
    return had ? "off" : null;
  }

  activeOffsets() {
    return new Set(this.stack.map((entry) => entry.offset));
  }
}
