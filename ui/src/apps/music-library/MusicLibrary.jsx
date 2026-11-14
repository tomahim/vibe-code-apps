import { useEffect, useMemo, useRef, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import CodeEditor from "../../components/CodeEditor.jsx";
import { getEngine, SYNTH_PALETTE } from "./engine/supersonicEngine.js";
import { createPerformance } from "./engine/player.js";
import { tracks } from "./tracks/index.js";
import Tutorial from "./Tutorial.jsx";
import "./music-library.css";

const storageKey = (trackId) => `music-library:code:${trackId}`;

function loadCode(track) {
  try {
    return window.localStorage.getItem(storageKey(track.id)) ?? track.code;
  } catch {
    return track.code;
  }
}

function saveCode(trackId, code) {
  try {
    window.localStorage.setItem(storageKey(trackId), code);
  } catch {
    /* private mode: edits simply stay in memory */
  }
}

export default function MusicLibrary({ onHome }) {
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
    if (import.meta.env.DEV) window.__musicEngine = engine; // audio-check probe
  }

  const [track, setTrack] = useState(tracks[0]);
  const [codes, setCodes] = useState(() =>
    Object.fromEntries(tracks.map((t) => [t.id, loadCode(t)])),
  );
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0.9);
  const [startedCode, setStartedCode] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mode, setMode] = useState("library"); // "library" | "tutorial"

  const code = codes[track.id];
  const edited = code !== track.code;
  const dirtyWhilePlaying = playing && code !== startedCode;

  useEffect(() => () => performanceRef.current.stop(), []);

  function selectTrack(next) {
    performanceRef.current.stop();
    setPlaying(false);
    setError("");
    setTrack(next);
  }

  function updateCode(value) {
    setCodes((prev) => ({ ...prev, [track.id]: value }));
    saveCode(track.id, value);
  }

  function resetCode() {
    updateCode(track.code);
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
        engine.setMasterVolume(volume);
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

  function changeVolume(value) {
    setVolume(value);
    engine.setMasterVolume(value);
  }

  return (
    <main className="music-library">
      <header className="ml-header">
        <button type="button" className="ml-home" onClick={onHome} aria-label="Back to the catalog">
          ←
        </button>
        <div>
          <h1>Music generation library</h1>
          <p>Generative film ambiences, synthesized live in your browser by a real
            SuperCollider engine (SuperSonic / scsynth on WebAssembly). No server:
            press play, read the score, change the code.</p>
        </div>
        <button
          type="button"
          className="ml-tutorial-toggle"
          onClick={() => {
            performanceRef.current.stop();
            setPlaying(false);
            setMode(mode === "tutorial" ? "library" : "tutorial");
          }}
        >
          {mode === "tutorial" ? "Library" : "Tutorial"}
        </button>
      </header>

      {mode === "tutorial" ? (
        <Tutorial onBack={() => setMode("library")} />
      ) : (
      <>

      <nav className="ml-tracks" aria-label="Library">
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ml-track ${t.id === track.id ? "active" : ""}`}
            onClick={() => selectTrack(t)}
          >
            <span className="ml-track-title">{t.title}</span>
            <span className="ml-track-mood">{t.mood}</span>
          </button>
        ))}
      </nav>

      <section className="ml-player">
        <div className="ml-player-head">
          <div>
            <h2>{track.title}</h2>
            <p className="ml-description">{track.description}</p>
            <p className="ml-synths">Sounds: {track.synths.join(", ")} - {track.minutes}</p>
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
          <p className="ml-status">
            Code changed - press Play again to hear your edits.
          </p>
        )}

        <label className="ml-volume">
          Volume
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
          />
        </label>

        <div className="ml-editor-head">
          <h3>The score</h3>
          <div className="ml-editor-actions">
            {edited && (
              <button type="button" className="ml-reset" onClick={resetCode}>
                Reset to original
              </button>
            )}
            <button
              type="button"
              className="ml-palette-toggle"
              onClick={() => setPaletteOpen((v) => !v)}
            >
              {paletteOpen ? "Hide sounds" : "Available sounds"}
            </button>
          </div>
        </div>
        {paletteOpen && (
          <p className="ml-palette">
            {SYNTH_PALETTE.join(", ")} - each note also takes amp, pan, attack,
            dur, release, cutoff, res; notes as names ("C#3") or MIDI numbers.
          </p>
        )}
        <CodeEditor
          key={track.id}
          value={code}
          onChange={updateCode}
          onRun={togglePlay}
          language={javascript()}
          label={`Score for ${track.title}`}
          className="ml-editor"
        />
        <p className="ml-hint">
          Your edits are saved in this browser only. Ctrl/Cmd+Enter re-plays.
        </p>
      </section>
      </>
      )}
    </main>
  );
}
