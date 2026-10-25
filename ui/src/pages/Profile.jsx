import { useEffect } from "react";
import { BRAND_BADGE, BRAND_NAME } from "../config/brand.js";
import AccountMenu from "../components/AccountMenu.jsx";
import { getToken, getUser } from "../auth.js";
import "./profile.css";

// Minimal account page: first and last name for now. Visitors without a
// token are sent to the login page.
export default function Profile() {
  useEffect(() => {
    if (getToken()) return undefined;
    // Defer: App's popstate listener (a parent effect) must be attached first.
    const id = setTimeout(() => {
      window.history.replaceState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!getToken()) return null;

  const user = getUser();
  const firstName = user?.first_name?.trim();
  const lastName = user?.last_name?.trim();

  return (
    <main className="profile-page">
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

      <section className="profile-card" aria-labelledby="profile-title">
        <p className="eyebrow">ACCOUNT</p>
        <h1 id="profile-title">Your profile.</h1>
        <dl className="profile-fields">
          <div className="profile-field">
            <dt>First name</dt>
            <dd>{firstName || "Not set yet"}</dd>
          </div>
          <div className="profile-field">
            <dt>Last name</dt>
            <dd>{lastName || "Not set yet"}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
