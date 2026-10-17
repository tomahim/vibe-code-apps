import { useEffect, useState } from "react";

const initialApps = [
  {
    slug: "threejs-learning-path",
    name: "Three.js learning path",
    description: "Learn 3D one small experiment at a time. Interactive lessons, a live editor, and a world to build.",
    category: "Creative coding",
    icon: "◇",
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

  useEffect(() => {
    fetch("/api/apps/")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result) => {
        if (Array.isArray(result.apps)) {
          const merged = new Map(initialApps.map((app) => [app.slug, app]));
          result.apps.forEach((app) => merged.set(app.slug, { ...merged.get(app.slug), ...app }));
          setApps([...merged.values()]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="gallery-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Genious Tools home">
          <span className="brand-mark">G</span>
          <span>Genious Tools</span>
        </a>
        <div className="header-actions">
          <span className="header-note">A small collection of useful tools</span>
          <a className="admin-link" href="/admin/">Admin</a>
        </div>
      </header>

      <section className="gallery-intro">
        <p className="eyebrow">THE TOOL SHED</p>
        <h1>Find your next useful tool.</h1>
        <p>Small, thoughtful apps for exploring, learning, and getting things done.</p>
      </section>

      <section className="app-grid" aria-label="App gallery">
        {apps.map((app) => (
          <button className="app-card" key={app.slug} onClick={() => onOpenApp(app.slug)}>
            <span className="app-card-icon" aria-hidden="true">{app.icon || "✦"}</span>
            <span className="app-card-category">{app.category}</span>
            <span className="app-card-title">{app.name}</span>
            <span className="app-card-description">{app.description}</span>
            <span className="app-card-link">Open tool <span aria-hidden="true">→</span></span>
          </button>
        ))}
      </section>
      <footer className="site-footer">More tools will find their way here.</footer>
    </main>
  );
}
