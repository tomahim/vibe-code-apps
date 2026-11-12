import { useEffect, useRef, useState } from "react";
import { BRAND_BADGE, BRAND_NAME } from "../config/brand.js";
import collectionArtwork from "../assets/genious-apps.png";
import AccountMenu from "../components/AccountMenu.jsx";

const TABS = ["All", "Learning", "Creativity", "Sports", "Daily organization", "Tech tools"];

// Tab assignment lives here, keyed by slug, so it does not depend on the
// category label returned by the API merge below.
const TAB_BY_SLUG = {
  "hockey": "Sports",
  "little-notes": "Daily organization",
  "story-shelf": "Creativity",
  "little-factory": "Creativity",
  "knob-conservatory": "Creativity",
  "music-library": "Creativity",
  "lithotheque": "Learning",
  "rust-learning-path": "Learning",
  "recipes": "Daily organization",
  "threejs-learning-path": "Learning",
  "content-review": "Tech tools",
  "db-dashboard": "Tech tools",
  "livetrail-scrap": "Sports",
};

const FAVORITES_KEY = "genious-gallery-favorites";

function loadFavorites() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((slug) => typeof slug === "string") : [];
  } catch {
    return [];
  }
}

const initialApps = [
  { slug: "hockey", name: "Hockey Lab", description: "National League player stats, weekly comparisons and your private fantasy transfer plans.", category: "Sports", icon: "◒" },
  { slug: "little-notes", name: "Little notes", description: "IN / OUT: ideas, bookmarks, news, videos, work ideas and daily notes in one private collection.", category: "Daily organization", icon: "↗" },
  { slug: "story-shelf", name: "The Story Room", description: "A little 3D library. Open illustrated books about history, nature and mountains.", category: "Creativity", icon: "📚" },
  {
    slug: "little-factory",
    name: "The Little Factory",
    description: "Step inside a dark futuristic factory where robot arms assemble a repo's merged PRs on the production line.",
    category: "Creativity",
    icon: "🏭",
    href: "/artifacts/2026-10-30-repo-factory",
    action_label: "Enter the factory",
  },
  {
    slug: "knob-conservatory",
    name: "Knob Conservatory",
    description: "Learn synthesis one knob at a time, by ear: progressive lessons on a vintage monosynth, plus a workshop for your own instruments.",
    category: "Creativity",
    icon: "🎛",
  },
  {
    slug: "music-library",
    name: "Music generation library",
    description: "A library of generative film ambiences played live by a real SuperCollider engine in your browser. Press play, read the score, change the code.",
    category: "Creativity",
    icon: "🎼",
  },
  {
    slug: "lithotheque",
    name: "Lithothèque",
    description: "A dark mineralogist's bench: turn 3D study models, check species reference readouts and read each stone's dossier.",
    category: "Learning",
    icon: "⛏",
  },
  {
    slug: "rust-learning-path",
    name: "Rust learning path",
    description: "Small lessons, real Rust. Learn the fundamentals with a code editor and compiler feedback.",
    category: "Learning",
    icon: "🦀",
  },
  {
    slug: "recipes",
    name: "Etchebest",
    description: "Bring your ingredients. Spin a 3D wheel and discover what’s cooking tonight.",
    category: "Daily organization",
    icon: "🍽",
  },
  {
    slug: "threejs-learning-path",
    name: "Three.js learning path",
    description: "Learn 3D one small experiment at a time. Interactive lessons, a live editor, and a world to build.",
    category: "Learning",
    icon: "◇",
  },
  {
    slug: "content-review",
    name: "Content Review",
    description: "Review Little Grains lessons while they are still pull requests: see exactly what changed and send feedback straight to GitHub.",
    category: "Tech tools",
    icon: "🔍",
  },
  {
    slug: "db-dashboard",
    name: "Database Dashboard",
    description: "Size, tables, rows and indexes of the production Postgres, with a gauge against your storage allowance. Staff only, read-only.",
    category: "Tech tools",
    icon: "🗄",
  },
  {
    slug: "livetrail-scrap",
    name: "LiveTrail Scraper",
    description: "Estimate checkpoint times for trail races and explore the elevation profile.",
    category: "Sports",
    icon: "↗",
  },
];

export default function Gallery({ onOpenApp }) {
  const [apps, setApps] = useState(initialApps);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [favorites, setFavorites] = useState(loadFavorites);
  const searchInput = useRef(null);
  const searchTerm = query.trim().toLowerCase();
  const filteredApps = apps
    .filter((app) => activeTab === "All" || TAB_BY_SLUG[app.slug] === activeTab)
    .filter((app) =>
      [app.name, app.category, app.description].some((value) =>
        (value || "").toLowerCase().includes(searchTerm)
      )
    );
  // Favorites float to the top of whichever tab is visible; the rest keep
  // their existing relative order (Array.sort is stable).
  const visibleApps = [...filteredApps].sort((a, b) =>
    Number(favorites.includes(b.slug)) - Number(favorites.includes(a.slug))
  );

  function toggleFavorite(slug) {
    setFavorites((current) => {
      const next = current.includes(slug)
        ? current.filter((entry) => entry !== slug)
        : [...current, slug];
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // Private browsing or full storage: favorites stay session-only.
      }
      return next;
    });
  }

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

      <nav className="gallery-tabs" aria-label="App categories">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className="gallery-tab"
            aria-pressed={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

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
          {visibleApps.length} {visibleApps.length === 1 ? "app" : "apps"}
          {searchTerm ? ` matching "${query.trim()}"` : activeTab === "All" ? " to explore" : ` in ${activeTab}`}
        </p>
      </div>

      <section id="app-gallery" className="app-grid" aria-label="App gallery">
        {visibleApps.map((app) => {
          const isFavorite = favorites.includes(app.slug);
          return (
            <div className="app-card-wrap" key={app.slug}>
              <button className="app-card" onClick={() => app.href ? window.location.assign(app.href) : onOpenApp(app.slug)}>
                <span className="app-card-icon" aria-hidden="true">{app.icon || "✦"}</span>
                <span className="app-card-category">{app.category}</span>
                <span className="app-card-title">{app.name}</span>
                <span className="app-card-description">{app.description}</span>
                <span className="app-card-link">{app.action_label || "Open tool"} <span aria-hidden="true">→</span></span>
              </button>
              <button
                type="button"
                className="app-card-fav"
                aria-pressed={isFavorite}
                aria-label={isFavorite ? `Remove ${app.name} from favorites` : `Add ${app.name} to favorites`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                onClick={() => toggleFavorite(app.slug)}
              >
                <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
              </button>
            </div>
          );
        })}
      </section>
      {visibleApps.length === 0 && (
        <p className="gallery-search-empty">No apps found. Try another name, category or keyword.</p>
      )}
      <footer className="site-footer">More tools will find their way here.</footer>
    </main>
  );
}
