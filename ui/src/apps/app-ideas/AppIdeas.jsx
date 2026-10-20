import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { BRAND_BADGE, BRAND_NAME } from "../../config/brand.js";
import { ideas, usedDomains } from "./ideas.js";
import { createdAt } from "./sort.js";
import { VIEWS, sortForView, viewOf } from "./rating.js";
import "./app-ideas.css";

function formatCreated(idea) {
  const time = createdAt(idea);
  if (!time) return "";
  return new Date(time).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const VIEW_LABELS = { inbox: "Inbox", promising: "Promising", archive: "Archive" };
const VIEW_EMPTY = {
  inbox: "Inbox zero. Every idea has a vote.",
  promising: "Nothing promising yet. Give an idea 2 or 3 stars.",
  archive: "Nothing archived. 1 star sends an idea here.",
};

function StarRating({ idea, rating, pending, onRate }) {
  return (
    <span className="star-rating" role="group" aria-label={`Rate ${idea.name}`}>
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-button${n <= rating ? " star-button-on" : ""}`}
          disabled={pending}
          aria-pressed={n === rating}
          aria-label={n === rating ? `${n} star${n > 1 ? "s" : ""}, tap to clear` : `${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onRate(idea, n === rating ? null : n)}
        >
          {n <= rating ? "\u2605" : "\u2606"}
        </button>
      ))}
      {rating > 0 && (
        <button
          type="button"
          className="star-reset"
          aria-label="Clear rating, back to Inbox"
          title="Clear rating"
          disabled={pending}
          onClick={() => onRate(idea, null)}
        >
          &times;
        </button>
      )}
    </span>
  );
}

function IdeaDetail({ idea, rating, pending, onRate, onClose }) {
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
          <StarRating idea={idea} rating={rating} pending={pending} onRate={onRate} />
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
  const [view, setView] = useState("inbox");
  // Votes made in this page, held in memory only until the redeployed bundle has them.
  const [votes, setVotes] = useState({});
  const [pending, setPending] = useState({});
  const [voteError, setVoteError] = useState("");

  const ratingOf = (idea) => (idea.slug in votes ? votes[idea.slug] || 0 : idea.rating);

  async function rate(idea, rating) {
    const previous = idea.slug in votes ? votes[idea.slug] : idea.rating;
    setVoteError("");
    setPending((p) => ({ ...p, [idea.slug]: true }));
    setVotes((v) => ({ ...v, [idea.slug]: rating }));
    try {
      const response = await fetch(`/api/app-ideas/${encodeURIComponent(idea.slug)}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      setVotes((v) => ({ ...v, [idea.slug]: previous }));
      setVoteError(`Vote failed for "${idea.name}": ${error.message}`);
    } finally {
      setPending((p) => ({ ...p, [idea.slug]: false }));
    }
  }

  function toggleDomain(tag) {
    setActiveDomains((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  const counts = useMemo(() => {
    const result = { inbox: 0, promising: 0, archive: 0 };
    for (const idea of ideas) result[viewOf(idea.slug in votes ? votes[idea.slug] : idea.rating)] += 1;
    return result;
  }, [votes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inView = ideas.filter((idea) => viewOf(idea.slug in votes ? votes[idea.slug] : idea.rating) === view);
    return sortForView(inView, view).filter((idea) => {
      if (activeDomains.length && !activeDomains.every((tag) => idea.domains.includes(tag))) return false;
      if (!q) return true;
      const haystack = `${idea.name} ${idea.tagline} ${idea.body}`.toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [query, activeDomains, view, votes]);

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
        <p>{ideas.length} ideas so far. Give each 1 to 3 stars: unvoted ideas wait in the Inbox, 2-3 stars are Promising, 1 star goes to the Archive.</p>
      </section>

      <nav className="view-tabs" aria-label="Idea views">
        {VIEWS.map((name) => (
          <button
            key={name}
            className={`view-tab${view === name ? " view-tab-active" : ""}`}
            aria-pressed={view === name}
            onClick={() => setView(name)}
          >
            {VIEW_LABELS[name]} <span className="view-tab-count">{counts[name]}</span>
          </button>
        ))}
      </nav>

      {voteError && (
        <p className="vote-error" role="alert">
          {voteError} <button className="vote-error-close" onClick={() => setVoteError("")} aria-label="Dismiss">&times;</button>
        </p>
      )}

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
        {filtered.length === counts[view] ? `${counts[view]} ideas` : `${filtered.length} of ${counts[view]} ideas`}
      </p>

      <section className="app-grid ideas-grid" aria-label="App ideas">
        {filtered.map((idea) => (
          <div className="app-card idea-card" key={idea.slug}>
            <button className="idea-card-open" onClick={() => setSelected(idea)}>
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
            <StarRating idea={idea} rating={ratingOf(idea)} pending={!!pending[idea.slug]} onRate={rate} />
          </div>
        ))}
      </section>

      {filtered.length === 0 && (
        <p className="ideas-empty">{query || activeDomains.length ? "No idea matches. Try another word or remove a domain filter." : VIEW_EMPTY[view]}</p>
      )}

      {selected && <IdeaDetail idea={selected} rating={ratingOf(selected)} pending={!!pending[selected.slug]} onRate={rate} onClose={() => setSelected(null)} />}
    </main>
  );
}
