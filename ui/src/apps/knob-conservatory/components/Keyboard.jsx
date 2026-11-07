// One-octave-plus touch keyboard strip with octave shift. Pointer events keep
// multi-touch chords and slides working on phones.

const WHITE = [0, 2, 4, 5, 7, 9, 11, 12]; // semitone offsets of white keys, incl. top C
const BLACK = { 1: 0.7, 3: 1.75, 6: 3.7, 8: 4.75, 10: 5.8 }; // offset -> position in white-key units
const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default function Keyboard({ baseMidi, octaveShift, onShift, onNoteOn, onNoteOff }) {
  const root = baseMidi + octaveShift * 12;

  function keyHandlers(midi) {
    return {
      onPointerDown: (event) => { event.preventDefault(); try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* synthetic pointers */ } onNoteOn(midi); },
      onPointerUp: () => onNoteOff(midi),
      onPointerCancel: () => onNoteOff(midi),
      onLostPointerCapture: () => onNoteOff(midi),
    };
  }

  return (
    <div className="kc-keyboard-row">
      <div className="kc-octave-shift">
        <button type="button" aria-label="Octave down" disabled={octaveShift <= -2} onClick={() => onShift(-1)}>−</button>
        <span>{NAMES[root % 12]}{Math.floor(root / 12) - 1}</span>
        <button type="button" aria-label="Octave up" disabled={octaveShift >= 1} onClick={() => onShift(1)}>+</button>
      </div>
      <div className="kc-keyboard">
        {WHITE.map((offset) => (
          <button
            key={offset}
            type="button"
            className="kc-key kc-key-white"
            aria-label={`${NAMES[(root + offset) % 12]}${Math.floor((root + offset) / 12) - 1}`}
            {...keyHandlers(root + offset)}
          />
        ))}
        {Object.entries(BLACK).map(([offset, position]) => (
          <button
            key={offset}
            type="button"
            className="kc-key kc-key-black"
            style={{ left: `${(position / 8) * 100}%` }}
            aria-label={`${NAMES[(root + Number(offset)) % 12]}${Math.floor((root + Number(offset)) / 12) - 1}`}
            {...keyHandlers(root + Number(offset))}
          />
        ))}
      </div>
    </div>
  );
}
