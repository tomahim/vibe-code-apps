import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { BRAND_BADGE, BRAND_NAME } from "../../config/brand.js";
import { ideas, usedDomains } from "./ideas.js";
import { createdAt } from "./sort.js";
import "./app-ideas.css";

function formatCreated(idea) {
  const time = createdAt(idea);
  if (!time) return "";
  return new Date(time).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function IdeaDetail({ idea, onClose }) {
  const html = useMemo(
    () => DOMPurify.sanitize(marked.parse(idea.body)),
    [idea.body],
  );
  return (
    <div className="idea-detail-backdrop" onClick={onClose} role="presentation">
      <article
        className="idea-detail"
        role="dialog"
        aria-modal="true"
        aria-label={idea.name}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="idea-detail-header">
          <div className="idea-card-domains">
            {idea.domains.map((tag) => <span className="domain-tag" key={tag}>{tag}</span>)}
          </div>
          <h2>{idea.name}</h2>
          <p className="idea-detail-tagline">{idea.tagline}</p>
          <p className="idea-detail-meta">
            {formatCreated(idea)}
            {idea.issue ? <> &middot; from <a href={`https://github.com/tomahim/vibe-code-apps/issues/${idea.issue}`} target="_blank" rel="noreferrer">issue #{idea.issue}</a></> : null}
          </p>
          <button className="idea-detail-close" onClick={onClose} aria-label="Close idea">&times;</button>
        </header>
        <div className="idea-detail-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}

export default function AppIdeas({ onHome }) {
  const [query, setQuery] = useState("");
  const [activeDomains, setActiveDomains] = useState([]);
  const [selected, setSelected] = useState(null);

  function toggleDomain(tag) {
    setActiveDomains((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ideas.filter((idea) => {
      if (activeDomains.length && !activeDomains.every((tag) => idea.domains.includes(tag))) return false;
      if (!q) return true;
      const haystack = `${idea.name} ${idea.tagline} ${idea.body}`.toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [query, activeDomains]);

  return (
    <main className="ideas-page">
      <header className="site-header">
        <button className="brand brand-button" onClick={onHome} aria-label={`Back to ${BRAND_NAME}`}>
          <span className="brand-mark">{BRAND_BADGE}</span>
          <span>{BRAND_NAME}</span>
        </button>
        <button className="back-link" onClick={onHome}>&larr; All tools</button>
      </header>

      <section className="ideas-intro">
        <p className="eyebrow">THE IDEA GARDEN</p>
        <h1>App ideas, ready to build.</h1>
        <p>{ideas.length} ideas so far. Search them, filter by domain, open one to read the full spec.</p>
      </section>

      <section className="ideas-toolbar" aria-label="Search and filter ideas">
        <input
          className="ideas-search"
          type="search"
          placeholder="Search ideas&hellip;"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search ideas"
        />
        <div className="domain-chips" role="group" aria-label="Filter by domain">
          {usedDomains.map((tag) => (
            <button
              key={tag}
              className={`domain-chip${activeDomains.includes(tag) ? " domain-chip-active" : ""}`}
              onClick={() => toggleDomain(tag)}
              aria-pressed={activeDomains.includes(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <p className="ideas-count" aria-live="polite">
        {filtered.length === ideas.length ? `${ideas.length} ideas` : `${filtered.length} of ${ideas.length} ideas`}
      </p>

      <section className="app-grid ideas-grid" aria-label="App ideas">
        {filtered.map((idea) => (
          <button className="app-card idea-card" key={idea.slug} onClick={() => setSelected(idea)}>
            <span className="idea-card-domains">
              {idea.domains.map((tag) => <span className="domain-tag" key={tag}>{tag}</span>)}
            </span>
            <span className="app-card-title">{idea.name}</span>
            <span className="app-card-description">{idea.tagline}</span>
            <span className="idea-card-footer">
              <span className="idea-card-date">{formatCreated(idea)}</span>
              <span className="app-card-link">Read the spec <span aria-hidden="true">&rarr;</span></span>
            </span>
          </button>
        ))}
      </section>

      {filtered.length === 0 && (
        <p className="ideas-empty">No idea matches. Try another word or remove a domain filter.</p>
      )}

      {selected && <IdeaDetail idea={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
