import { useEffect, useState } from "react";
import { BRAND_BADGE, BRAND_NAME } from "../config/brand.js";
import collectionArtwork from "../assets/genious-apps.png";
import { createCatalog, filterArtifacts } from "./artifact-catalog.js";
import "./artifacts.css";

const artifacts = createCatalog(
  import.meta.glob("../artifacts/*.html", { query: "?raw", import: "default" }),
  import.meta.glob("../artifacts/*.json", { eager: true, import: "default" }),
);
const months = [...new Set(artifacts.map((artifact) => artifact.date?.slice(0, 7)).filter(Boolean))].sort().reverse();
const dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatDate = (date) => date ? dateFormat.format(new Date(`${date}T00:00:00Z`)) : "Undated";
const monthFormat = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" });
const formatMonth = (month) => monthFormat.format(new Date(`${month}-01T00:00:00Z`));

function ArtifactViewer({ artifact }) {
  const [source, setSource] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    artifact.load().then((html) => { if (active) setSource(html); }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [artifact]);

  return <main className="artifact-viewer">
    <header className="artifact-viewer-bar">
      <a href="/artifacts">← All artifacts</a>
      <h1>{artifact.title}</h1>
      <span>DESIGN EXPERIMENT</span>
    </header>
    {failed ? <div className="artifact-empty" role="alert"><h2>Couldn’t open this experiment.</h2><p>Refresh the page to try again.</p></div>
      : source ? <iframe title={artifact.title} srcDoc={source} sandbox="allow-scripts" />
        : <p className="artifact-empty" role="status">Opening experiment…</p>}
  </main>;
}

export default function Artifacts({ path }) {
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("");
  const [order, setOrder] = useState("oldest");
  const slug = path.replace(/^\/artifacts\/?/, "").replace(/\/$/, "");
  const artifact = artifacts.find((entry) => encodeURIComponent(entry.slug) === slug);
  const results = filterArtifacts(artifacts, { query, month, order });

  function reset() { setQuery(""); setMonth(""); setOrder("oldest"); }

  if (slug && artifact) return <ArtifactViewer key={artifact.slug} artifact={artifact} />;

  return <main className="artifacts-page">
    <header className="site-header">
      <a className="brand" href="/" aria-label={`${BRAND_NAME} home`}><span className="brand-mark">{BRAND_BADGE}</span><span>{BRAND_NAME}</span></a>
      <a className="back-link" href="/">← Back to the tools</a>
    </header>
    {slug ? <section className="artifact-empty"><p className="eyebrow">NOT IN THE COLLECTION</p><h1>Artifact not found.</h1><p>This experiment may have moved or been removed.</p><a href="/artifacts">Browse all artifacts →</a></section> : <>
      <section className="artifacts-intro">
        <div><p className="eyebrow">THE EXPERIMENT SHELF / {String(artifacts.length).padStart(2, "0")} COLLECTED</p><h1>Artifacts<span>.</span></h1><p>A place for playful interfaces, visual studies, and ideas worth trying. Small web experiments, collected along the way.</p></div>
        <img className="collection-artwork" src={collectionArtwork} alt="Genious Apps — colorful orbital shapes and ideas in motion" width="200" height="200" />
      </section>
      <section className="artifact-controls" aria-label="Search and filter artifacts">
        <label className="artifact-search"><span>Search the collection</span><input type="search" placeholder="Search titles, descriptions…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label><span>Added</span><select value={month} onChange={(event) => setMonth(event.target.value)}><option value="">All months</option>{months.map((value) => <option key={value} value={value}>{formatMonth(value)}</option>)}</select></label>
        <label><span>Sort by</span><select value={order} onChange={(event) => setOrder(event.target.value)}><option value="oldest">Earliest first</option><option value="newest">Newest first</option></select></label>
      </section>
      <div className="artifact-results-heading"><p role="status">{results.length} {results.length === 1 ? "experiment" : "experiments"}{query || month ? ` of ${artifacts.length}` : " in the collection"}</p><span>{order === "newest" ? "LATEST → EARLIEST" : "EARLIEST → LATEST"}</span></div>
      <ol className="artifact-list" aria-label="Artifacts">
        {results.map((entry, index) => <li key={entry.slug}>
          <span className="artifact-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div className="artifact-entry">
            <div className="artifact-entry-heading"><h2><a href={`/artifacts/${encodeURIComponent(entry.slug)}`}>{entry.title}<span aria-hidden="true">↗</span></a></h2><time dateTime={entry.date || undefined}>{formatDate(entry.date)}</time></div>
            <p>{entry.description}</p>
          </div>
        </li>)}
      </ol>
      {!results.length && <section className="artifact-empty"><h2>{artifacts.length ? "No experiments found." : "Room for the first experiment."}</h2><p>{artifacts.length ? "Try a different search or clear your filters." : "New ideas will find their way here."}</p>{artifacts.length > 0 && <button onClick={reset}>Clear filters</button>}</section>}
      <footer className="site-footer artifacts-footer"><span>An ongoing collection. Always room for another idea.</span><span>MADE TO EXPLORE ↗</span></footer>
    </>}
  </main>;
}
