import { useEffect, useMemo, useRef, useState } from "react";
import { fetchRunning } from "./api.js";
import { buildComparisons } from "./comparisons.js";
import { formatInt, formatPace, formatDate } from "./format.js";

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Count-up animation: starts when the element scrolls into view.
   With reduced motion on, the final value is rendered immediately. */
function CountUp({ value, decimals = 0, suffix = "", className = "" }) {
  const ref = useRef(null);
  const format = (v) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(v);
  const [display, setDisplay] = useState(() => (REDUCED_MOTION ? format(value) : "0"));

  useEffect(() => {
    if (REDUCED_MOTION) {
      setDisplay(format(value));
      return undefined;
    }
    const node = ref.current;
    if (!node) return undefined;
    let frame;
    const animate = () => {
      const start = performance.now();
      const duration = 1600;
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(format(value * eased));
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

/* ---- visual motifs for the comparison cards ---- */

function VizRing({ fraction, icon }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const fill = Math.min(Math.max(fraction, 0), 1);
  return (
    <svg className="gr-viz-ring" viewBox="0 0 140 140" role="img" aria-label={`${Math.round(fill * 100)}% of the full circle`}>
      <circle cx="70" cy="70" r={r} className="gr-viz-ring-track" />
      <circle
        cx="70" cy="70" r={r}
        className="gr-viz-ring-fill"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - fill)}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="80" textAnchor="middle" className="gr-viz-icon">{icon}</text>
    </svg>
  );
}

function VizRoute({ fraction, times, from, to, icon }) {
  const fill = Math.min(Math.max(fraction, 0), 1);
  return (
    <div className="gr-viz-route" role="img" aria-label={`Route from ${from} to ${to}`}>
      <div className="gr-viz-route-labels"><span>{from}</span><span>{to}</span></div>
      <div className="gr-viz-route-track">
        <div className="gr-viz-route-fill" style={{ width: `${fill * 100}%` }} />
        <span className="gr-viz-route-marker" style={{ left: `${fill * 100}%` }}>{icon}</span>
        {times > 1.05 ? <span className="gr-viz-times" style={{ left: `${fill * 100}%` }}>×{times >= 10 ? Math.round(times) : times.toFixed(1)}</span> : null}
      </div>
    </div>
  );
}

function VizSpace({ fraction, times, icon }) {
  const fill = Math.min(Math.max(fraction, 0), 1);
  return (
    <div className="gr-viz-space" role="img" aria-label="Climb from the ground to the target">
      <span className="gr-viz-space-target">{icon}</span>
      <div className="gr-viz-space-track">
        <span className="gr-viz-space-dot" style={{ bottom: `${fill * 100}%` }} />
        {times > 1.05 ? <span className="gr-viz-space-times">×{times.toFixed(1)}</span> : null}
      </div>
      <span className="gr-viz-space-ground">🌍</span>
    </div>
  );
}

function VizPeaks({ count }) {
  const peaks = Array.from({ length: count });
  return (
    <div className="gr-viz-peaks" role="img" aria-label={`${count} mountains`}>
      {peaks.map((_, i) => (
        <svg key={i} viewBox="0 0 40 32" className="gr-viz-peak">
          <path d="M4 28 L20 4 L36 28 Z" />
          <path d="M15 13 L20 4 L25 13 L21 16 L18 14 Z" className="gr-viz-peak-snow" />
        </svg>
      ))}
    </div>
  );
}

function VizGrid({ count, icon }) {
  const cells = Array.from({ length: count });
  return (
    <div className={`gr-viz-grid gr-viz-grid--${icon}`} role="img" aria-label={`${count} units`}>
      {cells.map((_, i) => (
        <span key={i} className="gr-viz-cell" data-alt={icon === "daynight" && i % 2 === 1 ? "1" : undefined} />
      ))}
    </div>
  );
}

function CardViz({ viz }) {
  if (!viz || viz.kind === "none") return null;
  switch (viz.kind) {
    case "ring": return <VizRing {...viz} />;
    case "route": return <VizRoute {...viz} />;
    case "space": return <VizSpace {...viz} />;
    case "peaks": return <VizPeaks {...viz} />;
    case "grid": return <VizGrid {...viz} />;
    default: return null;
  }
}

/* Sticky full-screen chapter: the year ticks forward while cumulative km and
   moving hours climb over a rising area chart. One screen of scroll per year. */
function YearEvolution({ years }) {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);

  const milestones = useMemo(
    () => [{ year: years[0].year - 1, cumulative_km: 0, cumulative_moving_hours: 0, runs: 0 }, ...years],
    [years]
  );
  const segments = milestones.length - 1;
  const position = Math.min(progress * segments, segments - 1e-6);
  const index = Math.floor(position);
  const local = easeInOut(position - index);
  const from = milestones[index];
  const to = milestones[index + 1];
  const km = from.cumulative_km + (to.cumulative_km - from.cumulative_km) * local;
  const hours = from.cumulative_moving_hours + (to.cumulative_moving_hours - from.cumulative_moving_hours) * local;
  const year = Math.round(from.year + (to.year - from.year) * local);
  const hue = 200 + (position / segments) * 160;

  // Rising area chart behind the numbers: cumulative km over the years.
  const maxKm = milestones[milestones.length - 1].cumulative_km || 1;
  const chartPoints = milestones
    .map((m, i) => `${(i / segments) * 100},${100 - (m.cumulative_km / maxKm) * 100}`)
    .join(" ");
  const markerX = (position / segments) * 100;

  return (
    <section ref={ref} className="gr-evolution" style={{ height: `${(segments + 0.6) * 100}vh` }}>
      <div
        className="gr-evolution-sticky"
        style={{ background: `linear-gradient(160deg, hsl(${hue} 65% 12%) 0%, hsl(${hue + 40} 70% 22%) 100%)` }}
      >
        <svg className="gr-evolution-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polygon points={`0,100 ${chartPoints} 100,100`} className="gr-evolution-area" />
          <polyline points={chartPoints} className="gr-evolution-line" />
          <line x1={markerX} y1="0" x2={markerX} y2="100" className="gr-evolution-marker" />
        </svg>
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
  const hasViz = card.viz && card.viz.kind !== "none";
  return (
    <article className={`gr-card ${hasViz ? "gr-card--viz" : ""}`} style={{ background: CARD_PALETTES[index % CARD_PALETTES.length] }}>
      <div className="gr-card-main">
        <CountUp value={card.value} decimals={card.decimals} suffix={card.suffix || ""} className="gr-card-number" />
        <p className="gr-card-label">{card.label}</p>
        <p className="gr-card-caption">{card.caption}</p>
        <p className="gr-card-source">Source: {card.source}</p>
      </div>
      {hasViz ? <div className="gr-card-viz"><CardViz viz={card.viz} /></div> : null}
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
          <div className="gr-total"><CountUp value={totals.moving_hours} /><span className="gr-total-label">hours moving</span></div>
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
