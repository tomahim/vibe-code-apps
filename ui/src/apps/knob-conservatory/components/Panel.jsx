import Knob from "./Knob.jsx";
import { SECTIONS } from "../synth/params.js";

// The synth panel, rendered from the parameter registry. `unlocked === null`
// means the workshop: every control live. Otherwise it is the set of control
// ids the current lesson path has unlocked; the rest stay visible but locked,
// so the road ahead is tangible.
export default function Panel({ patch, unlocked, onChange }) {
  return (
    <div className="kc-panel">
      {SECTIONS.map((section) => {
        const anyOpen = unlocked === null || section.controls.some((control) => unlocked.has(control.id));
        return (
          <section key={section.id} className={`kc-section ${anyOpen ? "" : "kc-section-locked"}`}>
            <h3>{section.name}</h3>
            <div className="kc-section-controls">
              {section.controls.map((control) => {
                const locked = unlocked !== null && !unlocked.has(control.id);
                if (control.kind === "selector") {
                  return (
                    <label key={control.id} className={`kc-selector ${locked ? "kc-selector-locked" : ""}`}>
                      <span className="kc-knob-label">{locked ? "🔒 " : ""}{control.label}</span>
                      <select
                        value={patch[control.id]}
                        disabled={locked}
                        onChange={(event) => onChange(control.id, event.target.value)}
                      >
                        {control.choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
                      </select>
                    </label>
                  );
                }
                return (
                  <Knob
                    key={control.id}
                    control={control}
                    value={patch[control.id]}
                    locked={locked}
                    onChange={onChange}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
