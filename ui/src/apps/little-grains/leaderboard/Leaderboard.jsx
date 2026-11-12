import { useEffect, useState } from "react";
import { api } from "../api.js";

const REWARD_COPY = {
  drops: {
    title: "How Drops are earned",
    description: "You earn 1 Drop when you first finish a card, 5 more when you have read every card in a lesson, and 100 more when you complete a learning path. Each reward is earned once.",
  },
  carrots: {
    title: "How Carrots are earned",
    description: "You earn 1 Carrot the first time you answer each question correctly, in a lesson or a Practice quiz. Wrong answers and repeated correct answers earn no extra Carrots.",
  },
};

function RewardInfo({ currency, onClose }) {
  const reward = REWARD_COPY[currency];
  return <div className="grains-reward-dismiss" onClick={onClose}>
    <section className="grains-reward-popover" role="dialog" aria-label={reward.title} onClick={(event) => event.stopPropagation()}>
      <div><span aria-hidden="true">{currency === "drops" ? "💧" : "🥕"}</span><h2>{reward.title}</h2><button onClick={onClose} aria-label="Close reward information">×</button></div>
      <p>{reward.description}</p>
    </section>
  </div>;
}


function niceCeil(value) {
  // Even maximum so the 0/mid/max gridlines always land on integers.
  const max = Math.max(2, Math.ceil(value));
  return max % 2 ? max + 1 : max;
}

function EvolutionChart({ chart, currency, onOpenBadges }) {
  if (!chart || !chart.buckets?.length || !chart.series?.length) return null;
  const width = 360, height = 190, padL = 30, padR = 34, padT = 14, padB = 26;
  const now = Date.now();
  // Never plot the future, and skip leading buckets where nobody had earned
  // anything yet - even if the API still sends the full calendar window.
  let end = chart.buckets.findIndex((b) => Date.parse(b.start) > now);
  if (end === -1) end = chart.buckets.length;
  let first = 0;
  while (first < end - 1 && chart.series.every((s) => !s.points[first])) first++;
  const buckets = chart.buckets.slice(first, end);
  const n = buckets.length;
  const pointsOf = (s) => s.points.slice(first, end);
  const max = niceCeil(Math.max(1, ...chart.series.flatMap((s) => pointsOf(s))));
  const x = (i) => padL + (n === 1 ? (width - padL - padR) / 2 : (i * (width - padL - padR)) / (n - 1));
  const y = (v) => padT + (1 - v / max) * (height - padT - padB);
  // Thomas's steering: the signed-in learner is always the blue line, every
  // other learner a thinner continuous orange one.
  const accent = "var(--blue)";
  const line = (points) => points.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const current = buckets.findIndex((b) => Date.parse(b.start) <= now && now < Date.parse(b.end));
  const self = chart.series.find((s) => s.is_self);
  const others = chart.series.filter((s) => !s.is_self);
  const ordered = [...others, ...(self ? [self] : [])];
  const colorOf = (s) => (s.is_self ? "var(--blue)" : "var(--orange)");
  const periodLabel = chart.period === "weekly" ? "day by day" : chart.period === "monthly" ? "week by week" : "month by month";
  const gridValue = (f) => max * f;
  return <section className="grains-chart">
    <div className="grains-chart-head"><h3>{currency === "badges" ? "🏅 Badges growth" : `${currency === "drops" ? "💧" : "🥕"} Growth`}</h3><span>Cumulative · {periodLabel}</span></div>
    {onOpenBadges && <button type="button" className="grains-chart-link" onClick={onOpenBadges}>See badges</button>}
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${currency} growth, ${periodLabel}`}>
      <defs><linearGradient id="grains-chart-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accent} stopOpacity="0.22" /><stop offset="100%" stopColor={accent} stopOpacity="0" />
      </linearGradient></defs>
      {[0, 0.5, 1].map((f) => <g key={f}>
        <line x1={padL} x2={width - padR} y1={y(max * f)} y2={y(max * f)} className="grains-chart-grid" />
        <text x={padL - 6} y={y(max * f) + 3} className="grains-chart-y" textAnchor="end">{gridValue(f)}</text>
      </g>)}
      {current >= 0 && <line x1={x(current)} x2={x(current)} y1={padT} y2={height - padB} className="grains-chart-today" />}
      {self && <polygon className="grains-chart-area" points={`${x(0)},${y(0)} ${line(pointsOf(self))} ${x(n - 1)},${y(0)}`} />}
      {ordered.map((s) => <polyline key={s.name} className="grains-chart-line" style={{ color: colorOf(s) }} points={line(pointsOf(s))} strokeWidth={s.is_self ? 2.6 : 1.4} strokeLinecap="round" fill="none" />)}
      {self && pointsOf(self).map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === n - 1 ? 4 : 2.4} className="grains-chart-dot" style={{ color: accent }} />)}
      {others.map((s) => <circle key={`${s.name}-latest`} cx={x(n - 1)} cy={y(pointsOf(s)[n - 1])} r={2.6} className="grains-chart-dot" style={{ color: colorOf(s) }} />)}
      {self && <text x={x(n - 1) + 7} y={y(pointsOf(self)[n - 1]) + 3} className="grains-chart-total" style={{ color: accent }}>{pointsOf(self)[n - 1]}</text>}
      {buckets.map((b, i) => (n <= 8 || i % Math.ceil(n / 6) === 0 || i === n - 1) && <text key={`${b.label}-${i}`} x={x(i)} y={height - 8} className="grains-chart-x" textAnchor="middle">{b.label}</text>)}
    </svg>
    <ul className="grains-chart-legend">{ordered.map((s) => <li key={s.name}><span aria-hidden="true" style={{ background: colorOf(s) }}></span>{s.name}{s.is_self && <small>YOU</small>}</li>)}</ul>
  </section>;
}

function BadgesStreak({ onOpenBadges }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true; setData(null); setError("");
    api("leaderboard/badges/").then((result) => { if (active) setData(result); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);
  const formatRange = (streak) => {
    if (!streak.start) return "";
    const fmt = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" });
    return `${fmt(streak.start)} \u2013 ${fmt(streak.end)}`;
  };
  return <>
    {error && <p className="grains-error" role="alert">{error}</p>}
    {!data && !error && <p className="grains-loading">Gathering the badges…</p>}
    {data && <><p className="grains-leaderboard-note">All time · Paris time</p>
      <ol className="grains-ranking">{data.rows.map((row) => <li key={`${row.rank}-${row.name}`} className={row.is_self ? "self" : ""}><span className="rank">{row.rank}</span><span className="avatar" aria-hidden="true">{row.name.slice(0, 1).toUpperCase()}</span><span className="name">{row.name}{row.is_self && <small>YOU</small>}
        <small className="detail">{row.longest_streak.days > 0 ? `🔥 Best streak ${row.longest_streak.days} days (${formatRange(row.longest_streak)}) · now ${row.current_streak.days}${row.current_streak.lit ? "" : " 🥶"}` : "No streak yet"}</small>
        <small className="detail">🌱 {row.cards_read} cards · ✅ {row.correct} correct{row.accuracy !== null ? ` (${row.accuracy}%)` : ""}{row.latest_badge ? ` · Latest: ${row.latest_badge.name}` : ""}</small>
      </span><strong>{row.badges}</strong></li>)}</ol>
      {data.rows.length === 0 && <p className="grains-empty-ranking">No badges earned yet. The first one is waiting for you.</p>}
      <EvolutionChart chart={data.chart} currency="badges" onOpenBadges={onOpenBadges} />
      {data.self && <div className="grains-self-rank"><span>Your badges rank</span><strong>#{data.self.rank} · {data.self.badges} {data.self.badges === 1 ? "badge" : "badges"}</strong></div>}
    </>}
  </>;
}

function Leaderboard({ onClose, onOpenBadges }) {
  // Three tabs: Drops, Carrots and Badges & streak. The rewards tabs share
  // the currency state; "badges" swaps in its own view and fetch.
  const [currency, setCurrency] = useState("drops");
  const [period, setPeriod] = useState("weekly");
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (currency === "badges") return undefined;
    let active = true; setData(null); setError("");
    api(`leaderboard/?currency=${currency}&period=${period}&offset=${offset}`).then((result) => { if (active) setData(result); }).catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [currency, period, offset]);
  const step = period === "weekly" ? "week" : "month";
  return <div className="grains-modal-backdrop leaderboard-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="grains-leaderboard" role="dialog" aria-modal="true" aria-label="Leaderboard"><div className="grains-leaderboard-head"><div><p>THE GARDEN GROWS TOGETHER</p><h2>Leaderboard</h2></div><button className="grains-close" onClick={onClose} aria-label="Close leaderboard">×</button></div>
      <div className="grains-segment three" aria-label="Leaderboard tab"><button className={currency === "drops" ? "active" : ""} onClick={() => { setCurrency("drops"); setOffset(0); }}>💧 Drops</button><button className={currency === "carrots" ? "active" : ""} onClick={() => { setCurrency("carrots"); setOffset(0); }}>🥕 Carrots</button><button className={currency === "badges" ? "active" : ""} onClick={() => setCurrency("badges")}>🏅 Badges & streak</button></div>
      {currency !== "badges" && <p className="grains-reward-description">{REWARD_COPY[currency].description}</p>}
      {currency !== "badges" && <div className="grains-period" aria-label="Ranking period">{["weekly", "monthly", "overall"].map((item) => <button key={item} className={period === item ? "active" : ""} onClick={() => { setPeriod(item); setOffset(0); }}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>}
      {currency !== "badges" && period !== "overall" && <div className="grains-period-nav">
        <button aria-label={`Older ${step}`} disabled={!data || !data.has_earlier} onClick={() => setOffset((value) => value + 1)}>‹</button>
        <span className="grains-period-label" aria-live="polite">{data?.window?.label || "…"}</span>
        <button aria-label={`Newer ${step}`} disabled={!data || offset === 0} onClick={() => setOffset((value) => value - 1)}>›</button>
      </div>}
      {currency !== "badges" && error && <p className="grains-error" role="alert">{error}</p>}
      {currency !== "badges" && !data && !error && <p className="grains-loading">Gathering the rankings…</p>}
      {currency !== "badges" && data && <><p className="grains-leaderboard-note">{period === "overall" ? "All time" : offset === 0 ? (period === "weekly" ? "Resets every Monday" : "Resets on the 1st") : "Final ranking"} · UTC</p><ol className="grains-ranking">{data.rows.map((row) => <li key={`${row.rank}-${row.name}`} className={row.is_self ? "self" : ""}><span className="rank">{row.rank}</span><span className="avatar" aria-hidden="true">{row.name.slice(0, 1).toUpperCase()}</span><span className="name">{row.name}{row.is_self && <small>YOU</small>}{row.stats && <small className="detail">{currency === "drops" ? `${row.stats.cards_read} card${row.stats.cards_read === 1 ? "" : "s"} read` : `${row.stats.attempts} attempted · ${row.stats.correct} correct${row.stats.attempts ? ` (${Math.round(100 * row.stats.correct / row.stats.attempts)}%)` : ""} · ${row.stats.wrong} wrong`}</small>}</span><strong>{row.score}</strong></li>)}</ol>{data.rows.length === 0 && <p className="grains-empty-ranking">{offset === 0 ? "The first spot is waiting for you." : `No activity this ${step}.`}</p>}<EvolutionChart chart={data.chart} currency={data.currency} /><div className="grains-self-rank"><span>Your {currency} rank</span><strong>{data.self?.rank ? `#${data.self.rank} · ${data.self.score} ${currency}` : offset > 0 ? `No activity this ${step}` : currency === "drops" ? "Read a card to join" : "Answer a question to join"}</strong></div></>}
      {currency === "badges" && <BadgesStreak onOpenBadges={onOpenBadges} />}
    </aside>
  </div>;
}

export { Leaderboard, RewardInfo };
