import { useCallback, useEffect, useMemo, useState } from "react";
import { BRAND_BADGE, BRAND_NAME } from "../../config/brand.js";
import { authFetch, clearToken, getToken } from "../../auth.js";
import AccountMenu from "../../components/AccountMenu.jsx";
import {
  SORTS,
  appendSnapshot,
  formatBytes,
  formatCompact,
  formatNumber,
  formatPercent,
  loadHistory,
  loadLimitGb,
  relativeTime,
  saveHistory,
  saveLimitGb,
  sparklinePoints,
  unusedIndexes,
  usageLevel,
  visibleTables,
} from "./dashboard-utils.js";
import "./db-dashboard.css";

const GB = 1024 ** 3;
const PARTS = [
  { key: "table_bytes", label: "Table data", color: "var(--c-table)" },
  { key: "index_bytes", label: "Indexes", color: "var(--c-index)" },
  { key: "toast_bytes", label: "Large values (TOAST)", color: "var(--c-toast)" },
];

function goToLogin() {
  window.history.replaceState({}, "", "/login");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function Gauge({ size, limit, totals }) {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const scale = limit || size || 1;
  const parts = [
    ...PARTS.map((part) => ({ ...part, bytes: totals[part.key] })),
    { key: "system_bytes", label: "System", color: "var(--c-system)", bytes: totals.system_bytes },
  ];
  let offset = 0;
  const arcs = parts.map((part) => {
    const length = Math.max((part.bytes / scale) * circumference, 0);
    const arc = { ...part, length, offset };
    offset += length;
    return arc;
  });
  const fraction = limit ? size / limit : null;
  return (
    <div className={`dbd-gauge dbd-${usageLevel(fraction)}`} role="img" aria-label={`Database size ${formatBytes(size)}${limit ? `, ${formatPercent(fraction)} of ${formatBytes(limit)}` : ""}`}>
      <svg viewBox="0 0 220 220">
        <circle className="dbd-gauge-track" cx="110" cy="110" r={radius} />
        <g transform="rotate(-90 110 110)">
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              className="dbd-gauge-arc"
              cx="110"
              cy="110"
              r={radius}
              style={{ stroke: arc.color }}
              strokeDasharray={`${Math.max(arc.length - 1, 0)} ${circumference}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </g>
      </svg>
      <div className="dbd-gauge-center">
        <span className="dbd-gauge-value">{formatBytes(size)}</span>
        <span className="dbd-gauge-sub">{limit ? `${formatPercent(fraction)} of ${formatBytes(limit)}` : "total on disk"}</span>
      </div>
    </div>
  );
}

function StackBar({ item, max, thin }) {
  const width = max ? Math.max((item.total_bytes / max) * 100, 1.5) : 0;
  return (
    <div className={`dbd-stack${thin ? " thin" : ""}`}>
      <div className="dbd-stack-fill" style={{ width: `${width}%` }}>
        {PARTS.map((part) =>
          item[part.key] ? <span key={part.key} style={{ flexGrow: item[part.key], background: part.color }} title={`${part.label}: ${formatBytes(item[part.key])}`} /> : null,
        )}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <ul className="dbd-legend">
      {PARTS.map((part) => (
        <li key={part.key}><i style={{ background: part.color }} />{part.label}</li>
      ))}
    </ul>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div className="dbd-stat">
      <span className="dbd-stat-label">{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </div>
  );
}

function AllowanceControl({ serverLimit, limitGb, onChange }) {
  const [draft, setDraft] = useState(limitGb ? String(limitGb) : "");
  if (serverLimit) {
    return <p className="dbd-allowance-note">Allowance set by the server: <strong>{formatBytes(serverLimit)}</strong>.</p>;
  }
  function submit(event) {
    event.preventDefault();
    const value = Number(draft.replace(",", "."));
    onChange(value > 0 ? value : null);
  }
  return (
    <form className="dbd-allowance" onSubmit={submit}>
      <label htmlFor="dbd-limit">Plan storage allowance (GB)</label>
      <div>
        <input id="dbd-limit" inputMode="decimal" placeholder="e.g. 0.5" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button type="submit">Set</button>
      </div>
      <small>Kept in this browser only. Check the figure on your Neon plan page; it is not read from Neon.</small>
    </form>
  );
}

function Growth({ history }) {
  const first = history[0];
  const last = history[history.length - 1];
  const points = sparklinePoints(history, 320, 72);
  return (
    <section className="dbd-card dbd-growth">
      <header><h2>Growth seen from here</h2></header>
      {history.length < 2 ? (
        <p className="dbd-muted">Each visit adds a point in this browser. Come back later to see how fast the database grows.</p>
      ) : (
        <>
          <svg viewBox="0 0 320 72" className="dbd-spark" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={points} fill="none" />
          </svg>
          <p className="dbd-muted">
            {history.length} visits, {relativeTime(new Date(first.t).toISOString())} to now:{" "}
            <strong>{last.bytes >= first.bytes ? "+" : "-"}{formatBytes(Math.abs(last.bytes - first.bytes))}</strong>
          </p>
        </>
      )}
      <small className="dbd-muted">Not stored on the server: only visits from this browser.</small>
    </section>
  );
}

function TableRow({ table, max, open, onToggle }) {
  return (
    <li className={`dbd-table-row${open ? " open" : ""}`}>
      <button type="button" className="dbd-table-main" onClick={onToggle} aria-expanded={open}>
        <span className="dbd-table-name">
          <code>{table.name}</code>
          <em>{table.group}</em>
        </span>
        <span className="dbd-table-size">{formatBytes(table.total_bytes)}</span>
        <span className="dbd-table-rows">{formatNumber(table.rows)}<small>{table.rows_exact ? " rows" : " rows (est.)"}</small></span>
        <StackBar item={table} max={max} thin />
      </button>
      {open && (
        <dl className="dbd-table-detail">
          <div><dt>Table data</dt><dd>{formatBytes(table.table_bytes)}</dd></div>
          <div><dt>Indexes ({table.index_count})</dt><dd>{formatBytes(table.index_bytes)}</dd></div>
          <div><dt>TOAST</dt><dd>{formatBytes(table.toast_bytes)}</dd></div>
          <div><dt>Dead rows</dt><dd>{formatNumber(table.dead_rows)}</dd></div>
          <div><dt>Inserts / updates / deletes</dt><dd>{formatCompact(table.inserts)} / {formatCompact(table.updates)} / {formatCompact(table.deletes)}</dd></div>
          <div><dt>Seq / index scans</dt><dd>{formatCompact(table.seq_scans)} / {formatCompact(table.index_scans)}</dd></div>
          <div><dt>Last vacuum</dt><dd>{relativeTime(table.last_vacuum)}</dd></div>
          <div><dt>Last analyze</dt><dd>{relativeTime(table.last_analyze)}</dd></div>
        </dl>
      )}
    </li>
  );
}

export default function DbDashboard({ onHome }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [limitGb, setLimitGb] = useState(loadLimitGb);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [sort, setSort] = useState("size");
  const [openTable, setOpenTable] = useState(null);
  const [showAllIndexes, setShowAllIndexes] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authFetch("/api/apps/db-dashboard/overview");
      if (response.status === 401) {
        clearToken();
        goToLogin();
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not load the dashboard.");
      setData(body);
      const now = Date.now();
      setFetchedAt(now);
      setHistory((current) => {
        const next = appendSnapshot(current, { t: now, bytes: body.database.size_bytes });
        saveHistory(next);
        return next;
      });
    } catch (err) {
      setError(err.message || "Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      goToLogin();
      return;
    }
    load();
  }, [load]);

  const tables = useMemo(() => (data ? visibleTables(data.tables, { query, group, sort }) : []), [data, query, group, sort]);
  const unused = useMemo(() => (data ? unusedIndexes(data.indexes) : []), [data]);

  const limit = data ? data.storage_limit_bytes || (limitGb ? Math.round(limitGb * GB) : null) : null;
  const maxTable = data && data.tables.length ? data.tables[0].total_bytes : 0;
  const maxGroup = data && data.groups.length ? data.groups[0].bytes : 0;
  const shownIndexes = data ? (showAllIndexes ? data.indexes : data.indexes.slice(0, 8)) : [];

  function updateLimit(value) {
    saveLimitGb(value);
    setLimitGb(value);
  }

  return (
    <main className="dbd-page">
      <header className="dbd-header">
        <a className="dbd-brand" href="/" onClick={(e) => { e.preventDefault(); onHome(); }} aria-label={`${BRAND_NAME} home`}>
          <span>{BRAND_BADGE}</span>
          <b>{BRAND_NAME}</b>
        </a>
        <div className="dbd-header-actions">
          <button type="button" className="dbd-refresh" onClick={load} disabled={loading}>{loading ? "Reading…" : "Refresh"}</button>
          <AccountMenu />
        </div>
      </header>

      <section className="dbd-intro">
        <p className="dbd-eyebrow">DATABASE DASHBOARD</p>
        <h1>{data ? data.database.name : "Production database"}</h1>
        <p className="dbd-muted">
          {data
            ? `PostgreSQL ${data.database.version} · read ${relativeTime(new Date(fetchedAt).toISOString())} · read-only, no row contents shown`
            : "Size, tables, rows and indexes. Read-only."}
        </p>
      </section>

      {error && (
        <div className="dbd-error" role="alert">
          <strong>{error}</strong>
          <button type="button" onClick={load}>Try again</button>
        </div>
      )}
      {!data && !error && <div className="dbd-loading" aria-busy="true">Reading the database…</div>}

      {data && (
        <>
          <section className="dbd-hero">
            <div className="dbd-card dbd-gauge-card">
              <Gauge size={data.database.size_bytes} limit={limit} totals={data.totals} />
              <ul className="dbd-legend dbd-legend-gauge">
                {PARTS.map((part) => (
                  <li key={part.key}><i style={{ background: part.color }} />{part.label}<b>{formatBytes(data.totals[part.key])}</b></li>
                ))}
                <li><i style={{ background: "var(--c-system)" }} />System and catalogs<b>{formatBytes(data.totals.system_bytes)}</b></li>
              </ul>
              {limit && data.database.size_bytes / limit >= 0.7 && (
                <p className="dbd-alert">{formatPercent(data.database.size_bytes / limit, 0)} of the allowance is used.</p>
              )}
              <AllowanceControl serverLimit={data.storage_limit_bytes} limitGb={limitGb} onChange={updateLimit} />
            </div>

            <div className="dbd-stats">
              <Stat label="Tables" value={formatNumber(data.totals.tables)} hint={`${formatNumber(data.totals.indexes)} indexes`} />
              <Stat label="Rows" value={formatNumber(data.totals.rows)} hint="exact counts" />
              <Stat label="Cache hit" value={formatPercent(data.database.cache_hit_ratio)} hint="since stats reset" />
              <Stat label="Connections" value={formatNumber(data.database.connections)} hint="to this database" />
              <Stat label="Compute started" value={relativeTime(data.database.server_started_at)} hint="Neon suspends when idle" />
              <Stat label="Rollbacks" value={formatNumber(data.database.rollbacks)} hint={`${formatCompact(data.database.commits)} commits`} />
            </div>
          </section>

          <div className="dbd-grid">
            <section className="dbd-card">
              <header><h2>By app</h2><Legend /></header>
              <ul className="dbd-groups">
                {data.groups.map((entry) => (
                  <li key={entry.name}>
                    <button type="button" className={group === entry.name ? "active" : ""} onClick={() => { setGroup(group === entry.name ? "all" : entry.name); document.getElementById("dbd-tables")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                      <span className="dbd-group-name">{entry.name}</span>
                      <span className="dbd-group-size">{formatBytes(entry.bytes)}</span>
                      <span className="dbd-group-meta">{entry.tables} {entry.tables === 1 ? "table" : "tables"} · {formatNumber(entry.rows)} rows</span>
                      <StackBar item={{ ...entry, total_bytes: entry.bytes }} max={maxGroup} thin />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            <Growth history={history} />
          </div>

          <section className="dbd-card" id="dbd-tables">
            <header className="dbd-tables-head">
              <h2>Tables <small>{tables.length} of {data.tables.length}</small></h2>
              <Legend />
            </header>
            <div className="dbd-controls">
              <input type="search" placeholder="Search tables or apps" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search tables" />
              <select value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Filter by app">
                <option value="all">All apps</option>
                {data.groups.map((entry) => <option key={entry.name} value={entry.name}>{entry.name}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tables">
                {Object.entries(SORTS).map(([key, entry]) => <option key={key} value={key}>Sort: {entry.label}</option>)}
              </select>
            </div>
            {tables.length === 0 ? (
              <p className="dbd-muted dbd-empty">No table matches.</p>
            ) : (
              <ul className="dbd-table-list">
                {tables.map((table) => (
                  <TableRow key={table.name} table={table} max={maxTable} open={openTable === table.name} onToggle={() => setOpenTable(openTable === table.name ? null : table.name)} />
                ))}
              </ul>
            )}
          </section>

          <section className="dbd-card">
            <header className="dbd-tables-head">
              <h2>Largest indexes <small>{data.indexes.length} total</small></h2>
            </header>
            <ul className="dbd-index-list">
              {shownIndexes.map((index) => (
                <li key={index.name}>
                  <span><code>{index.name}</code><em>{index.table}</em></span>
                  <b>{formatBytes(index.bytes)}</b>
                  <small>{index.primary ? "primary key" : index.unique ? "unique" : index.scans === 0 ? "unused so far" : `${formatCompact(index.scans)} scans`}</small>
                </li>
              ))}
            </ul>
            <button type="button" className="dbd-more" onClick={() => setShowAllIndexes(!showAllIndexes)}>
              {showAllIndexes ? "Show fewer" : `Show all ${data.indexes.length}`}
            </button>
            <p className="dbd-muted dbd-footnote">
              {unused.length} non-unique indexes have no recorded scan ({formatBytes(unused.reduce((sum, i) => sum + i.bytes, 0))}). Statistics reset when the compute restarts, so check before dropping any.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
