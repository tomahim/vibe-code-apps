import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Knob from "./Knob.jsx";
import { SECTIONS } from "../synth/params.js";
import { sectionLines, readCollapsedLines, writeCollapsedLines, lineIsUseful, lineIsFolded } from "../collapse.js";

// The synth panel, rendered from the parameter registry. `unlocked === null`
// means the workshop: every control live. Otherwise it is the set of control
// ids the current lesson path has unlocked; the rest stay visible but locked,
// so the road ahead is tangible.
//
// `guidance` (lessons mode) embeds the current step into the panel: every
// control the goal asks the player to adjust gets a pulsing ring, and the
// first of them (`anchor`, also wired to `anchorRef` for scroll-to-knob)
// carries a callout bubble with the step's instruction, kept inside the
// viewport by measuring and shifting after render.
//
// `feedback` (lessons mode, after an ear check) maps control id to the
// verdict for that control ({ text, within }); each flagged control gets its
// own bubble, so the player reads the verdict on the knob, not in a banner.

function GuidanceBubble({ tip, status }) {
  const ref = useRef(null);
  const text = status ? status.text : null;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tip-shift", "0px");
    const rect = el.getBoundingClientRect();
    const margin = 10;
    let shift = 0;
    if (rect.left < margin) shift = margin - rect.left;
    else if (rect.right > window.innerWidth - margin) shift = window.innerWidth - margin - rect.right;
    if (shift) el.style.setProperty("--tip-shift", `${shift}px`);
  }, [tip, text]);
  const tone = status ? (status.within ? "kc-tip-ok" : "kc-tip-fix") : "";
  return (
    <div className={`kc-tip ${tone}`} role="note" ref={ref}>
      {tip && <span className="kc-tip-hint">{tip}</span>}
      {status && <span className="kc-tip-status">{status.text}</span>}
    </div>
  );
}

// The sections fold away line by line, two racks per line, to limit vertical
// scrolling. In the workshop the folds are the player's own and are saved. In
// lessons only the line(s) holding the controls the step asks for are open;
// the rest start folded (saved workshop folds untouched) and can be peeked
// open for the current step. A useful line stays open and its toggle is
// disabled: lesson guidance must never end up hidden in a fold.

export default function Panel({ patch, unlocked, onChange, guidance, feedback, anchorRef }) {
  const lines = sectionLines(SECTIONS);
  const [collapsed, setCollapsed] = useState(() => readCollapsedLines(window.localStorage, lines));

  const lessonMode = unlocked !== null;
  // Controls this step is about: the goal's controls, else whatever is unlocked.
  const usefulIds = guidance != null ? guidance.ids : (unlocked ?? new Set());
  const stepKey = [...usefulIds].join(",");
  const [peeked, setPeeked] = useState(() => new Set());
  useEffect(() => { setPeeked(new Set()); }, [stepKey]);

  function toggleLine(lineId) {
    if (lessonMode) {
      setPeeked((prev) => {
        const next = new Set(prev);
        if (next.has(lineId)) next.delete(lineId);
        else next.add(lineId);
        return next;
      });
      return;
    }
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(lineId)) next.delete(lineId);
      else next.add(lineId);
      writeCollapsedLines(window.localStorage, next);
      return next;
    });
  }

  function renderSection(section) {
    const anyOpen = unlocked === null || section.controls.some((control) => unlocked.has(control.id));
    return (
      <section key={section.id} className={`kc-section ${anyOpen ? "" : "kc-section-locked"}`}>
        <h3>{section.name}</h3>
        <div className="kc-section-controls">
          {section.controls.map((control) => {
            const locked = unlocked !== null && !unlocked.has(control.id);
            const guided = !locked && guidance !== null && guidance !== undefined && guidance.ids.has(control.id);
            const isAnchor = guided && guidance.anchor === control.id;
            const body = control.kind === "selector" ? (
              <label className={`kc-selector ${locked ? "kc-selector-locked" : ""}`}>
                <span className="kc-knob-label">{locked ? "🔒 " : ""}{control.label}</span>
                <select
                  value={patch[control.id]}
                  disabled={locked}
                  onChange={(event) => onChange(control.id, event.target.value)}
                >
                  {control.choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
                </select>
              </label>
            ) : (
              <Knob
                control={control}
                value={patch[control.id]}
                locked={locked}
                onChange={onChange}
              />
            );
            if (!guided) return <div key={control.id} className="kc-control">{body}</div>;
            const status = feedback?.[control.id] ?? null;
            const state = status ? (status.within ? "kc-control-ok" : "kc-control-fix") : "";
            return (
              <div
                key={control.id}
                className={`kc-control kc-control-guided ${state}`}
                ref={isAnchor ? anchorRef : undefined}
              >
                {!isAnchor && !status && <span className="kc-pointer" aria-hidden="true">▾</span>}
                {body}
                {(isAnchor || status) && <GuidanceBubble tip={isAnchor ? guidance.tip : null} status={status} />}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className="kc-panel">
      {lines.map((line) => {
        // A lesson step that points into this line forces it open, whatever
        // the saved fold says.
        const guided = lessonMode ? lineIsUseful(line, usefulIds) : false;
        const folded = lineIsFolded({
          lessonMode, useful: guided, saved: collapsed.has(line.id), peeked: peeked.has(line.id),
        });
        return (
          <div key={line.id} className={`kc-line ${folded ? "kc-line-folded" : ""}`}>
            <button
              type="button"
              className="kc-line-toggle"
              onClick={() => toggleLine(line.id)}
              aria-expanded={!folded}
              disabled={guided}
              title={guided
                ? "The current lesson step uses these controls"
                : (folded ? `Show ${line.name}` : `Hide ${line.name}`)}
            >
              <span className="kc-line-chevron" aria-hidden="true">{folded ? "▸" : "▾"}</span>
              {line.name}
            </button>
            <div className="kc-line-sections" hidden={folded}>
              {line.sections.map((section) => renderSection(section))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
