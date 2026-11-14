import { useEffect, useMemo, useRef, useState } from "react";
import { getEngine, SYNTH_PALETTE } from "./engine/supersonicEngine.js";
import { SOUND_CATALOG, SOUND_TYPES } from "./soundCatalog.js";
import { authFetch, getToken } from "../../auth.js";
import "./music-library.css";

const API = "/api/apps/instruments/instruments/";
const MAX_DEF_BYTES = 512 * 1024;
const PREVIEW_MS = 2500;

function fallbackItems() {
  return SOUND_CATALOG.map((s) => ({
    name: s.name,
    type: s.type,
    blurb: s.blurb,
    origin: "builtin",
    ready: SYNTH_PALETTE.includes(s.name),
    definition_url: null,
  }));
}

export default function InstrumentBrowser({ onHome }) {
  const engine = useMemo(() => getEngine(), []);
  if (import.meta.env.DEV) window.__musicEngine = engine; // audio-check probe
  const [items, setItems] = useState([]);
  const [apiMode, setApiMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [booting, setBooting] = useState(false);
  const [previewing, setPreviewing] = useState(null); // instrument name being previewed
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // Add-instrument flow
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [license, setLicense] = useState("");
  const [detected, setDetected] = useState(null); // { name } after engine load
  const [importing, setImporting] = useState(false);
  const previewTimer = useRef(null);
  const previewNode = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setItems(data.instruments);
        setApiMode(true);
        setLoading(false);
      })
      .catch(() => {
        setItems(fallbackItems());
        setApiMode(false);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => () => stopPreview(), []);

  async function ensureBooted() {
    if (engine.ready) return;
    setBooting(true);
    try {
      await engine.boot(() => {});
    } finally {
      setBooting(false);
    }
  }

  // A loaded definition can still fail to instantiate (unsupported unit
  // generators fail server-side without a JS error) - probe the node tree.
  function verifyInstantiation(rawName) {
    setTimeout(() => {
      const tree = engine.supersonic?.getRawTree?.();
      const sounding = tree?.nodes?.some((n) => !n.isGroup && n.defName === rawName);
      if (!sounding) {
        setError(`"${rawName}" loaded but produced no sound - it may use unit generators the browser engine does not support.`);
      }
    }, 600);
  }

  function stopPreview() {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = null;
    if (previewNode.current != null) {
      engine.freeNode(previewNode.current);
      previewNode.current = null;
    }
    setPreviewing(null);
  }

  function armPreview(id, name) {
    stopPreview();
    previewNode.current = id;
    setPreviewing(name);
    // Bound every preview in time even if the definition never releases.
    previewTimer.current = setTimeout(() => stopPreview(), PREVIEW_MS);
  }

  async function previewBuiltin(item) {
    setError("");
    try {
      await ensureBooted();
      await engine.ensureSynth(item.name);
      armPreview(engine.preview(item.name), item.name);
    } catch (err) {
      setError(`Could not preview ${item.name}: ${err.message}`);
    }
  }

  async function previewImported(item) {
    setError("");
    try {
      await ensureBooted();
      const response = await fetch(item.definition_url);
      if (!response.ok) throw new Error(`could not fetch the definition (${response.status})`);
      const bytes = await response.arrayBuffer();
      const realName = await engine.importSynth(bytes);
      armPreview(engine.preview(realName, { raw: true }), item.name);
      verifyInstantiation(realName);
    } catch (err) {
      setError(`Could not preview ${item.name}: ${err.message}`);
    }
  }

  async function checkFile() {
    setError("");
    setNotice("");
    setDetected(null);
    if (!file) {
      setError("Choose a .scsyndef file first.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".scsyndef")) {
      setError("Only .scsyndef files are accepted.");
      return;
    }
    if (file.size > MAX_DEF_BYTES) {
      setError("That file is over 512 KB - too large for an instrument definition.");
      return;
    }
    try {
      const bytes = await file.arrayBuffer();
      const magic = new TextDecoder().decode(new Uint8Array(bytes.slice(0, 4)));
      if (magic !== "SCgf") {
        setError("That file is not a SuperCollider synthdef (missing the SCgf header).");
        return;
      }
      // Real compatibility check: the engine itself parses and loads it.
      await ensureBooted();
      const realName = await engine.importSynth(bytes);
      setDetected({ name: realName });
      setNotice(`The engine accepted it as "${realName}". Preview it, then save.`);
    } catch (err) {
      setError(`The engine could not load this instrument: ${err.message}`);
    }
  }

  async function saveImport() {
    if (!detected || !file) return;
    setImporting(true);
    setError("");
    try {
      const form = new FormData();
      form.append("definition", file);
      form.append("name", detected.name);
      form.append("type", "Imported");
      if (sourceUrl.trim()) form.append("source_url", sourceUrl.trim());
      if (license.trim()) form.append("license", license.trim());
      const response = await authFetch(API, { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `save failed (${response.status})`);
      setItems((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNotice(`Saved "${data.name}" to the shared library.`);
      setFile(null);
      setDetected(null);
      setSourceUrl("");
      setLicense("");
    } catch (err) {
      setError(`Could not save: ${err.message}`);
    } finally {
      setImporting(false);
    }
  }

  const visible = items.filter((i) => {
    if (typeFilter && i.type !== typeFilter) return false;
    if (query && !i.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const types = [...new Set(items.map((i) => i.type).filter(Boolean))].sort();
  const typeCounts = items.reduce((acc, i) => {
    if (i.type) acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="music-library">
      <header className="ml-header">
        <button type="button" className="ml-home" onClick={onHome} aria-label="Back">
          ←
        </button>
        <div>
          <h1>Instrument browser</h1>
          <p>The instruments available in this app's catalogue - the built-in set
            plus anything imported here. Preview any of them, or add a new one as a
            .scsyndef file.</p>
        </div>
      </header>

      <div className="ib-body">
        <nav className="ib-types" aria-label="Filter by type">
          <button
            type="button"
            className={typeFilter === "" ? "active" : ""}
            onClick={() => setTypeFilter("")}
          >
            All types <span className="ib-type-count">{items.length}</span>
          </button>
          {types.map((t) => (
            <button
              key={t}
              type="button"
              className={typeFilter === t ? "active" : ""}
              onClick={() => setTypeFilter(t)}
            >
              {t} <span className="ib-type-count">{typeCounts[t]}</span>
            </button>
          ))}
        </nav>
        <div className="ib-main">
      <div className="ml-filters">
        <input
          type="search"
          className="ml-search"
          placeholder="Search instruments…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search instruments"
        />
        <select
          className="ml-category-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {!apiMode && (
        <p className="ml-status">Library server unreachable - showing the built-in instruments only.</p>
      )}
      {loading && <p className="ml-status">Loading instruments…</p>}
      {error && <p className="ml-error" role="alert">{error}</p>}
      {notice && <p className="ml-status">{notice}</p>}
      {booting && <p className="ml-status">Starting the audio engine…</p>}

      <section className="ib-grid" aria-label="Instruments">
        {visible.map((item) => (
          <article key={item.name} className="ib-card">
            <div className="ib-info">
              <h3>{item.name}</h3>
              <p className="ib-blurb">
                <span className={`ib-badge ${item.origin === "imported" ? "imported" : item.ready ? "ready" : "ondemand"}`}>
                  {item.origin === "imported" ? "Imported" : item.ready ? "Ready" : "Loads on demand"}
                </span>
                {item.type}{item.blurb ? ` · ${item.blurb}` : ""}
              </p>
            </div>
            <div className="ib-actions">
              {previewing === item.name ? (
                <button type="button" className="ml-play stop" onClick={stopPreview} aria-label={`Stop previewing ${item.name}`} title="Stop">
                  ■
                </button>
              ) : (
                <button
                  type="button"
                  className="ml-play"
                  aria-label={`Preview ${item.name}`}
                  title="Preview"
                  disabled={booting || (item.origin === "imported" && !item.definition_url)}
                  onClick={() => (item.origin === "imported" ? previewImported(item) : previewBuiltin(item))}
                >
                  ▶
                </button>
              )}
            </div>
          </article>
        ))}
        {!loading && visible.length === 0 && <p className="ml-status">No instruments match.</p>}
      </section>

      <section className="ib-add">
        <h2>Add an instrument</h2>
        {!apiMode ? (
          <p className="ml-status">Adding instruments needs the library server.</p>
        ) : !getToken() ? (
          <p className="ml-status"><a className="ml-signin-hint" href="/login">Sign in</a> to add instruments.</p>
        ) : (
          <>
            <p className="ml-hint">
              A .scsyndef file (SuperCollider instrument definition). The file is
              checked, loaded into the engine for a bounded test preview, and only
              then saved to the shared library. Files from other projects need a
              compatible definition - not every synthdef works in the browser engine.
            </p>
            <div className="ml-details">
              <label>
                Instrument file
                <input
                  type="file"
                  accept=".scsyndef"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setDetected(null);
                    setNotice("");
                    setError("");
                  }}
                />
              </label>
              <label>
                Source URL (optional)
                <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://…" />
              </label>
              <label>
                License (optional)
                <input type="text" value={license} onChange={(e) => setLicense(e.target.value)}
                  placeholder="MIT, CC0, …" />
              </label>
            </div>
            <div className="ml-editor-actions">
              <button type="button" className="ml-palette-toggle" onClick={checkFile} disabled={!file || booting}>
                Check &amp; load
              </button>
              {detected && (
                <>
                  <button
                    type="button"
                    className="ml-play"
                    onClick={() => {
                      armPreview(engine.preview(detected.name, { raw: true }), detected.name);
                      verifyInstantiation(detected.name);
                    }}
                  >
                    ▶ Preview
                  </button>
                  <button type="button" className="ml-save" onClick={saveImport} disabled={importing}>
                    {importing ? "Saving…" : `Save "${detected.name}"`}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </section>
        </div>
      </div>
    </main>
  );
}
