import { useEffect, useRef, useState } from "react";
import { authFetch } from "../../auth.js";
import { DATABASE_URL, dateLabel, latestDate, safeLink, uniqueItems } from "./model.js";
import "./news.css";

export default function News({ onHome }) {
  const requestSequence = useRef(0);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [pages, setPages] = useState([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [saving, setSaving] = useState(null);
  const [fetched, setFetched] = useState(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState("");
  const [query, setQuery] = useState("");
  const [archive, setArchive] = useState(false);

  async function load(nextCursor = null, view = archive) {
    const sequence = ++requestSequence.current;
    setPending(true);
    setError(null);
    setItems([]);
    try {
      const response = await authFetch(`/api/apps/news/?view=${view ? "archive" : "inbox"}${nextCursor ? `&cursor=${encodeURIComponent(nextCursor)}` : ""}&topic=${encodeURIComponent(topic)}&q=${encodeURIComponent(query)}`);
      const data = await response.json().catch(() => ({}));
      if (sequence !== requestSequence.current) return;
      if (!response.ok) throw { status: response.status, message: data.error || "Could not load the briefing. Try again." };
      if (!Array.isArray(data.items)) throw new Error("Unexpected feed response. Try again.");
      setItems(uniqueItems(data.items));
      setCursor(data.next_cursor || null);
      setFetched(data.fetched_at);
    } catch (err) {
      if (sequence !== requestSequence.current) return;
      setError({ status: err.status, message: err.message || "Connection failed. Try again." });
    } finally { if (sequence === requestSequence.current) setPending(false); }
  }

  useEffect(() => {
    const timer = setTimeout(() => { setPages([null]); setPageIndex(0); load(); }, 250);
    return () => clearTimeout(timer);
  }, [topic, query, archive]);
  function switchView(view) {
    setArchive(view); setPages([null]); setPageIndex(0); setItems([]);

  }
  function refresh() { setPages([null]); setPageIndex(0); load(); }
  function changePage(index) {
    const nextPages = index > pageIndex ? [...pages.slice(0, index), cursor] : pages;
    setPages(nextPages); setPageIndex(index); load(nextPages[index]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function archiveStory(item) {
    setSaving(item.id); setError(null);
    try {
      const response = await authFetch(`/api/apps/news/${item.id}/archive/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archived: !archive }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not save reading state.");
      // Changing membership invalidates pagination offsets. Return to page one.
      setPages([null]); setPageIndex(0); await load();
    } catch (err) { setError({ message: err.message }); }
    finally { setSaving(null); }
  }
  const topics = ["AI", "LLMs", "Coding agents", "Open source", "Security", "Tech industry", "Science"];
  const selected = items;
  const latest = latestDate(items);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());


  return (
    <main className="news-reader">
      <div className="news-shell">
        <nav className="news-top" aria-label="News navigation">
          <button onClick={onHome}>← All tools</button>
          <a href={DATABASE_URL} target="_blank" rel="noopener noreferrer">Open in Notion ↗</a>
        </nav>
        <header className="news-masthead">
          <p className="news-kicker">A SMALL WINDOW ON WHAT'S NEXT</p>
          <h1>Daily <em>Five.</em></h1>
          <p>AI, open source, technology & the occasional scientific wonder.</p>
          <div className="news-edition">
            <span>{latest ? `Newest saved · ${dateLabel(latest)}` : "Your personal briefing"}</span>
            <span>Content & archive in Notion</span>
          </div>
        </header>
        <div className="news-controls">
          <div className="news-tabs" aria-label="Edition selection">
            <button disabled={saving !== null} aria-pressed={!archive} onClick={() => switchView(false)}>Inbox</button>
            <button disabled={saving !== null} aria-pressed={archive} onClick={() => switchView(true)}>Archived</button>
          </div>
          <button className="news-refresh" onClick={refresh} disabled={pending}>{pending ? "Reading Notion..." : "↻ Refresh"}</button>
        </div>
        {!error && <>
          <label className="news-search">Search this list
            <input type="search" placeholder="A model, an idea, a source..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="news-topics" aria-label="Filter by topic">
            <button aria-pressed={!topic} onClick={() => setTopic("")}>All topics</button>
            {topics.map((tag) => <button key={tag} aria-pressed={topic === tag} onClick={() => setTopic(tag)}>{tag}</button>)}
          </div>
          {latest && latest < today && <p className="news-freshness">The newest story on this page was saved before today. New stories appear after they are added to Notion.</p>}
        </>}
        {error && <section className="news-notice" role="alert">
          <h2>{error.status === 401 ? "Your briefing is private." : error.status === 403 ? "An invitation-only reading room." : "The newsroom is unavailable."}</h2>
          <p>{error.message}</p>
          {error.status === 401 ? <a href="/login?next=%2Fapps%2Fnews">Sign in to read →</a> : <button onClick={refresh} disabled={pending}>Try again</button>}
          {error.status === 503 && <p className="news-caption">The server needs a Notion connection with Read content and Update content, shared with the news database. No token belongs in this browser.</p>}
        </section>}
        {pending && !items.length && <p className="news-status" role="status">Opening the reading room...</p>}
        {!pending && !error && !selected.length && <section className="news-notice"><h2>{items.length ? "No stories match." : "A fresh page."}</h2><p>{items.length ? "Try another topic or search." : archive ? "No archived stories on this page. Archive stories from your inbox to save them here." : "No unarchived news on this page. Your saved stories are in Archived."}</p></section>}
        {items.length > 0 && <p className="news-count" role="status">{selected.length} {selected.length === 1 ? "story" : "stories"}{archive ? " on this archived page" : " on this inbox page"}</p>}
        <section className="news-day" aria-label={archive ? "Archived news" : "Inbox news"}>
          <div className="news-stories">{selected.map((item, index) => <article className="news-story" key={item.id}>
            <div className="news-story-top"><span className="news-number">{String(index + 1).padStart(2, "0")}</span><span>{item.source}</span></div>
            <div className="news-story-tags">{item.topics.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <h2>{safeLink(item.url) ? <a href={safeLink(item.url)} target="_blank" rel="noopener noreferrer">{item.title} <span aria-hidden="true">↗</span></a> : item.title}</h2>
            <p className="news-byline">{item.author} · Published {dateLabel(item.published)}<br />Saved {dateLabel(item.added)}</p>
            {item.why_it_matters && <p className="news-why">{item.why_it_matters}</p>}
            <aside className="news-claim"><span>Source note</span><p>{item.claim_status}</p></aside>
            <button className="news-archive-action" onClick={() => archiveStory(item)} disabled={saving !== null || pending}>{saving === item.id ? "Saving..." : archive ? "↩ Move to inbox" : "✓ Archive"}</button>
            <div className="news-story-links">{safeLink(item.url) && <a href={safeLink(item.url)} target="_blank" rel="noopener noreferrer">Read the source ↗</a>}{safeLink(item.notion_url) && <a href={safeLink(item.notion_url)} target="_blank" rel="noopener noreferrer">Notion record ↗</a>}</div>
          </article>)}</div>
        </section>
        <nav className="news-pagination" aria-label={archive ? "Archived news pages" : "Inbox pages"}>
          <button onClick={() => changePage(pageIndex - 1)} disabled={pending || pageIndex === 0}>← Previous</button>
          <span>Page {pageIndex + 1} · Newest first</span>
          <button onClick={() => changePage(pageIndex + 1)} disabled={pending || !cursor}>Next →</button>
        </nav>
        <p className="news-page-note">Up to 20 stories per page. Search and topic filters cover this entire list. {cursor ? "More stories are available on the next page." : "You have reached the end of this list."}</p>
        <footer className="news-footer"><span>Five stories. Room to think.</span><span>{fetched ? `Read from Notion ${new Intl.DateTimeFormat("en-GB", { timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date(fetched))} Paris time · cache up to 2 min` : "Notion is the source of truth."}</span></footer>
      </div>
    </main>
  );
}
