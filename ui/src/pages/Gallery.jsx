import { useEffect, useRef, useState } from "react";
import { BRAND_BADGE, BRAND_NAME } from "../config/brand.js";
import collectionArtwork from "../assets/genious-apps.png";
import AccountMenu from "../components/AccountMenu.jsx";

const initialApps = [
  { slug: "story-shelf", name: "The Story Room", description: "A little 3D library. Open illustrated books about history, nature and mountains.", category: "Stories & discovery", icon: "📚" },
  { slug: "little-drops", name: "Little Drops", description: "Follow a water drop through a cutaway city. Play with the hidden mechanisms behind everyday life.", category: "Explore & learn", icon: "💧" },
  {
    slug: "little-factory",
    name: "The Little Factory",
    description: "Step inside a dark futuristic factory where robot arms assemble a repo's merged PRs on the production line.",
    category: "Creative coding",
    icon: "🏭",
    href: "/artifacts/2026-10-30-repo-factory",
    action_label: "Enter the factory",
  },
  { slug: "news", name: "Link Keeper", description: "Your Notion link library: inbox, news, favorites, inspiration and archive. Private account access required.", category: "News & ideas", icon: "▤" },
  {
    slug: "rust-learning-path",
    name: "Rust learning path",
    description: "Small lessons, real Rust. Learn the fundamentals with a code editor and compiler feedback.",
    category: "Learn to build",
    icon: "🦀",
  },
  {
    slug: "app-ideas",
    name: "App Ideas",
    description: "The idea garden: browse, search and filter every app idea waiting to be built.",
    category: "Product ideas",
    icon: "✎",
  },
  {
    slug: "recipes",
    name: "Etchebest",
    description: "Bring your ingredients. Spin a 3D wheel and discover what’s cooking tonight.",
    category: "Cooking",
    icon: "🍽",
  },
  {
    slug: "threejs-learning-path",
    name: "Three.js learning path",
    description: "Learn 3D one small experiment at a time. Interactive lessons, a live editor, and a world to build.",
    category: "Creative coding",
    icon: "◇",
  },
  {
    slug: "little-grains",
    name: "Little Grains",
    description: "Atomic learning: tiny lessons that add up, one little grain at a time.",
    category: "Learn",
    icon: "🌾",
  },
  {
    slug: "content-review",
    name: "Content Review",
    description: "Review Little Grains lessons while they are still pull requests: see exactly what changed and send feedback straight to GitHub.",
    category: "Learn",
    icon: "🔍",
  },
  {
    slug: "livetrail-scrap",
    name: "LiveTrail Scraper",
    description: "Estimate checkpoint times for trail races and explore the elevation profile.",
    category: "Trail running",
    icon: "↗",
  },
];

export default function Gallery({ onOpenApp }) {
  const [apps, setApps] = useState(initialApps);
  const [query, setQuery] = useState("");
  const searchInput = useRef(null);
  const searchTerm = query.trim().toLowerCase();
  const filteredApps = apps.filter((app) =>
    [app.name, app.category, app.description].some((value) =>
      (value || "").toLowerCase().includes(searchTerm)
    )
  );

  useEffect(() => {
    fetch("/api/apps/")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result) => {
        if (Array.isArray(result.apps)) {
          const merged = new Map(initialApps.map((app) => [app.slug, app]));
          result.apps.forEach((app) => {
            // The local wheel replaces the older API card that linked to admin.
            const local = initialApps.find((entry) => entry.slug === app.slug);
            merged.set(app.slug, app.slug === "recipes" ? { ...app, ...local, href: undefined, action_label: undefined } : { ...local, ...app });
          });
          setApps([...merged.values()]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="gallery-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label={`${BRAND_NAME} home`}>
          <span className="brand-mark">{BRAND_BADGE}</span>
          <span>{BRAND_NAME}</span>
        </a>
        <div className="header-actions">
          <span className="header-note">A small collection of useful tools</span>
          <a className="admin-link" href="/artifacts">Artifacts</a>
          <a className="admin-link" href="/admin/">Admin</a>
          <AccountMenu />
        </div>
      </header>

      <section className="gallery-intro">
        <div>
          <p className="eyebrow">THE TOOL SHED</p>
          <h1>Find your next useful tool.</h1>
          <p>Small, thoughtful apps for exploring, learning, and getting things done.</p>
        </div>
        <img className="collection-artwork" src={collectionArtwork} alt="Genious Apps — colorful orbital shapes and ideas in motion" width="200" height="200" />
      </section>

      <div className="gallery-search">
        <label htmlFor="app-search">Search apps</label>
        <div className="gallery-search-field">
          <input
            ref={searchInput}
            id="app-search"
            type="search"
            placeholder="Search by name, category or description"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-controls="app-gallery"
            autoComplete="off"
          />
          {query && (
            <button
              className="gallery-search-clear"
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                searchInput.current?.focus();
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
        <p className="gallery-search-status" role="status">
          {filteredApps.length} {filteredApps.length === 1 ? "app" : "apps"}
          {searchTerm ? ` matching "${query.trim()}"` : " to explore"}
        </p>
      </div>

      <section id="app-gallery" className="app-grid" aria-label="App gallery">
        {filteredApps.map((app) => (
          <button className="app-card" key={app.slug} onClick={() => app.href ? window.location.assign(app.href) : onOpenApp(app.slug)}>
            <span className="app-card-icon" aria-hidden="true">{app.icon || "✦"}</span>
            <span className="app-card-category">{app.category}</span>
            <span className="app-card-title">{app.name}</span>
            <span className="app-card-description">{app.description}</span>
            <span className="app-card-link">{app.action_label || "Open tool"} <span aria-hidden="true">→</span></span>
          </button>
        ))}
      </section>
      {filteredApps.length === 0 && (
        <p className="gallery-search-empty">No apps found. Try another name, category or keyword.</p>
      )}
      <footer className="site-footer">More tools will find their way here.</footer>
    </main>
  );
}
