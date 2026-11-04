import { useRef, useState } from "react";

const sections = {
  categories: { label: "Categories", singular: "category", title: "A place in your workflow.", hint: "Navigation tabs such as Inspiration or To improve. Limit a category to specific object types, or make it available to all types.", placeholder: "Weekend projects" },
  tags: { label: "Tags", singular: "tag", title: "A topic worth connecting.", hint: "Topics connect objects across categories and types. Tags never move or archive your notes.", placeholder: "Architecture" },
  types: { label: "Object types", singular: "object type", title: "A new kind of object.", hint: "Types describe what you save, such as Ideas or Bookmarks. A new type uses the standard note fields and capture form.", placeholder: "Research notes" },
};
const keyFor = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function TaxonomyAdmin({ taxonomy, api, onCreated, onClose }) {
  const [kind, setKind] = useState("categories");
  const [name, setName] = useState(""); const [key, setKey] = useState(""); const [customKey, setCustomKey] = useState(false);
  const [scope, setScope] = useState("all"); const [types, setTypes] = useState([]);
  const [description, setDescription] = useState(""); const [busy, setBusy] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const inFlight = useRef(false); const nameRef = useRef(null);
  const section = sections[kind]; const entries = taxonomy[kind];
  function clear() { setName(""); setKey(""); setCustomKey(false); setScope("all"); setTypes([]); setDescription(""); setError(""); }
  function switchKind(value) { if (busy) return; setKind(value); clear(); setNotice(""); }
  async function create(e) {
    e.preventDefault(); if (inFlight.current) return;
    if (kind === "categories" && scope === "specific" && !types.length) { setError("Choose at least one object type, or select All object types."); return; }
    inFlight.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const payload = { name: name.trim(), slug: key };
      if (kind === "categories") payload.types = scope === "all" ? [] : types;
      if (kind === "types") payload.description = description;
      const created = await api(`taxonomy/${kind}/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      clear(); setNotice(`${created.name} created. It is ready to use.`); onCreated(); nameRef.current?.focus();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); inFlight.current = false; }
  }
  return <main className="ln-admin">
    <div className="ln-admin-heading"><button onClick={onClose} disabled={busy}>← Collection</button><p className="ln-eyebrow">LITTLE NOTES / ADMINISTRATION</p><h1>Make room<br />for your vocabulary.</h1><p>Create categories, topic tags and object types without leaving the app.</p></div>
    <p className="ln-admin-shared">Shared vocabulary: these additions are available to everyone using Little notes. Your notes stay private. Existing keys, system categories and assignments cannot be changed here.</p>
    <nav className="ln-admin-tabs" aria-label="Vocabulary kind">{Object.entries(sections).map(([value, s]) => <button key={value} aria-pressed={kind === value} onClick={() => switchKind(value)} disabled={busy}>{s.label}<span>{taxonomy[value].length}</span></button>)}</nav>
    <div className="ln-admin-grid"><section className="ln-admin-create" aria-labelledby="ln-admin-form-title"><p className="ln-eyebrow">CREATE {kind === "types" ? "AN" : "A"} {section.singular.toUpperCase()}</p><h2 id="ln-admin-form-title">{section.title}</h2><p>{section.hint}</p>
      <form onSubmit={create}><fieldset disabled={busy}><label htmlFor="ln-taxonomy-name">Name</label><input ref={nameRef} id="ln-taxonomy-name" required maxLength={100} placeholder={section.placeholder} value={name} onChange={e => { setName(e.target.value); if (!customKey) setKey(keyFor(e.target.value).slice(0, kind === "types" ? 64 : 100)); }} />
        <details className="ln-admin-key"><summary>Stable key <code>{key || "generated-from-name"}</code></summary><label htmlFor="ln-taxonomy-key">Key</label><input id="ln-taxonomy-key" required maxLength={kind === "types" ? 64 : 100} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={key} onChange={e => { setCustomKey(true); setKey(e.target.value); }} /><p>Generated from the name. Lowercase letters, numbers and hyphens only. This key cannot be renamed here.</p></details>
        {kind === "categories" && <fieldset className="ln-admin-scope"><legend>Available for</legend><label><input type="radio" name="scope" checked={scope === "all"} onChange={() => { setScope("all"); setError(""); }} />All object types<span>Includes types you add later.</span></label><label><input type="radio" name="scope" checked={scope === "specific"} onChange={() => { setScope("specific"); setError(""); }} />Specific object types</label>{scope === "specific" && <div className="ln-admin-types">{taxonomy.types.map(t => <label key={t.slug}><input type="checkbox" checked={types.includes(t.slug)} onChange={e => { setError(""); setTypes(old => e.target.checked ? [...old, t.slug] : old.filter(v => v !== t.slug)); }} />{t.name}</label>)}</div>}</fieldset>}
        {kind === "types" && <><label htmlFor="ln-taxonomy-description">Description <span>(optional)</span></label><textarea id="ln-taxonomy-description" rows={3} maxLength={2000} value={description} onChange={e => setDescription(e.target.value)} placeholder="What belongs in this object type?" /></>}
        {error && <p className="ln-error" role="alert">{error}</p>}
        <button className="ln-save" disabled={busy || !name.trim() || !key}>{busy ? "Creating..." : `Create ${section.singular} ↗`}</button>
      </fieldset></form>{notice && <p className="ln-notice" role="status">{notice}</p>}
    </section><section className="ln-admin-existing" aria-labelledby="ln-existing-title"><p className="ln-eyebrow">ALREADY HERE / {entries.length}</p><h2 id="ln-existing-title">{section.label}</h2><ul>{entries.map(entry => <li key={entry.slug}><div><strong>{kind === "tags" ? "#" : ""}{entry.name}</strong><code>{entry.slug}</code></div>{kind === "categories" && <span>{entry.is_system ? "System · " : ""}{entry.types.length ? entry.types.map(slug => taxonomy.types.find(t => t.slug === slug)?.name || slug).join(", ") : "All object types"}</span>}</li>)}</ul>{!entries.length && <p>No {section.label.toLowerCase()} yet. Start with one useful name.</p>}</section></div>
  </main>;
}
