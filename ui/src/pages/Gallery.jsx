import { useEffect, useState } from "react";

const initialApps = [
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
        if (Array.isArray(result.apps)) setApps(result.apps);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="gallery-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Trail Tools home">
          <span className="brand-mark">T</span>
          <span>Trail Tools</span>
        </a>
        <span className="header-note">A small collection of useful tools</span>
      </header>

      <section className="gallery-intro">
        <p className="eyebrow">THE TOOL SHED</p>
        <h1>Find your next useful tool.</h1>
        <p>Focused apps for the things we love doing outside.</p>
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
