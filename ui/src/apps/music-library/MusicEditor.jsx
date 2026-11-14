import { useEffect, useMemo, useRef, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import CodeEditor from "../../components/CodeEditor.jsx";
import { getEngine, MUSIC_BUS } from "./engine/supersonicEngine.js";
import { SOUND_CATALOG } from "./soundCatalog.js";
import { createPerformance } from "./engine/player.js";
import { tracks as bundledTracks } from "./tracks/index.js";
import { createTrack, fetchTrack, signedIn, updateTrack } from "./api.js";
import "./music-library.css";

const LIST_PATH = "/apps/music-library";
const BUNDLED_PREFIX = "b-";

const NEW_TRACK_TEMPLATE = `// Your new track. Press Play to hear it, then Save to keep it in the library.
m.play("prophet", { note: "C4", dur: 1 });
await m.sleep(1);
m.play("prophet", { note: "E4", dur: 1 });
await m.sleep(1);
m.play("prophet", { note: "G4", dur: 2 });
`;

const bundledStorageKey = (id) => `music-library:code:bundled:${id}`;

function loadBundledCode(track) {
  try {
    return window.localStorage.getItem(bundledStorageKey(track.id)) ?? track.code;
  } catch {
    return track.code;
  }
}

// Full-width editor page for one track: edit the score, hear the current
// (even unsaved) code, save it to the shared library, and browse the
// available sounds in a collapsible second pane.
export default function MusicEditor({ trackId, onNavigate }) {
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

  const isNew = trackId === "new";
  const bundled = useMemo(
    () => (trackId?.startsWith(BUNDLED_PREFIX)
      ? bundledTracks.find((t) => t.id === trackId.slice(BUNDLED_PREFIX.length)) ?? null
      : null),
    [trackId],
  );

  const [track, setTrack] = useState(null); // saved metadata (api) or bundled item
  const [code, setCode] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [details, setDetails] = useState({ name: "", description: "", category: "" });
  const [loading, setLoading] = useState(!isNew && !bundled);
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(false);
  const [startedCode, setStartedCode] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [volume, setVolume] = useState(0.9);
  const [paneOpen, setPaneOpen] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches,
  );
  const [soundItems, setSoundItems] = useState(null);
  const [soundQuery, setSoundQuery] = useState("");
  const [soundType, setSoundType] = useState("");
  const [previewingSound, setPreviewingSound] = useState("");
  const editorViewRef = useRef(null);

  const canWrite = signedIn();
  const isApi = !bundled;
  const dirty = code !== savedCode;
  const dirtyWhilePlaying = playing && code !== startedCode;

  // Load the track once.
  useEffect(() => {
    if (isNew) {
      setCode(NEW_TRACK_TEMPLATE);
      setSavedCode("");
      setLoading(false);
      return undefined;
    }
    if (bundled) {
      const initial = loadBundledCode(bundled);
      setTrack({ name: bundled.title, description: bundled.description, origin: "bundled" });
      setCode(initial);
      setSavedCode(bundled.code);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    fetchTrack(trackId, controller.signal)
      .then((full) => {
        setTrack({ ...full, origin: "api" });
        setCode(full.code);
        setSavedCode(full.code);
        setDetails({
          name: full.name,
          description: full.description ?? "",
          category: full.category ?? "",
        });
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("Could not load this track from the library.");
        setLoading(false);
      });
    return () => controller.abort();
  }, [trackId, isNew, bundled]);

  useEffect(() => () => performanceRef.current.stop(), []);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty || !(isNew || isApi)) return undefined;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, isNew, isApi]);

  // Sounds list: the instruments API when deployed, else the static catalogue.
  useEffect(() => {
    if (!paneOpen || soundItems !== null) return;
    fetch("/api/apps/instruments/instruments/")
      .then((response) => {
        if (!response.ok) throw new Error(`instruments API ${response.status}`);
        return response.json();
      })
      .then((data) => setSoundItems(data.instruments))
      .catch(() => setSoundItems(SOUND_CATALOG));
  }, [paneOpen, soundItems]);

  function updateCode(value) {
    setCode(value);
    if (bundled) {
      try {
        window.localStorage.setItem(bundledStorageKey(bundled.id), value);
      } catch {
        /* storage unavailable: edits stay in memory */
      }
    }
  }

  function resetCode() {
    if (bundled) updateCode(bundled.code);
    else if (isNew) setCode(NEW_TRACK_TEMPLATE);
    else setCode(savedCode);
    setSaveMessage("");
  }

  async function bootEngine() {
    if (!engine.ready) {
      setBooting(true);
      await engine.boot(setStatus);
      engine.setMasterVolume(volume);
      setBooting(false);
    }
    setStatus("");
  }

  // Plays whatever is in the editor right now, saved or not.
  async function togglePlay() {
    setError("");
    if (playing) {
      performanceRef.current.stop();
      setPlaying(false);
      return;
    }
    try {
      await bootEngine();
      if (performanceRef.current.start(code)) {
        setStartedCode(code);
        setPlaying(true);
      }
    } catch (err) {
      setBooting(false);
      setStatus("");
      setError(`The audio engine could not start: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function changeVolume(value) {
    setVolume(value);
    engine.setMasterVolume(value);
  }

  async function save() {
    setSaving(true);
    setSaveMessage("");
    setError("");
    try {
      if (isNew) {
        const saved = await createTrack({
          name: details.name.trim() || "Untitled track",
          description: details.description.trim(),
          category: details.category.trim(),
          code,
        });
        setSavedCode(saved.code);
        window.history.replaceState({}, "", `${LIST_PATH}/edit/${saved.id}`);
        onNavigate(`${LIST_PATH}/edit/${saved.id}`);
        return;
      }
      const saved = await updateTrack(track.id, {
        code,
        name: details.name.trim() || track.name,
        description: details.description.trim(),
        category: details.category.trim(),
      });
      setTrack({ ...saved, origin: "api" });
      setSavedCode(saved.code);
      setSaveMessage(`Saved "${saved.name}".`);
    } catch (err) {
      setError(`Could not save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function previewSound(item) {
    setError("");
    try {
      await bootEngine();
      let id;
      if (item.definition_url) {
        const response = await fetch(item.definition_url);
        if (!response.ok) throw new Error(`could not fetch the definition (${response.status})`);
        const { name } = await engine.supersonic.loadSynthDef(await response.arrayBuffer());
        id = engine.supersonic.nextNodeId();
        engine.supersonic.send(
          "/s_new", name, id, 0, engine.sourceGroup, "note", 60, "amp", 0.25, "out_bus", MUSIC_BUS,
        );
      } else {
        if (!engine.supersonic.loadedSynthDefs.has(`sonic-pi-${item.name}`)) {
          await engine.supersonic.loadSynthDef(item.name);
        }
        id = engine.scheduleNote(engine.ntpNow() + 0.1, item.name, { note: 60, amp: 0.25 });
      }
      setPreviewingSound(item.name);
      setTimeout(() => {
        engine.supersonic?.send("/n_free", id);
        setPreviewingSound((current) => (current === item.name ? "" : current));
      }, 1200);
    } catch (err) {
      setBooting(false);
      setError(`Could not preview ${item.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function insertSound(item) {
    const view = editorViewRef.current;
    if (!view) return;
    view.dispatch(view.state.replaceSelection(`m.play("${item.name}", { note: "C4", dur: 1 });\n`));
    view.focus();
  }

  const soundTypes = useMemo(
    () => [...new Set((soundItems ?? []).map((s) => s.type).filter(Boolean))].sort(),
    [soundItems],
  );
  const visibleSounds = (soundItems ?? []).filter((it) => {
    const q = soundQuery.trim().toLowerCase();
    if (soundType && it.type !== soundType) return false;
    return !q || it.name.toLowerCase().includes(q) || (it.blurb ?? "").toLowerCase().includes(q);
  });

  const title = isNew ? (details.name.trim() || "New track") : (track?.name ?? "Track");
  const writable = !loading && (isNew || (isApi && Boolean(track)));

  return (
    <main className="music-library ml-editor-page">
      <header className="ml-editor-bar">
        <a className="ml-home" href={LIST_PATH} aria-label="Back to the library">←</a>
        <h1 className="ml-editor-title">{title}</h1>
        <div className="ml-editor-bar-actions">
          <label className="ml-volume ml-volume-inline">
            Volume
            <input
              type="range" min="0" max="1" step="0.05" value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
            />
          </label>
          <button
            type="button"
            className={`ml-play ${playing ? "stop" : ""}`}
            onClick={togglePlay}
            disabled={booting || loading || !code}
          >
            {booting ? "Loading…" : playing ? "■ Stop" : "▶ Play"}
          </button>
          {writable && (canWrite ? (
            <button type="button" className="ml-save" onClick={save} disabled={saving || (!isNew && !dirty && !detailsChanged(track, details))}>
              {saving ? "Saving…" : isNew ? "Save new track" : "Save"}
            </button>
          ) : (
            <a className="ml-signin-hint" href="/login">Sign in to save</a>
          ))}
        </div>
      </header>

      {status && <p className="ml-status">{status}</p>}
      {error && <p className="ml-error" role="alert">{error}</p>}
      {saveMessage && <p className="ml-status">{saveMessage}</p>}
      {dirtyWhilePlaying && (
        <p className="ml-status">Code changed - press Play again to hear your edits.</p>
      )}
      {dirty && writable && canWrite && !saveMessage && (
        <p className="ml-status">Unsaved changes. Play hears them; Save keeps them in the library.</p>
      )}

      {loading ? (
        <p className="ml-status">Loading the track…</p>
      ) : (
        <div className={`ml-editor-layout ${paneOpen ? "pane-open" : ""}`}>
          <section className="ml-editor-main">
            {writable && (
              <div className="ml-details ml-details-row">
                <label>
                  Name
                  <input
                    type="text" value={details.name} placeholder="Track name"
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  />
                </label>
                <label>
                  Description
                  <input
                    type="text" value={details.description} placeholder="What does it sound like?"
                    onChange={(e) => setDetails({ ...details, description: e.target.value })}
                  />
                </label>
                <label>
                  Category
                  <input
                    type="text" value={details.category} placeholder="Ambient, Action, …"
                    onChange={(e) => setDetails({ ...details, category: e.target.value })}
                  />
                </label>
              </div>
            )}
            <div className="ml-editor-head">
              <h3>The score</h3>
              <div className="ml-editor-actions">
                {(dirty || bundled) && (
                  <button type="button" className="ml-reset" onClick={resetCode}>
                    {bundled ? "Reset to original" : "Discard changes"}
                  </button>
                )}
                <button
                  type="button"
                  className="ml-palette-toggle"
                  aria-expanded={paneOpen}
                  onClick={() => setPaneOpen((v) => !v)}
                >
                  {paneOpen ? "Hide sounds" : "Available sounds"}
                </button>
              </div>
            </div>
            <CodeEditor
              key={trackId}
              value={code}
              onChange={updateCode}
              onRun={togglePlay}
              onReady={(view) => { editorViewRef.current = view; }}
              language={javascript()}
              label={`Score for ${title}`}
              className="ml-editor ml-editor-full"
            />
            <p className="ml-hint">
              {writable
                ? "Save keeps this version in the library. Ctrl/Cmd+Enter plays or stops."
                : "Your edits are saved in this browser only. Ctrl/Cmd+Enter plays or stops."}
            </p>
          </section>

          {paneOpen && (
            <aside className="ml-sound-pane ml-sound-palette" aria-label="Available sounds">
              <div className="ml-pane-head">
                <h3>Available sounds</h3>
                <button type="button" className="ml-palette-toggle" onClick={() => setPaneOpen(false)}>
                  Collapse
                </button>
              </div>
              <input
                type="search" className="ml-search" placeholder="Search sounds…"
                value={soundQuery} onChange={(e) => setSoundQuery(e.target.value)}
                aria-label="Search sounds"
              />
              {soundTypes.length > 1 && (
                <select
                  className="ml-category-filter ml-sound-type"
                  value={soundType} onChange={(e) => setSoundType(e.target.value)}
                  aria-label="Filter sounds by type"
                >
                  <option value="">All types</option>
                  {soundTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
              <p className="ml-hint">
                Each note also takes amp, pan, attack, dur, release, cutoff, res; notes as
                names ("C#3") or MIDI numbers.
              </p>
              {soundItems === null && <p className="ml-status">Loading sounds…</p>}
              <ul className="ml-sound-list">
                {visibleSounds.map((it) => (
                  <li key={`${it.origin ?? "builtin"}:${it.name}`}>
                    <span className="ml-sound-name">{it.name}</span>
                    <span className="ml-sound-blurb">
                      {it.type}{it.blurb ? ` · ${it.blurb}` : ""}{it.origin === "imported" ? " · imported" : ""}
                    </span>
                    <button
                      type="button" className="ml-sound-preview" disabled={booting}
                      aria-label={`Preview ${it.name}`} onClick={() => previewSound(it)}
                    >
                      {previewingSound === it.name ? "■" : "▶"}
                    </button>
                    <button type="button" className="ml-sound-insert" onClick={() => insertSound(it)}>
                      Insert
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      )}
    </main>
  );
}

function detailsChanged(track, details) {
  if (!track) return false;
  return (
    details.name.trim() !== (track.name ?? "") ||
    details.description.trim() !== (track.description ?? "") ||
    details.category.trim() !== (track.category ?? "")
  );
}
