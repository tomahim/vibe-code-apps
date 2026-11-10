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

  const [powered, setPowered] = useState(false);
  const [mode, setMode] = useState("lessons");
  const [patch, setPatch] = useState(() => normalizePatch());
  const [octaveShift, setOctaveShift] = useState(0);
  const [activeKeys, setActiveKeys] = useState(() => new Set());
  const heldNotes = useRef(new HeldNotes());
  // Values the global key listeners need without re-binding them.
  const live = useRef({ powered: false, root: BASE_MIDI });
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
      // Bring the knob this step points at fully into the usable band between
      // the sticky step bar and the pinned piano, leaving room above it for
      // the callout: no part of knob, label or tip hides behind either bar.
      window.setTimeout(() => {
        const el = anchorRef.current;
        if (!el) return;
        const bar = document.querySelector(".kc-step-bar");
        const keys = document.querySelector(".kc-keyboard-row");
        const bandTop = bar ? bar.getBoundingClientRect().bottom : 0;
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

      {mode === "lessons" && (
        <div className="kc-step-bar">
          <div className="kc-step-bar-text">
            <span className="kc-step-bar-lesson">{currentLesson.chapterTitle} · {currentLesson.title}</span>
            <p className="kc-step-bar-goal"><strong>Sound goal:</strong> {currentLesson.goal.hint}</p>
          </div>
          <div className="kc-step-bar-actions">
            <button type="button" onClick={hearTarget} disabled={!powered}>Hear the target</button>
            <button type="button" className="kc-check" onClick={checkEar} disabled={!powered}>Check my ear</button>
          </div>
          {match && (
            <div className={`kc-step-bar-result ${match.passed ? "kc-step-bar-passed" : ""}`} role="status">
              {match.passed ? (
                <>
                  <span>Matched ({match.score}%).</span>
                  {lessons[lessons.indexOf(currentLesson) + 1] && (
                    <button type="button" onClick={() => selectLesson(lessons[lessons.indexOf(currentLesson) + 1], { scroll: true })}>
                      Next: {lessons[lessons.indexOf(currentLesson) + 1].title}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span>{match.score}% there - listen again and adjust.</span>
                  {!revealGap && tries >= 3 && (
                    <button type="button" onClick={() => setRevealGap(true)}>Reveal the gap</button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {mode === "lessons" ? (
        <section className="kc-lesson" aria-label="Current lesson">
          <div className="kc-lesson-head">
            <span className="kc-chapter">{currentLesson.chapterTitle}</span>
            <h2>{currentLesson.title}{lessonPassed ? " ✓" : ""}</h2>
            <span className="kc-minutes">{currentLesson.minutes} min</span>
          </div>
          {currentLesson.body.map((line) => <p key={line}>{line}</p>)}
          {match && (
            <div className={`kc-match ${match.passed ? "kc-match-passed" : ""}`} role="status">
              {match.passed
                ? <p>Passed - your ear matched the target ({match.score}%). The next knob is unlocked.</p>
                : <p>Not yet - {match.score}% there. Listen again and adjust.</p>}
              {match.passed && lessons[lessons.indexOf(currentLesson) + 1] && (
                <button type="button" className="kc-reveal" onClick={() => selectLesson(lessons[lessons.indexOf(currentLesson) + 1], { scroll: true })}>
                  Next: {lessons[lessons.indexOf(currentLesson) + 1].title}
                </button>
              )}
              {!match.passed && (
                <ul>
                  {match.checks.map((check) => (
                    <li key={check.id}>
                      {check.label}: {closenessLabel(check)}
                      {revealGap && check.direction ? ` (turn ${check.direction})` : ""}
                    </li>
                  ))}
                </ul>
              )}
              {!match.passed && !revealGap && tries >= 3 && (
                <button type="button" className="kc-reveal" onClick={() => setRevealGap(true)}>Reveal the gap</button>
              )}
            </div>
          )}
          <details className="kc-path">
            <summary>Lesson path ({passedIds.size}/{lessons.length} passed)</summary>
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
          </details>
        </section>
      ) : (
        <section className="kc-workshop" aria-label="Workshop">
          <p>The full panel, all {TOTAL_CONTROLS} controls live. Build a sound, name it, and keep it on your shelf.</p>
          {signedIn ? (
            <div className="kc-shelf">
              <div className="kc-save-row">
                <input
                  type="text"
                  value={presetName}
                  maxLength={80}
                  placeholder="Name this instrument…"
                  onChange={(event) => setPresetName(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") onSavePreset(); }}
                />
                <button type="button" onClick={onSavePreset} disabled={!presetName.trim()}>Save</button>
              </div>
              {presets.length > 0 && (
                <ul className="kc-presets">
                  {presets.map((preset) => (
                    <li key={preset.id}>
                      <button type="button" className="kc-preset-name" onClick={() => onLoadPreset(preset)}>{preset.name}</button>
                      <button type="button" className="kc-preset-delete" aria-label={`Delete ${preset.name}`} onClick={() => onDeletePreset(preset)}>×</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="kc-hint"><a href="/login">Sign in</a> to save your instruments and find them later.</p>
          )}
        </section>
      )}

      {notice && <p className="kc-notice" role="status">{notice}</p>}

      <Panel patch={patch} unlocked={unlocked} onChange={changeParam} guidance={guidance} anchorRef={anchorRef} />

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
