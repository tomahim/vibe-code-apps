import "./loader.css";

// The one startup loader for Little Grains: a carton progressively filling
// with grains. It covers the whole startup - the app chunk load (route
// fallback), the api health wait and the garden fetch - so there is never a
// sequence of different loaders. The carton fills and empties in a loop on
// purpose: readiness is unknown, so the animation must not pretend to be
// determinate progress.
export function Carton() {
  return <div className="grains-carton" aria-hidden="true">
    <span className="grains-carton-flap left" />
    <span className="grains-carton-flap right" />
    <span className="grains-carton-fill" />
    <span className="grains-carton-body" />
  </div>;
}

// Full-screen carton shown while the app chunk itself is still loading.
export function GrainsBootLoader() {
  return <main className="grains-boot">
    <div className="grains-loader" role="status" aria-label="Loading the garden"><Carton /></div>
  </main>;
}

// In-app startup loader. With no attempt it stays bare (carton only), used
// once the api is awake and the garden data is loading; the waking phase
// adds escalating messages and the exhausted phase offers a retry.
export function GrainsLoader({ attempt = null, exhausted = false, onRetry }) {
  if (!exhausted && attempt === null) {
    return <div className="grains-loader" role="status" aria-label="Loading the garden"><Carton /></div>;
  }
  const message = exhausted
    ? "The garden is taking too long to wake up."
    : attempt <= 2 ? "Waking up the garden…"
    : attempt <= 6 ? "The server is still waking up…"
    : "Almost there, still starting…";
  const detail = exhausted
    ? "The server did not answer in time. Check your connection, then try again."
    : "The server sleeps after a quiet spell - the first load can take a minute or two.";
  return <div className="grains-loader" role="status" aria-live="polite">
    <Carton />
    <h2>{message}</h2>
    <p>{detail}</p>
    {exhausted
      ? <button className="grains-loader-retry" onClick={onRetry}>Try again</button>
      : <span className="grains-loader-attempt">Checking the server · attempt {attempt}</span>}
  </div>;
}
