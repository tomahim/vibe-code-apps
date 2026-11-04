import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { authFetch, getToken } from "../../auth.js";
import AccountMenu from "../../components/AccountMenu.jsx";
import "./little-notes.css";
import TaxonomyAdmin from "./TaxonomyAdmin.jsx";
import { useNotesRoute } from "./navigation.js";
import { ObjectList, ObjectCalendar, ViewPicker } from "./ObjectViews.jsx";

const base = "/api/apps/little-notes/";
const icons = { idea: "✳", bookmark: "↗", news: "▤", "daily-note": "▦" };
function safeUrl(value) { try { const u = new URL(value); return ["http:", "https:"].includes(u.protocol) && !u.username && !u.password ? u.href : null; } catch { return null; } }
async function api(path, options = {}) {
  const response = await authFetch(base + path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not save. Please retry.");
  return data;
}
const localDate = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());

export default function LittleNotes({ onHome }) {
  const { route, setRoute, setter } = useNotesRoute();
  const initialViewExplicit = useRef(new URLSearchParams(window.location.search).has("view"));
  const routeReady = useRef(false);
  const { type, category, tag, month, q, page, view, admin, item: routeItem } = route;
  const setType = setter("type"), setCategory = setter("category"), setTag = setter("tag"), setMonth = setter("month"), setQ = setter("q"), setView = setter("view"), setAdmin = setter("admin");
  const setPage = value => setRoute(old => ({ ...old, page: typeof value === "function" ? value(old.page) : value, item: "" }));
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("little-notes-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch { return "light"; } });
  function toggleTheme() { const next = theme === "dark" ? "light" : "dark"; setTheme(next); try { localStorage.setItem("little-notes-theme", next); } catch { /* Current session still works. */ } }
  const [viewSaved, setViewSaved] = useState(true); const [savingView, setSavingView] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const viewCache = useRef({}); const viewRequest = useRef(0);
  const [taxonomy, setTaxonomy] = useState({ types: [], categories: [], tags: [], months: [] });
  const [items, setItems] = useState([]); const [total, setTotal] = useState(0);
  const [next, setNext] = useState(null);
  const [selected, setSelected] = useState(null); const [busy, setBusy] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true); const [drawer, setDrawer] = useState(false);
  const [capture, setCapture] = useState(false); const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: "", type: "bookmark", body_markdown: "", external_url: "", saved_on: localDate() });
  const [refresh, setRefresh] = useState(0); const [quickTag, setQuickTag] = useState(""); const [quickCategory, setQuickCategory] = useState("");
  const generation = useRef(0);
  const modalRef = useRef(null);
  const detailRef = useRef(null);
  useEffect(() => {
    if (view !== "default" && detailOpen && selected) detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [view, detailOpen, selected]);
  useEffect(() => {
    if (!capture) return;
    const previous = document.activeElement;
    const handler = e => {
      if (e.key === "Escape" && !busy) setCapture(false);
      if (e.key === "Tab") {
        const all = modalRef.current?.querySelectorAll("button:not(:disabled),input,select,textarea");
        if (!all?.length) return;
        if (e.shiftKey && document.activeElement === all[0]) { e.preventDefault(); all[all.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === all[all.length - 1]) { e.preventDefault(); all[0].focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); previous?.focus(); };
  }, [capture, busy]);
  const signedIn = Boolean(getToken());
  useEffect(() => { if (signedIn) api("taxonomy/").then(data => { setTaxonomy(data); viewCache.current = data.view_preferences || {};
    setViewSaved(!route.type || (viewCache.current[route.type] || "default") === route.view);
    if (!routeReady.current) {
      routeReady.current = true;
      if (!initialViewExplicit.current && route.type) {
        const value = viewCache.current[route.type] || "default";
        setRoute(old => ({ ...old, view: value, month: value === "calendar" && !old.month ? localDate().slice(0, 7) : old.month }));
      }
    } }).catch(e => setError(e.message)); }, [signedIn, refresh]);
  useEffect(() => {
    if (!signedIn) { setLoading(false); return; }
    const current = ++generation.current; setLoading(true); setError(""); if (!routeItem) { setSelected(null); setDetailOpen(false); }
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ type, category, tag, month, q, page: view === "calendar" ? 1 : page });
        const result = await api("content/?" + params);
        if (view === "calendar") {
          // A month must not silently stop at the first 30 objects.
          while (result.next_page) {
            if (current !== generation.current) return;
            params.set("page", result.next_page);
            const more = await api("content/?" + params);
            result.items.push(...more.items); result.next_page = more.next_page;
          }
        }
        if (current !== generation.current) return;
        setItems(result.items); setTotal(result.total); setNext(result.next_page);
        if (!routeItem && view === "default" && result.items[0]) { const detail = await api(`content/${result.items[0].id}/`); if (current === generation.current) setSelected(detail); }
      } catch (e) { if (current === generation.current) setError(e.message); }
      finally { if (current === generation.current) setLoading(false); }
    }, q ? 200 : 0);
    return () => { clearTimeout(timer); generation.current++; };
  }, [signedIn, type, category, tag, month, q, page, refresh, view, routeItem]);
  function filter(setter, value) { setRoute(old => ({ ...old, item: "" })); setter(value); setPage(1); setDrawer(false); setNotice(""); }
  const visibleCategories = taxonomy.categories.filter(c => !type || !c.types.length || c.types.includes(type));
  function chooseType(value) {
    viewRequest.current++; setSavingView(false); setViewSaved(true); setDetailOpen(false);
    const nextView = viewCache.current[value] || "default";
    setView(nextView);
    if (nextView === "calendar" && !month) setMonth(localDate().slice(0, 7));
    const next = taxonomy.categories.filter(c => !value || !c.types.length || c.types.includes(value));
    if (category && !next.some(c => c.slug === category)) setCategory("");
    filter(setType, value);
  }
  function choose(item) { if (!busy) setRoute(old => ({ ...old, item: item.id })); }
  useEffect(() => {
    if (!signedIn) return;
    if (!routeItem) { setDetailOpen(false); return; }
    let active = true; setBusy(true); setError("");
    api(`content/${routeItem}/`).then(item => { if (active) { setSelected(item); setDetailOpen(true); } }).catch(e => { if (active) { setSelected(null); setError(`Could not open this object: ${e.message}`); } }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [signedIn, routeItem, refresh]);
  async function toggle(path, key, slug, enabled = true) {
    if (!selected || busy) return; setBusy(true); setError("");
    try {
      const updated = await api(`content/${selected.id}/${path}/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [key]: slug, enabled, updated_at: selected.updated_at }) });
      setSelected(updated); setNotice(slug === "archive" ? "Kept in Archive. Nothing deleted." : `${slug} ${enabled ? "added" : "removed"}.`);
      setRefresh(x => x + 1);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  const toggleCategory = (slug, enabled = true) => toggle("categories", "category", slug, enabled);
  const toggleTag = (slug, enabled = true) => toggle("tags", "tag", slug, enabled);
  function skip() { if (!items.length) return; const index = items.findIndex(i => i.id === selected?.id); choose(items[(index + 1) % items.length]); setNotice("Skipped for now. Nothing changed."); }
  function openCapture() { setDraft({ title: "", type: type || "bookmark", body_markdown: "", external_url: "", saved_on: localDate() }); setEditing(false); setCapture(true); }
  function openEdit() { setDraft({ ...selected }); setEditing(true); setCapture(true); }
  async function save(e) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      await api(editing ? `content/${selected.id}/` : "content/", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      setCapture(false); setRefresh(x => x + 1); setNotice(editing ? "Changes saved." : "Saved to Inbox.");
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function changeView(value) {
    const request = ++viewRequest.current;
    setRoute(old => ({ ...old, item: "" })); setView(value); setViewSaved(false); setPage(1); setDetailOpen(false); setError("");
    if (value === "calendar" && !month) setMonth(localDate().slice(0, 7));
    if (!type) return; // Everything is a temporary view, not an object type.
    setSavingView(true);
    try {
      const result = await api(`preferences/${type}/`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ view: value }) });
      viewCache.current[type] = result.view;
      if (request === viewRequest.current) { setViewSaved(true); setNotice("View preference saved."); }
    } catch (e) { if (request === viewRequest.current) setError(`View shown, but preference was not saved: ${e.message}`); }
    finally { if (request === viewRequest.current) setSavingView(false); }
  }
  useEffect(() => { if (view === "calendar" && !month) setMonth(localDate().slice(0, 7)); }, [view, month]);
  const activeTags = new Set(selected?.tags.map(t => t.slug) || []);
  const activeCategories = new Set(selected?.categories.map(c => c.slug) || []);
  const itemCategories = selected ? taxonomy.categories.filter(c => !c.types.length || c.types.includes(selected.type)) : [];
  const link = safeUrl(selected?.external_url);
  return <div className={`ln-app ln-theme-${theme}`}>
    <header className="ln-header"><button className="ln-home" onClick={onHome} aria-label="Back to apps">↖</button><span className="ln-brand">little notes<span>IN / OUT</span></span><div className="ln-header-actions"><button className="ln-theme-toggle" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={toggleTheme}>{theme === "dark" ? "☀" : "☾"}</button><button onClick={openCapture} disabled={!signedIn}>+ Capture</button><AccountMenu /></div></header>
    {!signedIn ? <main className="ln-signin"><p className="ln-eyebrow">YOUR PERSONAL COLLECTION</p><h1>A little room<br />for later.</h1><p>Ideas, bookmarks, news and daily notes. Sign in to open your own collection.</p><a href="/login">Sign in →</a></main> : <>
      {admin && taxonomy.can_manage_taxonomy ? <TaxonomyAdmin taxonomy={taxonomy} api={api} onCreated={() => setRefresh(x => x + 1)} onClose={() => setAdmin(false)} /> : <div className="ln-workspace">
        <aside className={`ln-sidebar ${drawer ? "is-open" : ""}`} aria-label="Object type filters"><button className="ln-close" onClick={() => setDrawer(false)}>Close filters ×</button><p className="ln-eyebrow">YOUR OBJECTS</p><button className={!type ? "active" : ""} onClick={() => chooseType("")}>◉ <span>Everything</span></button>{taxonomy.types.map(t => <button key={t.slug} className={type === t.slug ? "active" : ""} onClick={() => chooseType(t.slug)}>{t.icon || icons[t.slug] || "◇"}<span>{t.name}</span></button>)}<div className="ln-sidebar-foot"><strong>KEEP THE THOUGHT.<br />CLEAR THE INBOX.</strong><p>No folders to maintain.<br />Just types, dates and categories.</p></div>{taxonomy.can_manage_taxonomy && <button className="ln-manage-button" onClick={() => { setDrawer(false); setAdmin(true); }}><span aria-hidden="true">⚙</span> Manage</button>}</aside>
        <main className="ln-main"><div className="ln-toolbar"><button className="ln-filter-button" onClick={() => setDrawer(true)}>☰ Types</button><label className="ln-search"><span>⌕</span><input type="search" placeholder="Find a thought, link, phrase..." value={q} onChange={e => filter(setQ, e.target.value)} aria-label="Search content" /></label><select value={month} onChange={e => filter(setMonth, e.target.value)} aria-label="Browse by saved month">{view !== "calendar" && <option value="">All months</option>}{month && !taxonomy.months.some(m => m.month === month) && <option value={month}>{month}</option>}{taxonomy.months.map(m => <option key={m.month} value={m.month}>{m.month} · {m.count}</option>)}</select></div>
          <nav className="ln-tabs" aria-label="Category filters"><button className={!category ? "active" : ""} onClick={() => filter(setCategory, "")}>All</button>{visibleCategories.map(c => <button key={c.slug} className={category === c.slug ? "active" : ""} onClick={() => filter(setCategory, c.slug)}>{c.name}</button>)}<select aria-label="Topic tag filter" value={tag} onChange={e => filter(setTag, e.target.value)}><option value="">More tags</option>{taxonomy.tags.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}</select></nav>
          <div className="ln-heading"><div><p className="ln-eyebrow">A SMALL DECISION AT A TIME</p><h1>{category === "inbox" ? "In, then out." : category ? visibleCategories.find(c => c.slug === category)?.name || category : tag ? `#${tag}` : "Everything, kept."}</h1></div><span className="ln-count">{total} <small>objects</small></span></div>
          <ViewPicker value={view} onChange={changeView} disabled={savingView} saving={savingView} saved={viewSaved} typeName={type ? taxonomy.types.find(t => t.slug === type)?.name || type : ""} />
          {error && <div className="ln-error" role="alert">{error} <button onClick={() => setRefresh(x => x + 1)}>Reload</button></div>}{notice && <p className="ln-notice" role="status">{notice}</p>}
          {loading ? <div className="ln-empty" aria-busy="true">Opening your collection...</div> : !items.length && view !== "calendar" && !routeItem ? <div className="ln-empty"><span>↗</span><h2>{total ? "Choose an object" : "A little breathing room."}</h2><p>No objects match this view. Your other things are still here.</p><button onClick={() => { chooseType(""); setCategory(""); setTag(""); setMonth(""); setQ(""); setPage(1); }}>See everything</button></div> : <>
            {view === "calendar" && <ObjectCalendar month={month || localDate().slice(0, 7)} items={items} choose={choose} busy={busy} onMonth={value => { setRoute(old => ({ ...old, month: value, page: 1, item: "" })); setDetailOpen(false); }} />}
            {["database", "table", "cards"].includes(view) && <ObjectList view={view} items={items} choose={choose} busy={busy} selectedId={selected?.id} types={taxonomy.types} />}
            {selected && (view === "default" || detailOpen) && <><div ref={detailRef} className={view !== "default" ? "ln-view-detail" : ""}>{view !== "default" && <button onClick={() => { setRoute(old => ({ ...old, item: "" })); setDetailOpen(false); setSelected(null); }}>Close object ×</button>}
            <article className="ln-stage"><div className="ln-card-top"><span>{taxonomy.types.find(t => t.slug === selected.type)?.icon || icons[selected.type] || "◇"} {taxonomy.types.find(t => t.slug === selected.type)?.name || selected.type}</span><span>{selected.saved_on}</span></div><div className="ln-card-body"><p className="ln-kicker">{selected.subtitle || selected.source_name || "A thought worth keeping"}</p><h2>{selected.title}</h2>{selected.summary && <p className="ln-summary">{selected.summary}</p>}{safeUrl(selected.image_url) && <img className="ln-image" src={safeUrl(selected.image_url)} alt={selected.image_alt || ""} />}<div className="ln-card-tags">{selected.categories.map(c => <button key={c.slug} className="ln-chip-category" onClick={() => filter(setCategory, c.slug)}>{c.name}</button>)}{selected.tags.map(t => <button key={t.slug} onClick={() => filter(setTag, t.slug)}>#{t.name}</button>)}</div><details key={selected.id}><summary>Read the whole thing <span>↓</span></summary><div className="ln-markdown" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(selected.body_markdown || "No note content yet.")) }} />{selected.claim_status && <p>Source claim status: {selected.claim_status}</p>}{selected.author && <p>By {selected.author}</p>}</details></div><div className="ln-card-footer">{link ? <a href={link} target="_blank" rel="noopener noreferrer">Open original ↗</a> : <span>Stored in your collection</span>}<button onClick={openEdit}>Edit note</button></div></article>
            <section className="ln-decision" aria-label="Quick actions"><div><p className="ln-eyebrow">WHAT NEXT?</p><span>One category. One decision.</span></div><button disabled={busy} onClick={skip}>Skip →</button><button disabled={busy} aria-pressed={activeCategories.has("favorite")} onClick={() => toggleCategory("favorite", !activeCategories.has("favorite"))}>☆ Favorite</button><button className="ln-archive" disabled={busy} onClick={() => toggleCategory(activeCategories.has("archive") ? "inbox" : "archive")}>{activeCategories.has("archive") ? "Back to inbox ↙" : "Archive ↗"}</button><label className="ln-quick-tag"><span className="sr-only">Assign a category</span><select disabled={busy} value={quickCategory} onChange={e => { setQuickCategory(""); if (e.target.value) toggleCategory(e.target.value, !activeCategories.has(e.target.value)); }}><option value="">+ Set a category</option>{itemCategories.map(c => <option key={c.slug} value={c.slug}>{activeCategories.has(c.slug) ? "Remove " : "Add "}{c.name}</option>)}</select></label><label className="ln-quick-tag"><span className="sr-only">Assign a tag</span><select disabled={busy} value={quickTag} onChange={e => { setQuickTag(""); if (e.target.value) toggleTag(e.target.value, !activeTags.has(e.target.value)); }}><option value="">+ Set a tag</option>{taxonomy.tags.map(t => <option key={t.slug} value={t.slug}>{activeTags.has(t.slug) ? "Remove " : "Add "}#{t.name}</option>)}</select></label></section>
            </div></>}
          </>}
          {view !== "calendar" && <section className="ln-queue" aria-label="Next objects"><div className="ln-queue-title"><p className="ln-eyebrow">NEXT IN LINE</p><div><button disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)}>← Previous</button><span>{page}</span><button disabled={!next || loading} onClick={() => setPage(next)}>Next →</button></div></div>{view === "default" && <><div className="ln-queue-cards">{items.filter(i => i.id !== selected?.id).slice(0, 6).map(i => <button key={i.id} disabled={busy} onClick={() => choose(i)}><span>{taxonomy.types.find(t => t.slug === i.type)?.icon || icons[i.type] || "◇"} <small>{i.saved_on}</small></span><strong>{i.title}</strong></button>)}</div><label className="ln-jump">Jump to any of these {items.length} objects<select aria-label="Choose object from current page" value={selected?.id || ""} onChange={e => { const i = items.find(i => i.id === e.target.value); if (i) choose(i); }}><option value="">Choose an object</option>{items.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}</select></label></>} </section>}
        </main>
      </div>}
      {capture && <div className="ln-modal-backdrop"><section ref={modalRef} className="ln-modal" role="dialog" aria-modal="true" aria-labelledby="ln-capture-title"><form onSubmit={save}><div className="ln-modal-head"><h2 id="ln-capture-title">{editing ? "Edit a thought" : "Put it here for later."}</h2><button type="button" onClick={() => setCapture(false)} aria-label="Close capture">×</button></div><label>Title<input autoFocus required maxLength={500} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label>{!editing && <label>Object type<select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}>{taxonomy.types.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}</select></label>}<label>Saved date<input type="date" required value={draft.saved_on} onChange={e => setDraft({ ...draft, saved_on: e.target.value })} /></label>{draft.type === "daily-note" && <label>Note date<input type="date" value={draft.note_on || ""} onChange={e => setDraft({ ...draft, note_on: e.target.value || null })} /></label>}<label>External link<input type="url" value={draft.external_url || ""} onChange={e => setDraft({ ...draft, external_url: e.target.value })} /></label><label>Markdown note<textarea rows={8} value={draft.body_markdown || ""} onChange={e => setDraft({ ...draft, body_markdown: e.target.value })} /></label>{error && <p role="alert" className="ln-error">{error}</p>}<button className="ln-save" disabled={busy}>{busy ? "Saving..." : editing ? "Save changes" : "Save to Inbox ↗"}</button></form></section></div>}
    </>}
    <footer className="ln-footer">LITTLE NOTES <span>Ideas, links and the space between.</span></footer>
  </div>;
}
