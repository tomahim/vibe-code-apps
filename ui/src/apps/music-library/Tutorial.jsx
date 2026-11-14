import { useEffect, useMemo, useRef, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import CodeEditor from "../../components/CodeEditor.jsx";
import { getEngine } from "./engine/supersonicEngine.js";
import { createPerformance } from "./engine/player.js";
import { steps } from "./tutorial/steps.js";

const storageKey = (stepId) => `music-library:tutorial:${stepId}`;

function loadCode(step) {
  try {
    return window.localStorage.getItem(storageKey(step.id)) ?? step.code;
  } catch {
    return step.code;
  }
}

function saveCode(stepId, code) {
  try {
    window.localStorage.setItem(storageKey(stepId), code);
  } catch {
    /* private mode: edits simply stay in memory */
  }
}

export default function Tutorial({ onBack }) {
  const engine = useMemo(() => getEngine(), []);
  const performanceRef = useRef(null);
  if (!performanceRef.current) {
    performanceRef.current = createPerformance(engine, {
      onError: (message) => {
        performanceRef.current?.stop();
        setError(message);
        setPlaying(false);
      },
      onEnd: () => setPlaying(false),
    });
  }

  const [index, setIndex] = useState(0);
  const [codes, setCodes] = useState(() =>
    Object.fromEntries(steps.map((s) => [s.id, loadCode(s)])),
  );
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [startedCode, setStartedCode] = useState("");

  const step = steps[index];
  const code = codes[step.id];
  const edited = code !== step.code;
  const dirtyWhilePlaying = playing && code !== startedCode;

  useEffect(() => () => performanceRef.current.stop(), []);

  function selectStep(next) {
    performanceRef.current.stop();
    setPlaying(false);
    setError("");
    setIndex(next);
  }

  function updateCode(value) {
    setCodes((prev) => ({ ...prev, [step.id]: value }));
    saveCode(step.id, value);
  }

  async function togglePlay() {
    setError("");
    if (playing) {
      performanceRef.current.stop();
      setPlaying(false);
      return;
    }
    try {
      if (!engine.ready) {
        setBooting(true);
        await engine.boot(setStatus);
        engine.setMasterVolume(0.9);
        setBooting(false);
      }
      setStatus("");
      const started = performanceRef.current.start(code);
      if (started) {
        setStartedCode(code);
        setPlaying(true);
      }
    } catch (err) {
      setBooting(false);
      setStatus("");
      setError(
        `The audio engine could not start: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return (
    <section className="ml-player ml-tutorial">
      <div className="ml-player-head">
        <div>
          <h2>
            Lesson {index + 1} of {steps.length}: {step.title}
          </h2>
          <p className="ml-description">{step.goal}</p>
        </div>
        <button
          type="button"
          className={`ml-play ${playing ? "stop" : ""}`}
          onClick={togglePlay}
          disabled={booting}
        >
          {booting ? "Loading…" : playing ? "■ Stop" : "▶ Play"}
        </button>
      </div>

      {status && <p className="ml-status">{status}</p>}
      {error && <p className="ml-error" role="alert">{error}</p>}
      {dirtyWhilePlaying && (
        <p className="ml-status">Code changed - press Play again to hear your edits.</p>
      )}

      <nav className="ml-steps" aria-label="Lessons">
        <button
          type="button"
          className="ml-step-nav"
          disabled={index === 0}
          onClick={() => selectStep(index - 1)}
        >
          ← Previous
        </button>
        <div className="ml-step-dots">
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`ml-step-dot ${i === index ? "active" : ""}`}
              aria-label={`Lesson ${i + 1}: ${s.title}`}
              onClick={() => selectStep(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="ml-step-nav"
          disabled={index === steps.length - 1}
          onClick={() => selectStep(index + 1)}
        >
          Next →
        </button>
      </nav>

      <div className="ml-editor-head">
        <h3>Try it</h3>
        <div className="ml-editor-actions">
          {edited && (
            <button type="button" className="ml-reset" onClick={() => updateCode(step.code)}>
              Reset to original
            </button>
          )}
          <button type="button" className="ml-palette-toggle" onClick={onBack}>
            Back to the library
          </button>
        </div>
      </div>
      <CodeEditor
        key={step.id}
        value={code}
        onChange={updateCode}
        onRun={togglePlay}
        language={javascript()}
        label={`Score for lesson ${index + 1}: ${step.title}`}
        className="ml-editor"
      />
      <p className="ml-hint">
        Your edits are saved in this browser only. Ctrl/Cmd+Enter re-plays.
        Every loop needs an await m.sleep(...) inside, and Stop ends an
        experiment gone loud.
      </p>
    </section>
  );
}
