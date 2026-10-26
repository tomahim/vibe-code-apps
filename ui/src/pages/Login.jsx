import { useState } from "react";
import { BRAND_BADGE, BRAND_NAME } from "../config/brand.js";
import { logIn } from "../auth.js";
import collectionArtwork from "../assets/genious-apps.png";
import "./login.css";

// Email/password login against the api. A successful sign-in stores a JWT and
// lands on Little Grains, the first app that requires an account.
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await logIn(email, password);
      const next = new URLSearchParams(window.location.search).get("next");
      const destination = next === "/apps/news" ? next : "/apps/little-grains";
      window.history.pushState({}, "", destination);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message || "Could not sign in. Try again.");
      setPending(false);
    }
  }

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
        <form className="login-form" onSubmit={onSubmit}>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && (
            <p className="login-error" role="alert">{error}</p>
          )}
          <button className="primary-button login-submit" type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Log in"}
          </button>
        </form>
      </section>
    </main>
  );
}
