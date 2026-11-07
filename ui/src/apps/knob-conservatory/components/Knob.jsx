import { useEffect, useRef, useState } from "react";
import { formatValue, normalizedValue } from "../synth/params.js";

// Rotary knob driven by vertical drag only (no circular gestures), with large
// hit targets and a long-press fine-adjust mode, per the spec's mobile
// ergonomics rules. Double-tap resets to the default.
export default function Knob({ control, value, onChange, locked }) {
  const [fine, setFine] = useState(false);
  const drag = useRef(null);
  const longPress = useRef(null);

  const sweep = fine ? 600 : 170; // pixels of vertical drag for the full range
  const angle = -135 + normalizedValue(control, value) * 270;

  function valueForDelta(deltaY, startValue) {
    const span = control.max - control.min;
    let next;
    if (control.scale === "log") {
      const min = Math.log(control.min);
      const max = Math.log(control.max);
      const startNorm = (Math.log(Math.max(control.min, startValue)) - min) / (max - min);
      next = Math.exp(min + Math.min(1, Math.max(0, startNorm + deltaY / sweep)) * (max - min));
    } else {
      next = startValue + (deltaY / sweep) * span;
    }
    if (control.step) next = Math.round(next / control.step) * control.step;
    return Math.min(control.max, Math.max(control.min, next));
  }

  function onPointerDown(event) {
    if (locked) return;
    event.preventDefault();
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* synthetic pointers have no capture */ }
    drag.current = { startY: event.clientY, startValue: value, moved: false };
    longPress.current = setTimeout(() => setFine(true), 500);
  }

  function onPointerMove(event) {
    if (!drag.current || (event.buttons === 0 && event.pointerType === "mouse")) return;
    const deltaY = drag.current.startY - event.clientY;
    if (Math.abs(deltaY) > 3) {
      drag.current.moved = true;
      clearTimeout(longPress.current);
    }
    onChange(control.id, valueForDelta(deltaY, drag.current.startValue));
  }

  function onPointerUp() {
    clearTimeout(longPress.current);
    drag.current = null;
    setFine(false);
  }

  function onDoubleClick() {
    if (!locked) onChange(control.id, control.default);
  }

  useEffect(() => () => clearTimeout(longPress.current), []);

  return (
    <div
      className={`kc-knob ${locked ? "kc-knob-locked" : ""} ${fine ? "kc-knob-fine" : ""}`}
      role="slider"
      aria-label={control.label}
      aria-valuemin={control.min}
      aria-valuemax={control.max}
      aria-valuenow={value}
      aria-disabled={locked}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      <svg viewBox="0 0 60 60" className="kc-knob-dial" aria-hidden="true">
        <circle cx="30" cy="30" r="26" className="kc-knob-skirt" />
        <circle cx="30" cy="30" r="19" className="kc-knob-cap" />
        <line
          x1="30" y1="30" x2="30" y2="14"
          className="kc-knob-pointer"
          transform={`rotate(${angle} 30 30)`}
        />
      </svg>
      <span className="kc-knob-label">{locked ? "🔒 " : ""}{control.label}</span>
      <span className="kc-knob-value">{locked ? "—" : `${formatValue(control, value)}${control.unit ? ` ${control.unit}` : ""}`}</span>
      {fine && <span className="kc-knob-fine-badge">fine</span>}
    </div>
  );
}
