import { useEffect, useMemo, useRef, useState } from "react";
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

// Swipe gestures on the Inbox deck: up = 3 stars, down = 1 star, left or right = 2 stars.
const RATING_FOR_DIRECTION = { up: 3, down: 1, left: 2, right: 2 };
const KEY_DIRECTIONS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
const SWIPE_THRESHOLD = 60;

function directionFor(dx, dy) {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return null;
  if (Math.abs(dy) >= Math.abs(dx)) return dy < 0 ? "up" : "down";
  return dx < 0 ? "left" : "right";
}

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
          <button className="idea-detail-back" onClick={onClose} aria-label="Back to the idea cards">&larr; Back</button>
          <div className="idea-card-domains">
            {idea.domains.map((tag) => <span className="domain-tag" key={tag}>{tag}</span>)}
          </div>
          <h2>{idea.name}</h2>
          <p className="idea-detail-tagline">{idea.tagline}</p>
          {idea.pitch ? <p className="idea-detail-pitch">{idea.pitch}</p> : null}
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

// The Inbox deck: one pitch card at a time. Swipe (or use the buttons / arrow keys)
// to rate: up = 3 stars, left or right = 2 stars, down = 1 star. A rated idea leaves
// the Inbox, so the deck advances on its own.
function SwipeDeck({ list, ratingOf, pending, onRate, onOpen }) {
  const [drag, setDrag] = useState(null);
  const origin = useRef(null);
  const idea = list[0];
  const busy = !!pending[idea.slug];
  const d = drag || { x: 0, y: 0 };
  const active = directionFor(d.x, d.y);

  function beginDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button")) return; // let the Details button receive its click
    origin.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function moveDrag(event) {
    if (!origin.current) return;
    setDrag({ x: event.clientX - origin.current.x, y: event.clientY - origin.current.y });
  }
  function endDrag(event) {
    if (!origin.current) return;
    const dx = event.clientX - origin.current.x;
    const dy = event.clientY - origin.current.y;
    origin.current = null;
    setDrag(null);
    const dir = directionFor(dx, dy);
    if (dir && !busy) onRate(idea, RATING_FOR_DIRECTION[dir]);
  }
  function rateDirection(dir) {
    if (!busy) onRate(idea, RATING_FOR_DIRECTION[dir]);
  }

  return (
    <section
      className="swipe-deck"
      aria-label="Swipe through Inbox ideas"
      tabIndex={0}
      onKeyDown={(event) => {
        const dir = KEY_DIRECTIONS[event.key];
        if (dir) {
          event.preventDefault();
          rateDirection(dir);
        }
      }}
    >
      <p className="swipe-progress">{list.length} idea{list.length === 1 ? "" : "s"} left in the Inbox</p>
      <div className="swipe-stage">
        <span className={`swipe-hint swipe-hint-top${active === "up" ? " swipe-hint-active" : ""}`} aria-hidden="true">&uarr; 3 stars</span>
        <span className={`swipe-hint swipe-hint-left${active === "left" ? " swipe-hint-active" : ""}`} aria-hidden="true">&larr; 2 stars</span>
        <span className={`swipe-hint swipe-hint-right${active === "right" ? " swipe-hint-active" : ""}`} aria-hidden="true">2 stars &rarr;</span>
        <span className={`swipe-hint swipe-hint-bottom${active === "down" ? " swipe-hint-active" : ""}`} aria-hidden="true">&darr; 1 star</span>
        <div
          className={`swipe-card${drag ? " swipe-card-dragging" : ""}`}
          style={{ transform: `translate(${d.x}px, ${d.y}px) rotate(${d.x / 18}deg)` }}
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="group"
          aria-label={`Idea card: ${idea.name}`}
        >
          <span className="idea-card-domains">
            {idea.domains.map((tag) => <span className="domain-tag" key={tag}>{tag}</span>)}
          </span>
          <h2 className="swipe-card-name">{idea.name}</h2>
          <p className="swipe-card-tagline">{idea.tagline}</p>
          <p className="swipe-card-pitch">{idea.pitch}</p>
          <button type="button" className="swipe-detail-button" onClick={() => onOpen(idea)}>
            Details
          </button>
        </div>
      </div>
      <div className="swipe-actions" role="group" aria-label="Rate this idea">
        <button type="button" className="swipe-action" disabled={busy} aria-label="Swipe down: 1 star" onClick={() => rateDirection("down")}>&darr; 1</button>
        <button type="button" className="swipe-action" disabled={busy} aria-label="Swipe left: 2 stars" onClick={() => rateDirection("left")}>&larr; 2</button>
        <button type="button" className="swipe-action" disabled={busy} aria-label="Swipe right: 2 stars" onClick={() => rateDirection("right")}>2 &rarr;</button>
        <button type="button" className="swipe-action" disabled={busy} aria-label="Swipe up: 3 stars" onClick={() => rateDirection("up")}>&uarr; 3</button>
      </div>
    </section>
  );
}

export default function AppIdeas({ onHome }) {
  const [query, setQuery] = useState("");
  const [activeDomains, setActiveDomains] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("inbox");
  const [inboxMode, setInboxMode] = useState("swipe");
  // Current GitHub ratings, then optimistic page-local updates. No browser storage.
  const [votes, setVotes] = useState({});
  const [pending, setPending] = useState({});
  const [voteError, setVoteError] = useState("");

  const [ratingsLoaded, setRatingsLoaded] = useState(false);
  const [ratingsError, setRatingsError] = useState("");
  const [reloadRatings, setReloadRatings] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let active = true;
    setRatingsError("");
    fetch("/api/app-ideas/ratings", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
        if (!data.ratings || typeof data.ratings !== "object" || Array.isArray(data.ratings)) {
          throw new Error("Invalid ratings response");
        }
        if (active) {
          setVotes(data.ratings);
          setRatingsLoaded(true);
        }
      })
      .catch((error) => {
        if (active) setRatingsError(`Could not load current ratings: ${error.message}`);
      })
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [reloadRatings]);

  const currentIdeas = useMemo(() => ideas.map((idea) => ({
    ...idea, rating: idea.slug in votes ? votes[idea.slug] || 0 : 0,
  })), [votes]);

  const ratingOf = (idea) => (idea.slug in votes ? votes[idea.slug] || 0 : 0);

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
    for (const idea of currentIdeas) result[viewOf(idea.rating)] += 1;
    return result;
  }, [currentIdeas]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inView = currentIdeas.filter((idea) => viewOf(idea.rating) === view);
    return sortForView(inView, view).filter((idea) => {
      if (activeDomains.length && !activeDomains.every((tag) => idea.domains.includes(tag))) return false;
      if (!q) return true;
      const haystack = `${idea.name} ${idea.tagline} ${idea.pitch} ${idea.body}`.toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [query, activeDomains, view, currentIdeas]);

  const showDeck = view === "inbox" && inboxMode === "swipe" && filtered.length > 0;

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
        <p>{ideas.length} ideas so far. Swipe through the Inbox: up for 3 stars, left or right for 2, down for 1. 2-3 stars are Promising, 1 star goes to the Archive.</p>
      </section>

      <nav className="view-tabs" aria-label="Idea views">
        {VIEWS.map((name) => (
          <button
            key={name}
            className={`view-tab${view === name ? " view-tab-active" : ""}`}
            aria-pressed={view === name}
            onClick={() => setView(name)}
          >
            {VIEW_LABELS[name]} <span className="view-tab-count">{ratingsLoaded ? counts[name] : "..."}</span>
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
        {view === "inbox" && (
          <div className="inbox-mode" role="group" aria-label="Inbox display">
            <button
              className={`inbox-mode-button${inboxMode === "swipe" ? " inbox-mode-active" : ""}`}
              aria-pressed={inboxMode === "swipe"}
              onClick={() => setInboxMode("swipe")}
            >
              Swipe
            </button>
            <button
              className={`inbox-mode-button${inboxMode === "list" ? " inbox-mode-active" : ""}`}
              aria-pressed={inboxMode === "list"}
              onClick={() => setInboxMode("list")}
            >
              List
            </button>
          </div>
        )}
      </section>

      {!ratingsLoaded && <p role="status">{ratingsError || "Loading current ratings..."}
        {ratingsError && <> <button onClick={() => setReloadRatings((n) => n + 1)}>Retry</button></>}
      </p>}

      {ratingsLoaded && <>
      <p className="ideas-count" aria-live="polite">
        {filtered.length === counts[view] ? `${counts[view]} ideas` : `${filtered.length} of ${counts[view]} ideas`}
      </p>

      {showDeck ? (
        <SwipeDeck
          list={filtered}
          ratingOf={ratingOf}
          pending={pending}
          onRate={rate}
          onOpen={setSelected}
        />
      ) : (
      <section className="app-grid ideas-grid" aria-label="App ideas">
        {filtered.map((idea) => (
          <div className="app-card idea-card" key={idea.slug}>
            <button className="idea-card-open" onClick={() => setSelected(idea)}>
              <span className="idea-card-domains">
                {idea.domains.map((tag) => <span className="domain-tag" key={tag}>{tag}</span>)}
              </span>
              <span className="app-card-title">{idea.name}</span>
              <span className="app-card-description">{idea.pitch || idea.tagline}</span>
              <span className="idea-card-footer">
                <span className="idea-card-date">{formatCreated(idea)}</span>
                <span className="app-card-link">Read the spec <span aria-hidden="true">&rarr;</span></span>
              </span>
            </button>
            <StarRating idea={idea} rating={ratingOf(idea)} pending={!!pending[idea.slug]} onRate={rate} />
          </div>
        ))}
      </section>
      )}

      {filtered.length === 0 && (
        <p className="ideas-empty">{query || activeDomains.length ? "No idea matches. Try another word or remove a domain filter." : VIEW_EMPTY[view]}</p>
      )}

      </>}

      {selected && <IdeaDetail idea={selected} rating={ratingOf(selected)} pending={!!pending[selected.slug]} onRate={rate} onClose={() => setSelected(null)} />}
    </main>
  );
}
