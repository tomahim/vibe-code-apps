import { BRAND_BADGE, BRAND_NAME } from "../config/brand.js";
import collectionArtwork from "../assets/genious-apps.png";
import "./login.css";

// Frontend-only login page. There is no backend session yet, so submitting
// the form intentionally does nothing: no request, no storage, no state.
export default function Login() {
  return (
    <main className="login-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label={`${BRAND_NAME} home`}>
          <span className="brand-mark">{BRAND_BADGE}</span>
          <span>{BRAND_NAME}</span>
        </a>
        <a className="back-link" href="/">← Back to the tools</a>
      </header>

      <section className="login-card" aria-labelledby="login-title">
        <img
          className="login-artwork"
          src={collectionArtwork}
          alt="Genious Apps — colorful orbital shapes and ideas in motion"
          width="96"
          height="96"
        />
        <p className="eyebrow">MEMBERS AREA</p>
        <h1 id="login-title">Welcome back.</h1>
        <p className="login-subtitle">Sign in to your {BRAND_NAME} account.</p>
        <form
          className="login-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </label>
          <button className="primary-button login-submit" type="submit">
            Log in
          </button>
        </form>
      </section>
    </main>
  );
}
