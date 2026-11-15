import { useEffect, useMemo, useState } from "react";
import { fetchOverview } from "./api.js";
import {
  formatDate, formatElevation, formatHours, formatInt, formatKm, sportIcon,
} from "./format.js";

function Kpi({ label, value, hint }) {
  return (
    <div className="gs-kpi">
      <span className="gs-kpi-value">{value}</span>
      <span className="gs-kpi-label">{label}</span>
      {hint ? <span className="gs-kpi-hint">{hint}</span> : null}
    </div>
  );
}

function DistanceBars({ months, years, year, period }) {
  // A single year always shows its months. "All" shows the full monthly
  // timeline or one bar per year, depending on the period switch.
  const byYear = year === "all" && period === "year";
  const data = useMemo(() => {
    if (byYear) return years.map((row) => ({ key: String(row.year), label: String(row.year), km: row.km, count: row.count, hours: row.hours }));
    const rows = year === "all" ? months : months.filter((row) => row.month.startsWith(`${year}-`));
    return rows.map((row) => ({ key: row.month, label: row.month.slice(5), sub: year === "all" ? row.month.slice(0, 4) : "", km: row.km, count: row.count, hours: row.hours }));
  }, [months, years, year, byYear]);
  const max = Math.max(...data.map((row) => row.km), 1);
  if (!data.length) return <p className="gs-empty">No activities this year yet.</p>;
  return (
    <div className="gs-monthbars" role="img" aria-label={byYear ? "Distance per year" : "Distance per month"}>
      {data.map((row) => (
        <div className="gs-monthbar" key={row.key} title={`${row.key}: ${formatKm(row.km, 0)}, ${row.count} activities, ${formatHours(row.hours, 0)}`}>
          <span className="gs-monthbar-value">{Math.round(row.km)}</span>
          <div className="gs-monthbar-track">
            <div className="gs-monthbar-fill" style={{ height: `${Math.max((row.km / max) * 100, 2)}%` }} />
          </div>
          <span className="gs-monthbar-label">{row.label}</span>
          {row.sub ? <span className="gs-monthbar-year">{row.sub}</span> : null}
        </div>
      ))}
    </div>
  );
}

function WeekdayBars({ weekdays }) {
  const max = Math.max(...weekdays.map((row) => row.count), 1);
  return (
    <div className="gs-weekdays">
      {weekdays.map((row) => (
        <div className="gs-weekday" key={row.weekday}>
          <span className="gs-weekday-count">{row.count}</span>
          <div className="gs-weekday-track">
            <div className="gs-weekday-fill" style={{ height: `${Math.max((row.count / max) * 100, row.count ? 4 : 0)}%` }} />
          </div>
          <span className="gs-weekday-label">{row.weekday}</span>
        </div>
      ))}
    </div>
  );
}

function RecordCard({ title, record, metric }) {
  if (!record) return null;
  return (
    <div className="gs-record">
      <span className="gs-record-title">{title}</span>
      <span className="gs-record-value">{metric(record)}</span>
      <span className="gs-record-name">{record.name}</span>
      <span className="gs-record-meta">{record.type_label} · {formatDate(record.date)}</span>
    </div>
  );
}

export default function OverallStats() {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [year, setYear] = useState("all");
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    let live = true;
    fetchOverview()
      .then((data) => live && setState({ data, loading: false, error: "" }))
      .catch((error) => live && setState({ data: null, loading: false, error: error.message }));
    return () => { live = false; };
  }, []);

  const { data, loading, error } = state;

  const selection = useMemo(() => {
    if (!data) return null;
    if (year === "all") {
      return {
        totals: data.totals,
        types: data.by_type,
      };
    }
    const yearNum = Number(year);
    const typeRows = data.by_year_type.filter((row) => row.year === yearNum);
    const byType = data.by_type
      .map((type) => {
        const match = typeRows.find((row) => row.type === type.type);
        return match ? { ...type, count: match.count, km: match.km, hours: match.hours } : null;
      })
      .filter(Boolean);
    const yearTotals = data.by_year.find((row) => row.year === yearNum) || { count: 0, km: 0, hours: 0, elevation_m: 0 };
    return { totals: yearTotals, types: byType };
  }, [data, year]);

  if (loading) return <p role="status" className="garmin-loading">Crunching your activities…</p>;
  if (error) return <p role="alert" className="garmin-error">{error}</p>;
  if (!selection) return null;

  const years = data.by_year.map((row) => row.year);

  return (
    <main className="gs-page">
      <section className="gs-hero">
        <div>
          <p className="eyebrow">EVERY ACTIVITY, COUNTED</p>
          <h2>
            {formatInt(data.totals.count)} activities since {formatDate(data.first_activity)}
          </h2>
          <p className="gs-hero-sub">
            Running, riding, walking and everything in between — one database, all of it.
          </p>
        </div>
        <div className="gs-year-filter" role="group" aria-label="Filter by year">
          <button type="button" className={year === "all" ? "active" : ""} onClick={() => setYear("all")}>All</button>
          {years.map((entry) => (
            <button key={entry} type="button" className={String(entry) === year ? "active" : ""} onClick={() => setYear(String(entry))}>
              {entry}
            </button>
          ))}
        </div>
      </section>

      <section className="gs-kpis">
        <Kpi label="activities" value={formatInt(selection.totals.count)} />
        <Kpi label="distance" value={formatKm(selection.totals.km, 0)} />
        <Kpi label="time" value={formatHours(selection.totals.hours, 0)} />
        <Kpi label="elevation" value={formatElevation(selection.totals.elevation_m)} />
      </section>

      <section>
        <div className="gs-section-head">
          <h3 className="gs-section-title">{year === "all" ? "Distance per period" : "Distance per month"}</h3>
          {year === "all" ? (
            <div className="gs-year-filter" role="group" aria-label="Chart period">
              <button type="button" className={period === "month" ? "active" : ""} aria-pressed={period === "month"} onClick={() => setPeriod("month")}>Monthly</button>
              <button type="button" className={period === "year" ? "active" : ""} aria-pressed={period === "year"} onClick={() => setPeriod("year")}>Yearly</button>
            </div>
          ) : null}
        </div>
        <DistanceBars months={data.by_month} years={data.by_year} year={year} period={period} />
      </section>

      <section>
        <h3 className="gs-section-title">By sport</h3>
        <div className="gs-sports">
          {selection.types.map((type) => (
            <div className="gs-sport" key={type.type}>
              <span className="gs-sport-icon" aria-hidden="true">{sportIcon(type.type)}</span>
              <div className="gs-sport-body">
                <span className="gs-sport-name">{type.type_label}</span>
                <span className="gs-sport-stats">
                  {formatInt(type.count)} · {formatKm(type.km, 0)} · {formatHours(type.hours, 0)}
                </span>
              </div>
              <div
                className="gs-sport-share"
                style={{ width: `${Math.max((type.km / Math.max(selection.totals.km, 1)) * 100, 2)}%` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="gs-section-title">Highlights</h3>
        <div className="gs-records">
          <RecordCard title="Longest distance" record={data.records.longest_distance} metric={(r) => formatKm(r.km, 1)} />
          <RecordCard title="Longest time out" record={data.records.longest_duration} metric={(r) => formatHours(r.hours, 1)} />
          <RecordCard title="Biggest climb" record={data.records.most_elevation} metric={(r) => formatElevation(r.elevation_m)} />
          <div className="gs-record">
            <span className="gs-record-title">Best month</span>
            <span className="gs-record-value">{data.best_month ? formatKm(data.best_month.km, 0) : "—"}</span>
            <span className="gs-record-name">{data.best_month ? data.best_month.month : ""}</span>
            <span className="gs-record-meta">{data.best_month ? `${data.best_month.count} activities` : ""}</span>
          </div>
          <div className="gs-record">
            <span className="gs-record-title">Longest daily streak</span>
            <span className="gs-record-value">{data.streaks.longest_days} days</span>
            <span className="gs-record-name">Current: {data.streaks.current_days} day{data.streaks.current_days === 1 ? "" : "s"}</span>
            <span className="gs-record-meta">At least one activity per day</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="gs-section-title">When you move</h3>
        <WeekdayBars weekdays={data.weekdays} />
      </section>

      <section>
        <h3 className="gs-section-title">Year by year</h3>
        <div className="gs-yeartable-wrap">
          <table className="gs-yeartable">
            <thead>
              <tr>
                <th>Year</th>
                <th>Activities</th>
                <th>Distance</th>
                <th>Time</th>
                <th>Elevation</th>
                <th>Avg / activity</th>
                <th>Top sport</th>
              </tr>
            </thead>
            <tbody>
              {data.by_year.map((row) => {
                const typeRows = data.by_year_type.filter((entry) => entry.year === row.year);
                const top = typeRows.reduce((best, entry) => (entry.count > (best?.count || 0) ? entry : best), null);
                const topLabel = top ? (data.by_type.find((t) => t.type === top.type)?.type_label || top.type) : "—";
                return (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{formatInt(row.count)}</td>
                    <td>{formatKm(row.km, 0)}</td>
                    <td>{formatHours(row.hours, 0)}</td>
                    <td>{formatElevation(row.elevation_m)}</td>
                    <td>{row.count ? formatKm(row.km / row.count, 1) : "—"}</td>
                    <td>{topLabel}{top ? ` (${top.count})` : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
