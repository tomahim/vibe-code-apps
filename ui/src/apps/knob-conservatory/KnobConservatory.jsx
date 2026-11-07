import { useEffect, useMemo, useRef, useState } from "react";
import { getToken } from "../../auth.js";
import Panel from "./components/Panel.jsx";
import Keyboard from "./components/Keyboard.jsx";
import { SynthEngine } from "./synth/engine.js";
import { normalizePatch, TOTAL_CONTROLS } from "./synth/params.js";
import { scoreMatch, closenessLabel } from "./synth/matching.js";
import { chapters, lessons, unlockedControls, nextLesson } from "./lessons/index.js";
import { readProgress, writeProgress } from "./progress.js";
import { listPresets, savePreset, deletePreset } from "./presets.js";
import "./knob-conservatory.css";

const BASE_MIDI = 60; // C4

export default function KnobConservatory({ onHome }) {
  const engine = useRef(null);
  if (!engine.current) engine.current = new SynthEngine();

  const [powered, setPowered] = useState(false);
  const [mode, setMode] = useState("lessons");
  const [patch, setPatch] = useState(() => normalizePatch());
  const [octaveShift, setOctaveShift] = useState(0);
  const [progress, setProgress] = useState(() => readProgress(window.localStorage, lessons));
  const [match, setMatch] = useState(null);
  const [revealGap, setRevealGap] = useState(false);
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [notice, setNotice] = useState("");
  const signedIn = Boolean(getToken());

  const passedIds = useMemo(() => new Set(Object.keys(progress.passed)), [progress]);
  const currentLesson = lessons.find((lesson) => lesson.id === progress.currentLesson)
    ?? nextLesson(passedIds)
    ?? lessons[lessons.length - 1];
  const unlocked = useMemo(
    () => (mode === "workshop" ? null : unlockedControls(passedIds, currentLesson)),
    [mode, passedIds, currentLesson],
  );

  useEffect(() => {
    selectLesson(currentLesson, { silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (signedIn) refreshPresets();
  }, [signedIn]);

  function persist(next) {
    setProgress(next);
    writeProgress(window.localStorage, next);
  }

  function changeParam(id, value) {
    setPatch((prev) => ({ ...prev, [id]: value }));
    engine.current.setParam(id, value);
    setMatch(null);
  }

  function selectLesson(lesson, { silent } = {}) {
    const base = normalizePatch(lesson.base_patch);
    setPatch(base);
    engine.current.applyPatch(base);
    setMatch(null);
    setRevealGap(false);
    persist({ ...progress, currentLesson: lesson.id });
    if (!silent) setNotice("");
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

      {mode === "lessons" ? (
        <section className="kc-lesson" aria-label="Current lesson">
          <div className="kc-lesson-head">
            <span className="kc-chapter">{currentLesson.chapterTitle}</span>
            <h2>{currentLesson.title}{lessonPassed ? " ✓" : ""}</h2>
            <span className="kc-minutes">{currentLesson.minutes} min</span>
          </div>
          {currentLesson.body.map((line) => <p key={line}>{line}</p>)}
          <p className="kc-goal"><strong>Sound goal:</strong> {currentLesson.goal.hint}</p>
          <div className="kc-lesson-actions">
            <button type="button" onClick={hearTarget} disabled={!powered}>Hear the target</button>
            <button type="button" className="kc-check" onClick={checkEar} disabled={!powered}>Check my ear</button>
          </div>
          {match && (
            <div className={`kc-match ${match.passed ? "kc-match-passed" : ""}`} role="status">
              {match.passed
                ? <p>Passed - your ear matched the target ({match.score}%). The next knob is unlocked.</p>
                : <p>Not yet - {match.score}% there. Listen again and adjust.</p>}
              {match.passed && lessons[lessons.indexOf(currentLesson) + 1] && (
                <button type="button" className="kc-reveal" onClick={() => selectLesson(lessons[lessons.indexOf(currentLesson) + 1])}>
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
                          onClick={() => selectLesson(full)}
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

      <Panel patch={patch} unlocked={unlocked} onChange={changeParam} />

      <Keyboard
        baseMidi={BASE_MIDI}
        octaveShift={octaveShift}
        onShift={(delta) => setOctaveShift((shift) => Math.min(1, Math.max(-2, shift + delta)))}
        onNoteOn={(midi) => { if (powered) engine.current.noteOn(midi); }}
        onNoteOff={(midi) => { if (powered) engine.current.noteOff(midi); }}
      />
    </div>
  );
}
