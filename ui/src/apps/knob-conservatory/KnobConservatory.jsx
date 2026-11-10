import { useEffect, useMemo, useRef, useState } from "react";
import { getToken } from "../../auth.js";
import Panel from "./components/Panel.jsx";
import Keyboard from "./components/Keyboard.jsx";
import { SynthEngine } from "./synth/engine.js";
import { normalizePatch, TOTAL_CONTROLS } from "./synth/params.js";
import { offsetForKey, isTextEntryTarget, HeldNotes } from "./synth/computerKeys.js";
import { scoreMatch, closenessLabel } from "./synth/matching.js";
import { chapters, lessons, unlockedControls, nextLesson } from "./lessons/index.js";
import { readProgress, writeProgress } from "./progress.js";
import { listPresets, savePreset, deletePreset } from "./presets.js";
import "./knob-conservatory.css";

const BASE_MIDI = 60; // C4

export default function KnobConservatory({ onHome }) {
  const engine = useRef(null);
  if (!engine.current) {
    engine.current = new SynthEngine();
    if (import.meta.env.DEV) window.__kcEngine = engine.current; // visual-check probe
  }

  // Power is on by default: the player should be able to play right away.
  // The browser's autoplay policy may still hold the AudioContext suspended
  // until the first gesture; the wake effect below resumes it transparently.
  const [powered, setPowered] = useState(true);
  const [mode, setMode] = useState("lessons");
  const [patch, setPatch] = useState(() => normalizePatch());
  const [octaveShift, setOctaveShift] = useState(0);
  const [activeKeys, setActiveKeys] = useState(() => new Set());
  const heldNotes = useRef(new HeldNotes());
  // Values the global key listeners need without re-binding them.
  const live = useRef({ powered: true, root: BASE_MIDI });
  live.current = { powered, root: BASE_MIDI + octaveShift * 12 };
  const [progress, setProgress] = useState(() => readProgress(window.localStorage, lessons));
  const [match, setMatch] = useState(null);
  const [revealGap, setRevealGap] = useState(false);
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [notice, setNotice] = useState("");
  const signedIn = Boolean(getToken());
  const anchorRef = useRef(null); // the knob the current lesson points at

  const passedIds = useMemo(() => new Set(Object.keys(progress.passed)), [progress]);
  const currentLesson = lessons.find((lesson) => lesson.id === progress.currentLesson)
    ?? nextLesson(passedIds)
    ?? lessons[lessons.length - 1];
  const unlocked = useMemo(
    () => (mode === "workshop" ? null : unlockedControls(passedIds, currentLesson)),
    [mode, passedIds, currentLesson],
  );

  // Knobs the current lesson asks the player to adjust: the panel rings them
  // and anchors the step callout to the first one.
  const guidance = useMemo(() => {
    if (mode !== "lessons") return null;
    const ids = Object.keys(currentLesson.goal.params);
    if (ids.length === 0) return null;
    return { ids: new Set(ids), anchor: ids[0], tip: currentLesson.goal.hint };
  }, [mode, currentLesson]);

  // Per-control verdicts from the last ear check, shown on each goal knob's
  // tooltip so the feedback sits on the control it talks about. Direction
  // ("turn up/down") is revealed only after the player asks for the gap.
  const controlFeedback = useMemo(() => {
    if (!match || mode !== "lessons") return null;
    const feedback = {};
    for (const check of match.checks) {
      const direction = revealGap && check.direction ? ` · turn ${check.direction}` : "";
      feedback[check.id] = { text: `${closenessLabel(check)}${direction}`, within: check.within };
    }
    return feedback;
  }, [match, revealGap, mode]);

  useEffect(() => {
    selectLesson(currentLesson, { silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (signedIn) refreshPresets();
  }, [signedIn]);

  function shiftOctave(delta) {
    setOctaveShift((shift) => Math.min(1, Math.max(-2, shift + delta)));
  }

  // Default-on power: try to start the engine immediately, and retry on the
  // first tap or key press, which is when autoplay policies let audio run.
  // While the switch is off these gestures leave the engine parked.
  useEffect(() => {
    function wakeEngine() {
      if (live.current.powered && !engine.current.running) engine.current.powerOn();
    }
    wakeEngine();
    window.addEventListener("pointerdown", wakeEngine);
    window.addEventListener("keydown", wakeEngine);
    return () => {
      window.removeEventListener("pointerdown", wakeEngine);
      window.removeEventListener("keydown", wakeEngine);
    };
  }, []);

  // Computer-keyboard playing: A S D F G H J K white keys, W E T Y U black
  // keys, up/down arrows for octave (same physical positions on AZERTY).
  // Monophonic with last-note priority, like the on-screen strip. Never
  // steals keystrokes from text fields or modified browser shortcuts.
  useEffect(() => {
    function onKeyDown(event) {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTextEntryTarget(event.target)) return;
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        shiftOctave(event.key === "ArrowUp" ? 1 : -1);
        return;
      }
      const offset = offsetForKey(event.key);
      if (offset === null) return;
      if (!live.current.powered) return;
      event.preventDefault();
      const midi = live.current.root + offset;
      if (heldNotes.current.press(event.key.toLowerCase(), midi, offset) !== null) {
        engine.current.noteOn(midi);
        setActiveKeys(heldNotes.current.activeOffsets());
      }
    }

    function onKeyUp(event) {
      const result = heldNotes.current.release(event.key.toLowerCase());
      if (result === null) return;
      if (result === "off") engine.current.noteOff();
      else engine.current.noteOn(result); // glide back to the note still held
      setActiveKeys(heldNotes.current.activeOffsets());
    }

    function releaseAll() {
      if (heldNotes.current.clear() === "off") engine.current.noteOff();
      setActiveKeys(new Set());
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", releaseAll);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseAll);
      releaseAll();
    };
  }, []);

  function persist(next) {
    setProgress(next);
    writeProgress(window.localStorage, next);
  }

  function changeParam(id, value) {
    setPatch((prev) => ({ ...prev, [id]: value }));
    engine.current.setParam(id, value);
    setMatch(null);
  }

  function selectLesson(lesson, { silent, scroll } = {}) {
    const base = normalizePatch(lesson.base_patch);
    setPatch(base);
    engine.current.applyPatch(base);
    setMatch(null);
    setRevealGap(false);
    persist({ ...progress, currentLesson: lesson.id });
    if (!silent) setNotice("");
    if (scroll) {
      // Bring the knob this step points at fully into the usable band below
      // the pinned goal bar (phones) and above the pinned piano, leaving room
      // above it for the callout: no part of knob, label or tip hides.
      window.setTimeout(() => {
        const el = anchorRef.current;
        if (!el) return;
        const bar = document.querySelector(".kc-mobilebar");
        const bandTop = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().bottom : 0;
        const keys = document.querySelector(".kc-keyboard-row");
        const bandBottom = keys ? keys.getBoundingClientRect().top : window.innerHeight;
        const callout = 76; // bubble + gap allowance above the knob
        const rect = el.getBoundingClientRect();
        const free = Math.max(0, bandBottom - bandTop - callout - rect.height);
        const targetTop = bandTop + callout + free / 2;
        window.scrollBy({ top: rect.top - targetTop, behavior: "smooth" });
      }, 60);
    }
  }

  async function togglePower() {
    if (powered) {
      await engine.current.powerOff();
      setPowered(false);
    } else {
      setPowered(await engine.current.powerOn());
    }
  }

  function targetPatch(lesson) {
    return normalizePatch({ ...lesson.base_patch, ...lesson.goal.params });
  }

  async function hearTarget() {
    if (!powered) return;
    await engine.current.preview(targetPatch(currentLesson), currentLesson.note ?? 57);
  }

  function checkEar() {
    const result = scoreMatch(currentLesson.goal.params, patch, currentLesson.goal.tolerances ?? {});
    setMatch(result);
    const tries = { ...progress.tries, [currentLesson.id]: (progress.tries[currentLesson.id] ?? 0) + 1 };
    if (result.passed) {
      persist({
        ...progress,
        tries,
        passed: { ...progress.passed, [currentLesson.id]: { score: result.score, at: new Date().toISOString() } },
      });
      setRevealGap(false);
    } else {
      persist({ ...progress, tries });
    }
  }

  async function refreshPresets() {
    try {
      const data = await listPresets();
      setPresets(data.presets ?? []);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function onSavePreset() {
    const name = presetName.trim();
    if (!name) return;
    try {
      await savePreset(name, patch);
      setPresetName("");
      setNotice(`"${name}" is on the shelf.`);
      await refreshPresets();
    } catch (error) {
      setNotice(error.message);
    }
  }

  function onLoadPreset(preset) {
    const loaded = normalizePatch(preset.settings);
    setPatch(loaded);
    engine.current.applyPatch(loaded);
    setMatch(null);
    setRevealGap(false);
    setNotice(`"${preset.name}" is on the panel.`);
  }

  async function onDeletePreset(preset) {
    try {
      await deletePreset(preset.id);
      setNotice(`"${preset.name}" removed.`);
      await refreshPresets();
    } catch (error) {
      setNotice(error.message);
    }
  }

  const tries = progress.tries[currentLesson.id] ?? 0;
  const lessonPassed = Boolean(progress.passed[currentLesson.id]);
  const upcoming = nextLesson(passedIds);

  return (
    <div className="kc-app">
      <header className="kc-header">
        <button type="button" className="kc-back" onClick={onHome} aria-label="Back to the gallery">←</button>
        <div>
          <h1>Knob Conservatory</h1>
          <p>Learn synthesis one knob at a time, by ear.</p>
        </div>
        <button
          type="button"
          className={`kc-power ${powered ? "kc-power-on" : ""}`}
          onClick={togglePower}
          aria-pressed={powered}
        >
          {powered ? "On" : "Power"}
        </button>
      </header>

      <nav className="kc-modes" aria-label="Mode">
        <button type="button" className={mode === "lessons" ? "active" : ""} onClick={() => setMode("lessons")}>Lessons</button>
        <button type="button" className={mode === "workshop" ? "active" : ""} onClick={() => setMode("workshop")}>Workshop</button>
      </nav>

      {!powered && <p className="kc-hint">Flip the power switch, then play the keyboard below.</p>}

      {mode === "lessons" ? (
        <>
          {/* Phones: the goal and the two actions stay pinned on screen while
              the panel scrolls; the verdict itself lives at the knobs. */}
          <div className="kc-mobilebar">
            <span className="kc-mobilebar-goal"><strong>Goal:</strong> {currentLesson.goal.hint}</span>
            <div className="kc-mobilebar-actions">
              <button type="button" onClick={hearTarget} disabled={!powered}>Hear the target</button>
              <button type="button" className="kc-check" onClick={checkEar} disabled={!powered}>Check my ear</button>
            </div>
          </div>
          <div className="kc-lesson-layout">
            <aside className="kc-sidebar" aria-label="Lesson steps">
              <div className="kc-lesson-head">
                <span className="kc-chapter">{currentLesson.chapterTitle}</span>
                <h2>{currentLesson.title}{lessonPassed ? " ✓" : ""}</h2>
                <span className="kc-minutes">{currentLesson.minutes} min</span>
              </div>
              {currentLesson.body.map((line) => <p key={line}>{line}</p>)}
              <p className="kc-goal"><strong>Sound goal:</strong> {currentLesson.goal.hint}</p>
              <div className="kc-side-actions">
                <button type="button" onClick={hearTarget} disabled={!powered}>Hear the target</button>
                <button type="button" className="kc-check" onClick={checkEar} disabled={!powered}>Check my ear</button>
              </div>
              {match && (
                <div className={`kc-match ${match.passed ? "kc-match-passed" : ""}`} role="status">
                  {match.passed
                    ? <p>Passed - your ear matched the target ({match.score}%). The next knob is unlocked.</p>
                    : <p>Not yet - {match.score}% there. Each flagged knob says how close it is.</p>}
                  {match.passed && lessons[lessons.indexOf(currentLesson) + 1] && (
                    <button type="button" className="kc-reveal" onClick={() => selectLesson(lessons[lessons.indexOf(currentLesson) + 1], { scroll: true })}>
                      Next: {lessons[lessons.indexOf(currentLesson) + 1].title}
                    </button>
                  )}
                  {!match.passed && !revealGap && tries >= 3 && (
                    <button type="button" className="kc-reveal" onClick={() => setRevealGap(true)}>Reveal the gap</button>
                  )}
                  {!match.passed && revealGap && (
                    <p className="kc-match-revealed">The flagged knobs now say which way to turn.</p>
                  )}
                </div>
              )}
              <nav className="kc-path" aria-label="Lesson path">
                <h3>Lesson path ({passedIds.size}/{lessons.length} passed)</h3>
                <div className="kc-path-scroll">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="kc-path-chapter">
                      <h4>{chapter.title}</h4>
                      <ol>
                        {chapter.lessons.map((lesson) => {
                          const full = lessons.find((entry) => entry.id === lesson.id);
                          const locked = !passedIds.has(lesson.id) && upcoming?.id !== lesson.id
                            && lessons.indexOf(full) > lessons.indexOf(upcoming ?? lessons[lessons.length - 1]);
                          return (
                            <li key={lesson.id}>
                              <button
                                type="button"
                                disabled={locked}
                                className={lesson.id === currentLesson.id ? "active" : ""}
                                onClick={() => selectLesson(full, { scroll: true })}
                              >
                                {progress.passed[lesson.id] ? "✓ " : locked ? "🔒 " : ""}{lesson.title}
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ))}
                </div>
              </nav>
              <section className="kc-side-shelf" aria-label="Instrument shelf">
                <h3>Your shelf</h3>
                <PresetShelf
                  signedIn={signedIn}
                  presetName={presetName}
                  onPresetName={setPresetName}
                  onSave={onSavePreset}
                  presets={presets}
                  onLoad={onLoadPreset}
                  onDelete={onDeletePreset}
                />
              </section>
            </aside>
            <Panel patch={patch} unlocked={unlocked} onChange={changeParam} guidance={guidance} feedback={controlFeedback} anchorRef={anchorRef} />
          </div>
        </>
      ) : (
        <section className="kc-workshop" aria-label="Workshop">
          <p>The full panel, all {TOTAL_CONTROLS} controls live. Build a sound, name it, and keep it on your shelf.</p>
          <PresetShelf
            signedIn={signedIn}
            presetName={presetName}
            onPresetName={setPresetName}
            onSave={onSavePreset}
            presets={presets}
            onLoad={onLoadPreset}
            onDelete={onDeletePreset}
          />
          <Panel patch={patch} unlocked={unlocked} onChange={changeParam} guidance={guidance} feedback={controlFeedback} anchorRef={anchorRef} />
        </section>
      )}

      {notice && <p className="kc-notice" role="status">{notice}</p>}

      <p className="kc-keys-hint">
        Your computer keyboard plays too: A S D F G H J K for the white keys, W E T Y U for the black
        keys, up and down arrows for the octave. On AZERTY, use the same key positions.
      </p>

      <Keyboard
        baseMidi={BASE_MIDI}
        octaveShift={octaveShift}
        onShift={shiftOctave}
        onNoteOn={(midi) => { if (powered) engine.current.noteOn(midi); }}
        onNoteOff={(midi) => { if (powered) engine.current.noteOff(midi); }}
        activeOffsets={activeKeys}
      />
    </div>
  );
}

// The instrument shelf: save the current patch under a name and reload saved
// instruments. Shared by the workshop and the lessons sidebar, so a sound
// discovered mid-lesson can be kept without switching modes.
function PresetShelf({ signedIn, presetName, onPresetName, onSave, presets, onLoad, onDelete }) {
  if (!signedIn) {
    return <p className="kc-hint"><a href="/login">Sign in</a> to save your instruments and find them later.</p>;
  }
  return (
    <div className="kc-shelf">
      <div className="kc-save-row">
        <input
          type="text"
          value={presetName}
          maxLength={80}
          placeholder="Name this instrument…"
          onChange={(event) => onPresetName(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") onSave(); }}
        />
        <button type="button" onClick={onSave} disabled={!presetName.trim()}>Save</button>
      </div>
      {presets.length > 0 && (
        <ul className="kc-presets">
          {presets.map((preset) => (
            <li key={preset.id}>
              <button type="button" className="kc-preset-name" onClick={() => onLoad(preset)}>{preset.name}</button>
              <button type="button" className="kc-preset-delete" aria-label={`Delete ${preset.name}`} onClick={() => onDelete(preset)}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
