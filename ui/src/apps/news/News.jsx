import { useEffect, useRef, useState } from "react";
import { authFetch } from "../../auth.js";
import { DATABASE_URL, dateLabel, latestDate, safeLink, uniqueItems } from "./model.js";
import "./news.css";

export default function News({ onHome }) {
  const requestSequence = useRef(0);
  // Session-only, bounded cache. Refresh always goes back to Notion.
  const feedCache = useRef(new Map());
  const cacheKey = (nextCursor = null, selectedView = view) => JSON.stringify([selectedView, topic, query, nextCursor]);
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
  const [view, setView] = useState("inbox");
  const archive = view === "archive";
  const categories = ["Inbox", "News", "Favorite", "Inspiration", "Archive"];

  async function load(nextCursor = null, selectedView = view, force = false) {
    const sequence = ++requestSequence.current;
    const key = cacheKey(nextCursor, selectedView);
    const cached = feedCache.current.get(key);
    setError(null);
    if (!force && cached && Date.now() - cached.savedAt < 120000) {
      setItems(cached.items); setCursor(cached.next_cursor); setFetched(cached.fetched_at);
      setPending(false);
      return;
    }
    setPending(true);
    setItems([]);
    try {
      const response = await authFetch(`/api/apps/news/?view=${selectedView}${nextCursor ? `&cursor=${encodeURIComponent(nextCursor)}` : ""}&topic=${encodeURIComponent(topic)}&q=${encodeURIComponent(query)}`);
      const data = await response.json().catch(() => ({}));
      if (sequence !== requestSequence.current) return;
      if (!response.ok) throw { status: response.status, message: data.error || "Could not load the briefing. Try again." };
      if (!Array.isArray(data.items)) throw new Error("Unexpected feed response. Try again.");
      data.items = uniqueItems(data.items);
      data.next_cursor = data.next_cursor || null;
      if (feedCache.current.size >= 40) feedCache.current.delete(feedCache.current.keys().next().value);
      feedCache.current.set(key, { ...data, savedAt: Date.now() });
      setItems(data.items);
      setCursor(data.next_cursor || null);
      setFetched(data.fetched_at);
    } catch (err) {
      if (sequence !== requestSequence.current) return;
      setError({ status: err.status, message: err.message || "Connection failed. Try again." });
    } finally { if (sequence === requestSequence.current) setPending(false); }
  }

  useEffect(() => {
    const cached = feedCache.current.get(cacheKey());
    if (cached && Date.now() - cached.savedAt < 120000) {
      setPages([null]); setPageIndex(0); load();
      return () => { ++requestSequence.current; };
    }
    setPending(true);
    const timer = setTimeout(() => { setPages([null]); setPageIndex(0); load(); }, 250);
    return () => { clearTimeout(timer); ++requestSequence.current; };
  }, [topic, query, view]);
  function switchView(nextView) {
    if (nextView === view) return;
    setView(nextView); setPages([null]); setPageIndex(0); setItems([]);

  }
  function refresh() { feedCache.current.clear(); setPages([null]); setPageIndex(0); load(null, view, true); }
  function changePage(index) {
    const nextPages = index > pageIndex ? [...pages.slice(0, index), cursor] : pages;
    setPages(nextPages); setPageIndex(index); load(nextPages[index]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function applySavedItem(item, changes) {
    const updated = { ...item, archived: archive, ...changes };
    const remains = Boolean(updated.archived) === archive && (archive || updated.category.toLowerCase() === view);
    const update = list => remains ? list.map(story => story.id === item.id ? updated : story) : list.filter(story => story.id !== item.id);
    setItems(update);
    // Opaque Notion cursors point after records, not numeric offsets. Keep the
    // current page/history and untouched cards; discard other snapshots so a
    // destination tab reads its new membership and ordering from Notion.
    const key = cacheKey(pages[pageIndex]);
    const current = feedCache.current.get(key);
    feedCache.current.clear();
    if (current) feedCache.current.set(key, { ...current, items: update(current.items) });
  }
  async function archiveStory(item) {
    setSaving(item.id); setError(null);
    try {
      const response = await authFetch(`/api/apps/news/${item.id}/archive/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archived: !archive }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not save reading state.");
      applySavedItem(item, { archived: !archive });
    } catch (err) { setError({ message: err.message }); }
    finally { setSaving(null); }
  }
  async function changeCategory(item, category) {
    setSaving(item.id); setError(null);
    try {
      const response = await authFetch(`/api/apps/news/${item.id}/category/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not save category.");
      applySavedItem(item, { category });
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
          <p className="news-kicker">GOOD LINKS DESERVE A HOME</p>
          <h1>Link <em>Keeper.</em></h1>
          <p>A reading room for discoveries, favorites and the next idea.</p>
          <div className="news-edition">
            <span>{latest ? `Newest saved · ${dateLabel(latest)}` : "Your personal link library"}</span>
            <span>Content, categories & archive in Notion</span>
          </div>
        </header>
        <div className="news-controls">
          <div className="news-tabs" aria-label="Library categories">
            {categories.map((name) => <button key={name} disabled={saving !== null} aria-pressed={view === name.toLowerCase()} onClick={() => switchView(name.toLowerCase())}>{name}</button>)}
          </div>
          <button className="news-refresh" onClick={refresh} disabled={pending || saving !== null}>{pending ? "Reading Notion..." : "↻ Refresh"}</button>
        </div>
        {!error && <>
          <label className="news-search">Search this list
            <input type="search" placeholder="A model, an idea, a source..." value={query} disabled={saving !== null} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="news-topics" aria-label="Filter by topic">
            <button aria-pressed={!topic} disabled={saving !== null} onClick={() => setTopic("")}>All topics</button>
            {topics.map((tag) => <button key={tag} aria-pressed={topic === tag} disabled={saving !== null} onClick={() => setTopic(tag)}>{tag}</button>)}
          </div>
          {latest && latest < today && <p className="news-freshness">The newest story on this page was saved before today. New stories appear after they are added to Notion.</p>}
        </>}
        {error && <section className="news-notice" role="alert">
          <h2>{error.status === 401 ? "Your library is private." : error.status === 403 ? "An invitation-only reading room." : "The library is unavailable."}</h2>
          <p>{error.message}</p>
          {error.status === 401 ? <a href="/login?next=%2Fapps%2Fnews">Sign in to read →</a> : <button onClick={refresh} disabled={pending || saving !== null}>Try again</button>}
          {error.status === 503 && <p className="news-caption">The server needs a Notion connection with Read content and Update content, shared with the news database. No token belongs in this browser.</p>}
        </section>}
        {pending && !items.length && <p className="news-status" role="status">Opening the reading room...</p>}
        {!pending && !error && !selected.length && <section className="news-notice"><h2>{items.length ? "No stories match." : "A fresh page."}</h2><p>{items.length ? "Try another topic or search." : archive ? "No archived links match. Archived links keep their category and can be restored." : "No links match this category and filters. Inspiration starts empty; RL links arrive in Inbox."}</p></section>}
        {items.length > 0 && <p className="news-count" role="status">{selected.length} {selected.length === 1 ? "story" : "stories"}{archive ? " on this archived page" : ` in ${view}`}</p>}
        <section className="news-day" aria-label={archive ? "Archived news" : "Inbox news"}>
          <div className="news-stories">{selected.map((item, index) => <article className="news-story" key={item.id}>
            <div className="news-story-top"><span className="news-number">{String(index + 1).padStart(2, "0")}</span><span>{item.source}</span>{archive && <span className="news-category-label">{item.category}</span>}</div>
            <div className="news-story-tags">{item.topics.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <h2>{safeLink(item.url) ? <a href={safeLink(item.url)} target="_blank" rel="noopener noreferrer">{item.title} <span aria-hidden="true">↗</span></a> : item.title}</h2>
            <p className="news-byline">{item.author} · Published {dateLabel(item.published)}<br />Saved {dateLabel(item.added)}</p>
            {item.why_it_matters && <p className="news-why">{item.why_it_matters}</p>}
            <aside className="news-claim"><span>Source note</span><p>{item.claim_status}</p></aside>
            <label className="news-category-control">Category
              <select aria-label={`Category for ${item.title}`} value={item.category || "News"} disabled={saving !== null || pending} onChange={(event) => changeCategory(item, event.target.value)}>
                {categories.filter((name) => name !== "Archive").map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <button className="news-archive-action" onClick={() => archiveStory(item)} disabled={saving !== null || pending}>{saving === item.id ? "Saving..." : archive ? "↩ Restore category" : "✓ Archive"}</button>
            <div className="news-story-links">{safeLink(item.url) && <a href={safeLink(item.url)} target="_blank" rel="noopener noreferrer">Read the source ↗</a>}{safeLink(item.notion_url) && <a href={safeLink(item.notion_url)} target="_blank" rel="noopener noreferrer">Notion record ↗</a>}</div>
          </article>)}</div>
        </section>
        <nav className="news-pagination" aria-label={archive ? "Archived news pages" : "Inbox pages"}>
          <button onClick={() => changePage(pageIndex - 1)} disabled={saving !== null || pending || pageIndex === 0}>← Previous</button>
          <span>Page {pageIndex + 1} · Newest first</span>
          <button onClick={() => changePage(pageIndex + 1)} disabled={saving !== null || pending || !cursor}>Next →</button>
        </nav>
        <p className="news-page-note">Up to 20 stories per page. Search and topic filters cover this entire list. {cursor ? "More stories are available on the next page." : "You have reached the end of this list."}</p>
        <footer className="news-footer"><span>Keep what catches your eye.</span><span>{fetched ? `Read from Notion ${new Intl.DateTimeFormat("en-GB", { timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date(fetched))} Paris time` : "Notion is the source of truth."}</span></footer>
      </div>
    </main>
  );
}
