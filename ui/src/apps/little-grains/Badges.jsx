import { useEffect, useState } from "react";
import "./badges.css";

// One art file per badge slug; the API owns every name, tier and rule.
const ART = import.meta.glob("./badge-art/*.svg", { eager: true, query: "?url", import: "default" });
const art = (slug) => ART[`./badge-art/${slug}.svg`] || ART["./badge-art/first-sprout.svg"];
const TIERS = { 1: "Achievable", 2: "Challenging", 3: "Rare" };
// Families appear in the order the catalogue first lists them.
const familiesOf = (badges) => [...new Set(badges.map((badge) => badge.family))];
const formatDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

export function BadgeButton({ newCount, onClick }) {
  return <button className="grains-badges-button" onClick={onClick} aria-label={newCount > 0 ? `Open badges, ${newCount} new in the last 7 days` : "Open badges"}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 19.6 7.2v9.6L12 21.2 4.4 16.8V7.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 8.2c-2.2 0-3.4 1.6-3.4 3.4 0 2.1 1.6 3.5 3.4 4.2 1.8-.7 3.4-2.1 3.4-4.2 0-1.8-1.2-3.4-3.4-3.4Z" fill="currentColor" /></svg>
    {newCount > 0 && <span className="grains-badge-count" aria-hidden="true">{newCount}</span>}
  </button>;
}

function Art({ badge }) {
  return <img className={badge.earned ? "badge-art" : "badge-art locked"} src={art(badge.slug)} alt="" loading="lazy" />;
}

function Detail({ badge, onBack }) {
  return <div className="grains-badge-detail">
    <button className="grains-badge-back" onClick={onBack}>‹ All badges</button>
    <div className="grains-badge-hero"><Art badge={badge} />{badge.new && <span className="grains-new-sticker">NEW</span>}</div>
    <p className="grains-badge-meta">{badge.family.toUpperCase()} · {TIERS[badge.tier].toUpperCase()}</p>
    <h2>{badge.name}</h2>
    <section><h3>How to earn it</h3><p>{badge.explanation}</p></section>
    {badge.earned && badge.evidence?.length > 0 && <section><h3>{badge.evidence_is_last ? "The one that completed it" : "What earned it"}</h3><ul className="grains-badge-evidence">{badge.evidence.map((item) => <li key={item}>{item}</li>)}</ul></section>}
    <section className={badge.earned ? "grains-badge-status earned" : "grains-badge-status"}>
      {badge.earned
        ? <><strong>Earned on {formatDate(badge.earned_at)}</strong><span>When you reached the goal.</span></>
        : <><strong>Not earned yet</strong><span>{badge.progress} of {badge.target} so far</span></>}
    </section>
  </div>;
}

export function BadgeCollection({ data, error, onClose }) {
  const [slug, setSlug] = useState(null);
  const selected = data?.badges.find((badge) => badge.slug === slug);
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") { if (slug) setSlug(null); else onClose(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slug, onClose]);
  return <div className="grains-modal-backdrop leaderboard-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="grains-leaderboard grains-badges" role="dialog" aria-modal="true" aria-label="Badges">
      <div className="grains-leaderboard-head"><div><p>KEEPSAKES FROM YOUR GARDEN</p><h2>Badges</h2></div><button className="grains-close" onClick={onClose} aria-label="Close badges">×</button></div>
      {error && !data && <p className="grains-empty-ranking" role="alert">{error}</p>}
      {!data && !error && <p className="grains-empty-ranking">Loading your badges…</p>}
      {data && selected && <Detail badge={selected} onBack={() => setSlug(null)} />}
      {data && !selected && <>
        <p className="grains-badges-summary"><strong>{data.earned_count}</strong> of {data.badges.length} collected{data.new_count > 0 && <> · <span className="new-note">{data.new_count} new in the last 7 days</span></>}</p>
        {familiesOf(data.badges).map((family) => {
          const group = data.badges.filter((badge) => badge.family === family);
          return <section key={family} className="grains-badge-family"><h3>{family}<small>{group.filter((badge) => badge.earned).length} / {group.length}</small></h3>
            <div className="grains-badge-grid">{group.map((badge) => <button key={badge.slug} className={badge.earned ? "grains-badge-tile earned" : "grains-badge-tile"} onClick={() => setSlug(badge.slug)}
              aria-label={`${badge.name}, ${badge.earned ? "earned" : "not earned yet"}${badge.new ? ", new" : ""}`}>
              <Art badge={badge} />{badge.new && <span className="grains-new-sticker">NEW</span>}<span className="grains-badge-name">{badge.name}</span></button>)}</div></section>;
        })}
      </>}
    </aside>
  </div>;
}
