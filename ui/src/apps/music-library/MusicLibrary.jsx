import { useEffect, useMemo, useRef, useState } from "react";
import { getEngine } from "./engine/supersonicEngine.js";
import { createPerformance } from "./engine/player.js";
import { tracks as bundledTracks } from "./tracks/index.js";
import Tutorial from "./Tutorial.jsx";
import { fetchCategories, fetchTrack, fetchTracks } from "./api.js";
import "./music-library.css";

const EDIT_BASE = "/apps/music-library/edit";

function bundledItem(t) {
  return {
    key: `bundled:${t.id}`,
    origin: "bundled",
    editId: `b-${t.id}`,
    name: t.title,
    description: t.description,
    mood: t.mood,
    code: t.code,
  };
}

function apiItem(t) {
  return {
    key: `api:${t.id}`,
    origin: "api",
    id: t.id,
    editId: String(t.id),
    name: t.name,
    description: t.description,
    category: t.category,
  };
}

function bundledCode(item) {
  try {
    return window.localStorage.getItem(`music-library:code:${item.key}`) ?? item.code;
  } catch {
    return item.code;
  }
}

export default function MusicLibrary({ onHome, onNavigate }) {
  const engine = useMemo(() => getEngine(), []);
  const performanceRef = useRef(null);
  if (!performanceRef.current) {
    performanceRef.current = createPerformance(engine, {
      onError: (message) => {
        performanceRef.current?.stop();
        setError(message);
        setPlayingKey("");
      },
      onEnd: () => setPlayingKey(""),
    });
    if (import.meta.env.DEV) window.__musicEngine = engine; // audio-check probe
  }

  const fallback = useMemo(() => bundledTracks.map(bundledItem), []);

  const [mode, setMode] = useState("library"); // "library" | "tutorial"
  const [source, setSource] = useState("api");
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [playingKey, setPlayingKey] = useState("");
  const [loadingKey, setLoadingKey] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0.9);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

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

  useEffect(() => () => performanceRef.current.stop(), []);

  async function togglePlay(item) {
    setError("");
    if (playingKey === item.key) {
      performanceRef.current.stop();
      setPlayingKey("");
      return;
    }
    performanceRef.current.stop();
    setPlayingKey("");
    setLoadingKey(item.key);
    try {
      const code = item.origin === "api" ? (await fetchTrack(item.id)).code : bundledCode(item);
      if (!engine.ready) {
        await engine.boot(setStatus);
        engine.setMasterVolume(volume);
      }
      setStatus("");
      if (performanceRef.current.start(code)) setPlayingKey(item.key);
    } catch (err) {
      setStatus("");
      setError(`Could not play ${item.name}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoadingKey("");
    }
  }

  function changeVolume(value) {
    setVolume(value);
    engine.setMasterVolume(value);
  }

  function go(event, path) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
    event.preventDefault();
    performanceRef.current.stop();
    onNavigate(path);
  }

  const totalPages = Math.max(1, Math.ceil(count / 20));

  function filterBlock() {
    return (
      <>
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
            className="ml-category-filter ml-category-select"
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
      </>
    );
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
            press play, open a track to read the score and change the code.</p>
        </div>
        <div className="ml-header-actions">
          <button
            type="button"
            className="ml-tutorial-toggle"
            onClick={() => {
              performanceRef.current.stop();
              setPlayingKey("");
              setMode(mode === "tutorial" ? "library" : "tutorial");
            }}
          >
            {mode === "tutorial" ? "Library" : "Tutorial"}
          </button>
          <a className="ml-sounds-link" href="/apps/music-library/sounds">Sounds</a>
        </div>
      </header>

      {mode === "tutorial" ? (
        <Tutorial onBack={() => setMode("library")} />
      ) : (
        <div className="ml-library-layout">
          {source === "api" && (
            <aside className="ml-sidebar" aria-label="Categories">
              <div className="ml-filters">{filterBlock()}</div>
              <ul className="ml-category-list">
                <li>
                  <button
                    type="button"
                    className={`ml-category-item ${category === "" ? "active" : ""}`}
                    onClick={() => { setCategory(""); setPage(1); }}
                  >
                    All tracks
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      className={`ml-category-item ${category === c.slug ? "active" : ""}`}
                      onClick={() => { setCategory(c.slug); setPage(1); }}
                    >
                      <span>{c.name}</span>
                      <span className="ml-category-count">{c.track_count}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <a
                className="ml-new-track"
                href={`${EDIT_BASE}/new`}
                onClick={(e) => go(e, `${EDIT_BASE}/new`)}
              >
                + New track
              </a>
            </aside>
          )}

          <section className="ml-tracks" aria-label="Library">
            {source === "bundled" && (
              <p className="ml-status">Library server unreachable - showing the built-in tracks.</p>
            )}
            {status && <p className="ml-status">{status}</p>}
            {error && <p className="ml-error" role="alert">{error}</p>}
            <label className="ml-volume">
              Volume
              <input
                type="range" min="0" max="1" step="0.05" value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
              />
            </label>
            {loadingList && <p className="ml-status">Loading the library…</p>}
            {!loadingList && items.length === 0 && (
              <p className="ml-status">No tracks match this search.</p>
            )}
            <ul className="ml-track-list">
              {items.map((t) => {
                const isPlaying = playingKey === t.key;
                return (
                  <li key={t.key} className={`ml-track ${isPlaying ? "active" : ""}`}>
                    <button
                      type="button"
                      className={`ml-row-play ${isPlaying ? "stop" : ""}`}
                      aria-label={`${isPlaying ? "Stop" : "Play"} ${t.name}`}
                      disabled={loadingKey === t.key}
                      onClick={() => togglePlay(t)}
                    >
                      {loadingKey === t.key ? "…" : isPlaying ? "■" : "▶"}
                    </button>
                    <span className="ml-track-text">
                      <span className="ml-track-title">{t.name}</span>
                      <span className="ml-track-mood">
                        {t.origin === "api" && t.category ? `${t.category} · ` : ""}
                        {t.mood ?? t.description}
                      </span>
                    </span>
                    <a
                      className="ml-edit-link"
                      href={`${EDIT_BASE}/${t.editId}`}
                      onClick={(e) => go(e, `${EDIT_BASE}/${t.editId}`)}
                    >
                      Edit
                    </a>
                  </li>
                );
              })}
            </ul>
            {source === "api" && totalPages > 1 && (
              <div className="ml-pagination">
                <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  ← Newer
                </button>
                <span>Page {page} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Older →
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
