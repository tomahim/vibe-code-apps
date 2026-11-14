import { useEffect, useMemo, useRef, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import CodeEditor from "../../components/CodeEditor.jsx";
import { getEngine, SYNTH_PALETTE } from "./engine/supersonicEngine.js";
import { createPerformance } from "./engine/player.js";
import { tracks as bundledTracks } from "./tracks/index.js";
import Tutorial from "./Tutorial.jsx";
import {
  createTrack,
  fetchCategories,
  fetchTrack,
  fetchTracks,
  signedIn,
  updateTrack,
} from "./api.js";
import "./music-library.css";

const storageKey = (trackId) => `music-library:code:${trackId}`;

const NEW_TRACK_TEMPLATE = `// Your new track. Press Play to hear it, then Save to keep it in the library.
m.play("prophet", { note: "C4", dur: 1 });
await m.sleep(1);
m.play("prophet", { note: "E4", dur: 1 });
await m.sleep(1);
m.play("prophet", { note: "G4", dur: 2 });
`;

function bundledItem(t) {
  return {
    key: `bundled:${t.id}`,
    origin: "bundled",
    name: t.title,
    description: t.description,
    mood: t.mood,
    synths: t.synths,
    minutes: t.minutes,
    code: t.code,
  };
}

function apiItem(t) {
  return {
    key: `api:${t.id}`,
    origin: "api",
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    categorySlug: t.category_slug,
  };
}

const DRAFT_KEY = "draft:new";

function loadCode(item) {
  if (item.origin === "api") return item.code ?? "";
  try {
    return window.localStorage.getItem(storageKey(item.key)) ?? item.code;
  } catch {
    return item.code;
  }
}

function saveCode(item, code) {
  if (item.origin === "api") return; // server is the source of truth
  try {
    window.localStorage.setItem(storageKey(item.key), code);
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

  const fallback = useMemo(() => bundledTracks.map(bundledItem), []);

  const [mode, setMode] = useState("library"); // "library" | "tutorial"
  const [source, setSource] = useState("api"); // "api" | "bundled" (fallback)
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [track, setTrack] = useState(null);
  const [codes, setCodes] = useState({});
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0.9);
  const [startedCode, setStartedCode] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [creating, setCreating] = useState(false);
  const [details, setDetails] = useState({ name: "", description: "", category: "" });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const code = track ? (codes[track.key] ?? "") : "";
  const dirtyWhilePlaying = playing && code !== startedCode;
  const canWrite = signedIn();

  // Debounce the search box.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Load the library list from the API; fall back to the bundled tracks when
  // the server is unreachable so the app never breaks.
  useEffect(() => {
    if (mode !== "library") return undefined;
    const controller = new AbortController();
    setLoadingList(true);
    fetchTracks({ q: debouncedQuery, category, page, signal: controller.signal })
      .then((data) => {
        setSource("api");
        setItems(data.results.map(apiItem));
        setCount(data.count);
        setLoadingList(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setSource("bundled");
        setItems(fallback);
        setCount(fallback.length);
        setLoadingList(false);
      });
    return () => controller.abort();
  }, [mode, debouncedQuery, category, page, fallback]);

  useEffect(() => {
    if (mode !== "library" || source !== "api") return undefined;
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then((data) => setCategories(data.categories))
      .catch(() => {});
    return () => controller.abort();
  }, [mode, source]);

  // Select the first track once the list arrives.
  useEffect(() => {
    if (!track && items.length > 0 && !creating) selectTrack(items[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => () => performanceRef.current.stop(), []);

  function selectTrack(next) {
    performanceRef.current.stop();
    setPlaying(false);
    setError("");
    setSaveMessage("");
    setCreating(false);
    setDetailsOpen(false);
    setTrack(next);
    if (next.origin === "api" && codes[next.key] === undefined) {
      setCodes((prev) => ({ ...prev, [next.key]: "" }));
      fetchTrack(next.id)
        .then((full) => setCodes((prev) => ({ ...prev, [next.key]: full.code })))
        .catch(() => setError("Could not load this track from the library."));
    }
    if (next.origin === "bundled" && codes[next.key] === undefined) {
      setCodes((prev) => ({ ...prev, [next.key]: loadCode(next) }));
    }
  }

  function updateCode(value) {
    if (!track) return;
    setCodes((prev) => ({ ...prev, [track.key]: value }));
    saveCode(track, value);
  }

  function resetCode() {
    if (!track) return;
    if (track.origin === "bundled") updateCode(track.code);
    else {
      fetchTrack(track.id)
        .then((full) => updateCode(full.code))
        .catch(() => setError("Could not reload the original code."));
    }
  }

  function startCreate() {
    performanceRef.current.stop();
    setPlaying(false);
    setError("");
    setSaveMessage("");
    setDetails({ name: "", description: "", category: "" });
    setDetailsOpen(true);
    setCreating(true);
    const draft = { key: DRAFT_KEY, origin: "draft", name: "New track", description: "" };
    setTrack(draft);
    setCodes((prev) => ({ ...prev, [DRAFT_KEY]: prev[DRAFT_KEY] ?? NEW_TRACK_TEMPLATE }));
  }

  async function saveToLibrary() {
    if (!track) return;
    setSaving(true);
    setSaveMessage("");
    setError("");
    try {
      if (creating) {
        const name = details.name.trim() || "Untitled track";
        const saved = await createTrack({
          name,
          description: details.description.trim(),
          category: details.category.trim(),
          code,
        });
        setCreating(false);
        setSaveMessage(`Saved "${saved.name}" to the library.`);
        setCodes((prev) => ({ ...prev, [`api:${saved.id}`]: saved.code }));
        setTrack(apiItem(saved));
        setPage(1);
        refreshList();
      } else if (track.origin === "api") {
        const payload = { code };
        if (detailsOpen) {
          payload.name = details.name.trim() || track.name;
          payload.description = details.description.trim();
          payload.category = details.category.trim();
        }
        const saved = await updateTrack(track.id, payload);
        setSaveMessage(`Saved "${saved.name}".`);
        setTrack(apiItem(saved));
        refreshList();
      }
    } catch (err) {
      setError(`Could not save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function refreshList() {
    const controller = new AbortController();
    fetchTracks({ q: debouncedQuery, category, page: 1, signal: controller.signal })
      .then((data) => {
        setItems(data.results.map(apiItem));
        setCount(data.count);
      })
      .catch(() => {});
    fetchCategories(controller.signal)
      .then((data) => setCategories(data.categories))
      .catch(() => {});
  }

  function openDetails() {
    if (!track) return;
    setDetails({
      name: creating ? details.name : track.name,
      description: creating ? details.description : track.description,
      category: creating ? details.category : (track.category ?? ""),
    });
    setDetailsOpen((v) => !v);
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

  const totalPages = Math.max(1, Math.ceil(count / 20));

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
        {source === "api" && (
          <div className="ml-filters">
            <input
              type="search"
              className="ml-search"
              placeholder="Search tracks…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label="Search tracks"
            />
            {categories.length > 0 && (
              <select
                className="ml-category-filter"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by category"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.track_count})
                  </option>
                ))}
              </select>
            )}
            <button type="button" className="ml-new-track" onClick={startCreate}>
              + New track
            </button>
          </div>
        )}
        {source === "bundled" && (
          <p className="ml-status">Library server unreachable - showing the built-in tracks.</p>
        )}
        {loadingList && <p className="ml-status">Loading the library…</p>}
        {!loadingList && items.length === 0 && (
          <p className="ml-status">No tracks match this search.</p>
        )}
        {items.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`ml-track ${track && t.key === track.key ? "active" : ""}`}
            onClick={() => selectTrack(t)}
          >
            <span className="ml-track-title">{t.name}</span>
            <span className="ml-track-mood">
              {t.origin === "api" && t.category ? `${t.category} · ` : ""}
              {t.mood ?? t.description}
            </span>
          </button>
        ))}
        {source === "api" && totalPages > 1 && (
          <div className="ml-pagination">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              ← Newer
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Older →
            </button>
          </div>
        )}
      </nav>

      {track && (
      <section className="ml-player">
        <div className="ml-player-head">
          <div>
            <h2>{creating ? (details.name.trim() || "New track") : track.name}</h2>
            {!creating && <p className="ml-description">{track.description}</p>}
            {track.synths && (
              <p className="ml-synths">Sounds: {track.synths.join(", ")} - {track.minutes}</p>
            )}
            {track.origin === "api" && track.category && (
              <p className="ml-synths">Category: {track.category}</p>
            )}
          </div>
          <button
            type="button"
            className={`ml-play ${playing ? "stop" : ""}`}
            onClick={togglePlay}
            disabled={booting || (track.origin === "api" && !code)}
          >
            {booting ? "Loading…" : playing ? "■ Stop" : "▶ Play"}
          </button>
        </div>

        {status && <p className="ml-status">{status}</p>}
        {error && <p className="ml-error" role="alert">{error}</p>}
        {saveMessage && <p className="ml-status">{saveMessage}</p>}
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
            {(creating || track.origin === "api") &&
              (canWrite ? (
                <>
                  <button type="button" className="ml-palette-toggle" onClick={openDetails}>
                    {detailsOpen ? "Hide details" : creating ? "Track details" : "Edit details"}
                  </button>
                  <button
                    type="button"
                    className="ml-save"
                    onClick={saveToLibrary}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : creating ? "Save new track" : "Save to library"}
                  </button>
                </>
              ) : (
                <a className="ml-signin-hint" href="/login">
                  Sign in to save
                </a>
              ))}
            {!creating && code !== (track.origin === "bundled" ? track.code : undefined) && track.origin === "bundled" && (
              <button type="button" className="ml-reset" onClick={resetCode}>
                Reset to original
              </button>
            )}
            {track.origin === "api" && (
              <button type="button" className="ml-reset" onClick={resetCode}>
                Reload original
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
        {detailsOpen && (creating || track.origin === "api") && (
          <div className="ml-details">
            <label>
              Name
              <input
                type="text"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                placeholder="Track name"
              />
            </label>
            <label>
              Description
              <input
                type="text"
                value={details.description}
                onChange={(e) => setDetails({ ...details, description: e.target.value })}
                placeholder="What does it sound like?"
              />
            </label>
            <label>
              Category
              <input
                type="text"
                value={details.category}
                onChange={(e) => setDetails({ ...details, category: e.target.value })}
                placeholder="Ambient, Action, …"
              />
            </label>
          </div>
        )}
        {paletteOpen && (
          <p className="ml-palette">
            {SYNTH_PALETTE.join(", ")} - each note also takes amp, pan, attack,
            dur, release, cutoff, res; notes as names ("C#3") or MIDI numbers.
          </p>
        )}
        <CodeEditor
          key={track.key}
          value={code}
          onChange={updateCode}
          onRun={togglePlay}
          language={javascript()}
          label={`Score for ${track.name}`}
          className="ml-editor"
        />
        <p className="ml-hint">
          {track.origin === "api" || creating
            ? "Press Save to keep this version in the library. Ctrl/Cmd+Enter re-plays."
            : "Your edits are saved in this browser only. Ctrl/Cmd+Enter re-plays."}
        </p>
      </section>
      )}
      </>
      )}
    </main>
  );
}
