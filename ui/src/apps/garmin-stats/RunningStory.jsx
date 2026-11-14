import { useEffect, useMemo, useRef, useState } from "react";
import { fetchRunning } from "./api.js";
import { buildComparisons } from "./comparisons.js";
import { formatInt, formatPace, formatDate } from "./format.js";

/* Count-up animation: starts when the element scrolls into view. */
function CountUp({ value, decimals = 0, suffix = "", className = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let frame;
    const animate = () => {
      const start = performance.now();
      const duration = 1600;
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(value * eased)
        );
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, decimals]);

  return (
    <span ref={ref} className={`gr-count ${className}`}>
      {display}
      {suffix}
    </span>
  );
}

/* Scroll progress (0..1) through a tall container with a sticky viewport. */
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame;
    const update = () => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      setProgress(p);
    };
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
  return progress;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/* Sticky full-screen chapter: the year ticks forward while cumulative km and
   hours climb. One screen of scroll per year of running. */
function YearEvolution({ years }) {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);

  const milestones = useMemo(
    () => [{ year: years[0].year - 1, cumulative_km: 0, cumulative_hours: 0, runs: 0 }, ...years],
    [years]
  );
  const segments = milestones.length - 1;
  const position = Math.min(progress * segments, segments - 1e-6);
  const index = Math.floor(position);
  const local = easeInOut(position - index);
  const from = milestones[index];
  const to = milestones[index + 1];
  const km = from.cumulative_km + (to.cumulative_km - from.cumulative_km) * local;
  const hours = from.cumulative_hours + (to.cumulative_hours - from.cumulative_hours) * local;
  const year = Math.round(from.year + (to.year - from.year) * local);
  const hue = 200 + (position / segments) * 160;

  return (
    <section ref={ref} className="gr-evolution" style={{ height: `${(segments + 0.6) * 100}vh` }}>
      <div
        className="gr-evolution-sticky"
        style={{ background: `linear-gradient(160deg, hsl(${hue} 65% 12%) 0%, hsl(${hue + 40} 70% 22%) 100%)` }}
      >
        <p className="gr-evolution-eyebrow">The story so far</p>
        <div className="gr-evolution-year" aria-live="polite">{year}</div>
        <div className="gr-evolution-counters">
          <div>
            <span className="gr-evolution-number">{formatInt(km)}</span>
            <span className="gr-evolution-unit">km covered</span>
          </div>
          <div>
            <span className="gr-evolution-number">{formatInt(hours)}</span>
            <span className="gr-evolution-unit">hours moving</span>
          </div>
        </div>
        <div className="gr-evolution-track" aria-hidden="true">
          <div className="gr-evolution-track-fill" style={{ width: `${progress * 100}%` }} />
          <span className="gr-evolution-runner" style={{ left: `${progress * 100}%` }}>🏃</span>
        </div>
        <div className="gr-evolution-years" aria-hidden="true">
          {years.map((row) => (
            <span key={row.year} className={row.year <= year ? "done" : ""}>{row.year}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

const CARD_PALETTES = [
  "linear-gradient(135deg, #1a2a6c 0%, #2a4d8f 45%, #21a1c4 100%)",
  "linear-gradient(135deg, #42275a 0%, #734b6d 100%)",
  "linear-gradient(135deg, #0f3443 0%, #34e89e 140%)",
  "linear-gradient(135deg, #b24592 0%, #f15f79 100%)",
  "linear-gradient(135deg, #c0392b 0%, #e67e22 100%)",
  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
];

function ComparisonCard({ card, index }) {
  return (
    <article className="gr-card" style={{ background: CARD_PALETTES[index % CARD_PALETTES.length] }}>
      <CountUp value={card.value} decimals={card.decimals} suffix={card.suffix || ""} className="gr-card-number" />
      <p className="gr-card-label">{card.label}</p>
      <p className="gr-card-caption">{card.caption}</p>
    </article>
  );
}

export default function RunningStory() {
  const [state, setState] = useState({ data: null, loading: true, error: "" });

  useEffect(() => {
    let live = true;
    fetchRunning()
      .then((data) => live && setState({ data, loading: false, error: "" }))
      .catch((error) => live && setState({ data: null, loading: false, error: error.message }));
    return () => { live = false; };
  }, []);

  const { data, loading, error } = state;

  if (loading) {
    return <p role="status" className="garmin-loading garmin-loading--dark">Lacing up…</p>;
  }
  if (error) return <p role="alert" className="garmin-error">{error}</p>;

  const { totals, by_year: byYear, records } = data;
  const groups = buildComparisons(data);

  return (
    <main className="gr-story">
      <section className="gr-hero">
        <p className="gr-hero-eyebrow">MY RUNNING STORY</p>
        <h2 className="gr-hero-title">
          {formatInt(totals.km)} <span>km</span>
        </h2>
        <p className="gr-hero-sub">
          {formatInt(totals.runs)} runs between {formatDate(data.first_run)} and {formatDate(data.last_run)}.
          Every single one is in here.
        </p>
        <p className="gr-hero-hint" aria-hidden="true">Scroll to run through the years ↓</p>
      </section>

      <YearEvolution years={byYear} />

      <section className="gr-totals">
        <p className="gr-group-title">The raw numbers</p>
        <div className="gr-totals-grid">
          <div className="gr-total"><CountUp value={totals.runs} /><span className="gr-total-label">runs</span></div>
          <div className="gr-total"><CountUp value={totals.km} /><span className="gr-total-label">kilometers</span></div>
          <div className="gr-total"><CountUp value={totals.hours} /><span className="gr-total-label">hours</span></div>
          <div className="gr-total"><CountUp value={totals.elevation_m} /><span className="gr-total-label">meters climbed</span></div>
          <div className="gr-total"><CountUp value={totals.steps} /><span className="gr-total-label">steps</span></div>
          <div className="gr-total"><CountUp value={totals.kcal} /><span className="gr-total-label">kcal burned</span></div>
        </div>
        <p className="gr-totals-note">
          Longest run: {records.longest_distance ? `${records.longest_distance.km} km` : "—"}
          {records.best_pace_seconds_per_km ? ` · Best 10k+ pace: ${formatPace(records.best_pace_seconds_per_km)}` : ""}
        </p>
      </section>

      {groups.map((group, groupIndex) => (
        <section className="gr-group" key={group.group}>
          <p className="gr-group-title">{group.group}</p>
          <div className="gr-cards">
            {group.cards.map((card, cardIndex) => (
              <ComparisonCard key={card.label} card={card} index={groupIndex * 3 + cardIndex} />
            ))}
          </div>
        </section>
      ))}

      <section className="gr-outro">
        <p className="gr-outro-big">And the story is still being written.</p>
        <p className="gr-outro-sub">Next run: soon. The counter is waiting.</p>
      </section>
    </main>
  );
}
