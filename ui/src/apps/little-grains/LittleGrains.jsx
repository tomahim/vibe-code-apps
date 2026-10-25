import { useEffect, useState } from "react";
import { BRAND_BADGE, BRAND_NAME } from "../../config/brand.js";
import { authFetch, clearToken, getToken } from "../../auth.js";
import AccountMenu from "../../components/AccountMenu.jsx";
import "./little-grains.css";

function redirectToLogin() {
  window.history.replaceState({}, "", "/login");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

// Little Grains is the first app that requires an account: without a token it
// sends the visitor to the login page, otherwise it loads the secured lessons.
export default function LittleGrains() {
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      // Defer: App's popstate listener (a parent effect) must be attached first.
      const id = setTimeout(redirectToLogin, 0);
      return () => clearTimeout(id);
    }
    let cancelled = false;
    authFetch("/api/apps/little-grains/lessons")
      .then(async (response) => {
        if (response.status === 401) {
          clearToken();
          redirectToLogin();
          return;
        }
        if (!response.ok) throw new Error("load failed");
        const data = await response.json();
        if (!cancelled) setLessons(Array.isArray(data.lessons) ? data.lessons : []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load your grains. Check your connection and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="little-grains-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label={`${BRAND_NAME} home`}>
          <span className="brand-mark">{BRAND_BADGE}</span>
          <span>{BRAND_NAME}</span>
        </a>
        <div className="header-actions">
          <a className="back-link" href="/">← Back to the tools</a>
          <AccountMenu />
        </div>
      </header>

      <section className="grains-intro">
        <p className="eyebrow">LITTLE GRAINS</p>
        <h1>Your lessons for today.</h1>
        <p className="grains-subtitle">Small grains of knowledge, one at a time.</p>
      </section>

      {error && <p className="grains-error" role="alert">{error}</p>}
      {!error && lessons === null && <p className="grains-status">Gathering your grains…</p>}
      {lessons && (
        <section className="grain-grid" aria-label="Lessons">
          {lessons.map((lesson) => (
            <article className="grain-card" key={lesson.id}>
              <span className="grain-card-icon" aria-hidden="true">🌾</span>
              <h2 className="grain-card-title">{lesson.title}</h2>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
