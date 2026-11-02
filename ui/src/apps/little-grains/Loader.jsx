import "./loader.css";

// Thomas's requested tagline for the startup loader.
const TAGLINE = "Little Grains, strong growth...";

// The one startup loader for Little Grains: a carrot growing out of the
// soil in a small garden scene (sun, cloud, earth). It covers the whole
// startup - the app chunk load (route fallback), the api health wait and
// the garden fetch - so there is never a sequence of different loaders.
// The carrot grows and sinks back in a loop on purpose: readiness is
// unknown, so the animation must not pretend to be determinate progress.
export function Garden() {
  return <div className="grains-garden-scene" aria-hidden="true">
    <span className="grains-garden-sun" />
    <span className="grains-garden-cloud" />
    <span className="grains-carrot">
      <span className="grains-carrot-leaves">
        <span className="leaf leaf-1" />
        <span className="leaf leaf-2" />
        <span className="leaf leaf-3" />
      </span>
      <span className="grains-carrot-body">
        <span className="line line-1" />
        <span className="line line-2" />
        <span className="line line-3" />
      </span>
    </span>
    <span className="grains-garden-soil" />
  </div>;
}

// Full-screen garden shown while the app chunk itself is still loading.
export function GrainsBootLoader() {
  return <main className="grains-boot">
    <div className="grains-loader" role="status" aria-label="Loading Little Grains">
      <Garden />
      <p className="grains-loader-tagline">{TAGLINE}</p>
    </div>
  </main>;
}

// In-app startup loader. The garden scene and tagline stay up through the
// health wait and the garden fetch; the waking phase adds escalating
// messages and the exhausted phase offers a retry.
export function GrainsLoader({ attempt = null, exhausted = false, onRetry }) {
  if (!exhausted && attempt === null) {
    return <div className="grains-loader" role="status" aria-label="Loading Little Grains">
      <Garden />
      <p className="grains-loader-tagline">{TAGLINE}</p>
    </div>;
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
    <Garden />
    <p className="grains-loader-tagline">{TAGLINE}</p>
    <h2>{message}</h2>
    <p>{detail}</p>
    {exhausted
      ? <button className="grains-loader-retry" onClick={onRetry}>Try again</button>
      : <span className="grains-loader-attempt">Checking the server · attempt {attempt}</span>}
  </div>;
}
