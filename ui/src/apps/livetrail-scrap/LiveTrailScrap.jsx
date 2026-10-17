import { useEffect, useRef, useState } from "react";
import Profile from "./Profile.jsx";
import { BRAND_BADGE, BRAND_NAME } from "../../config/brand.js";

function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("en-US", { maximumFractionDigits: 2 }) : value;
}

function CheckpointTable({ times, showSpeed }) {
  return (
    <div className="table-scroll">
      <table className="checkpoint-table">
        <thead>
          <tr>
            <th>Checkpoint</th>
            <th>Distance</th>
            <th>D+ total</th>
            <th>Race time</th>
            <th>Segment</th>
            <th>{showSpeed ? "Speed" : "Pace"}</th>
          </tr>
        </thead>
        <tbody>
          {times.map((time, index) => {
            const pace = Number(time.pace);
            const speed = Number(time.speed);
            return (
              <tr key={`${time.checkpoint}-${index}`}>
                <td className="checkpoint-name">{time.checkpoint}</td>
                <td>{formatNumber(time.distance)} <span className="unit">km</span></td>
                <td>{formatNumber(time.cumulatedPositiveElevation)} <span className="unit">m</span></td>
                <td className="race-time">{time.cumulatedTime === "0:00" ? "—" : time.cumulatedTime}</td>
                <td>{Number(time.distancePreviousPoint) > 0
                  ? <>{formatNumber(time.distancePreviousPoint)} km <span className="unit">in</span> {time.timePreviousCheckpoint}</>
                  : "—"}</td>
                <td>{showSpeed
                  ? (speed > 0 ? <>{formatNumber(speed)} <span className="unit">km/h</span></> : "—")
                  : (pace > 0 ? <>{formatNumber(pace)}<span className="unit"> min/km</span></> : "—")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function LiveTrailScrap({ onHome }) {
  const [races, setRaces] = useState([]);
  const [raceId, setRaceId] = useState("");
  const [target, setTarget] = useState("");
  const [showSpeed, setShowSpeed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef(null);

  useEffect(() => {
    fetch("/api/apps/livetrail-scrap/races/")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the race list.");
        return response.json();
      })
      .then(({ races: availableRaces }) => {
        setRaces(availableRaces);
        setRaceId(availableRaces[0]?.id ?? "");
        setTarget(availableRaces[0]?.defaultTime ?? "");
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  async function loadEstimate(nextRaceId = raceId, nextTarget = target) {
    if (!nextRaceId || !nextTarget) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/apps/livetrail-scrap/races/${encodeURIComponent(nextRaceId)}/estimate/?target=${encodeURIComponent(nextTarget)}`,
        { signal: controller.signal },
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not fetch race estimates.");
      setData(body);
    } catch (loadError) {
      if (loadError.name === "AbortError") return;
      setData(null);
      setError(loadError.message);
    } finally {
      if (requestRef.current === controller) setLoading(false);
    }
  }

  useEffect(() => {
    if (raceId && target) loadEstimate(raceId, target);
    // Selecting a race should immediately load its default finish time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceId]);

  function changeRace(event) {
    const selected = races.find((race) => race.id === event.target.value);
    setData(null);
    setRaceId(selected?.id ?? "");
    setTarget(selected?.defaultTime ?? "");
  }

  function submit(event) {
    event.preventDefault();
    loadEstimate();
  }

  const selectedRace = races.find((race) => race.id === raceId);

  return (
    <main className="estimator-page">
      <header className="site-header estimator-header">
        <button className="brand brand-button" onClick={onHome}>
          <span className="brand-mark">{BRAND_BADGE}</span><span>{BRAND_NAME}</span>
        </button>
        <button className="back-link" onClick={onHome}>← All tools</button>
      </header>

      <section className="estimator-hero">
        <div className="hero-copy">
          <p className="eyebrow">TRAIL RUNNING · RACE PLANNER</p>
          <h1>LiveTrail <span>race estimator</span></h1>
          <p>Turn your goal finish time into a checkpoint-by-checkpoint plan.</p>
        </div>
        <div className="hero-landscape" aria-hidden="true">
          <div className="sun" />
          <div className="ridge ridge-back" />
          <div className="ridge ridge-front" />
          <div className="ridge ridge-low" />
        </div>
      </section>

      <form className="control-card" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Choose a race</span>
          <select value={raceId} onChange={changeRace} disabled={!races.length}>
            {races.map((race) => <option key={race.id} value={race.id}>{race.title}</option>)}
          </select>
          {selectedRace && <a className="source-link" href={selectedRace.website} target="_blank" rel="noreferrer">LiveTrail race page ↗</a>}
        </label>
        <label className="field">
          <span className="field-label">Target finish time</span>
          <span className="time-input-wrap">
            <input
              aria-label="Finish time in hours and minutes"
              inputMode="numeric"
              pattern="[0-9]{1,3}:[0-5][0-9]"
              placeholder="HH:MM"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            />
            <span>HH:MM</span>
          </span>
          <span className="field-help">Set a finish goal to estimate each checkpoint.</span>
        </label>
        <button className="primary-button" type="submit" disabled={!raceId || loading}>
          {loading ? <><span className="spinner" /> Loading</> : "Build my race plan"}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </form>

      {error && <div role="alert" className="error-banner">{error}</div>}

      {data && (
        <>
          <section className="results-heading">
            <div>
              <p className="eyebrow">YOUR RACE PLAN</p>
              <h2>{data.title}</h2>
              <p className="results-subtitle">Checkpoint estimates for a <strong>{data.targetTime}</strong> finish</p>
            </div>
            <label className="speed-toggle">
              <span>Show speed</span>
              <input type="checkbox" checked={showSpeed} onChange={(event) => setShowSpeed(event.target.checked)} />
              <span className="toggle-track" aria-hidden="true"><i /></span>
              <span>km/h</span>
            </label>
          </section>
          <CheckpointTable times={data.times} showSpeed={showSpeed} />
          <Profile profileHtml={data.profileHtml} times={data.times} />
          <p className="data-credit">Race information provided by <a href={selectedRace?.website} target="_blank" rel="noreferrer">LiveTrail</a>.</p>
        </>
      )}
      {!data && !loading && !error && raceId && <div className="loading-placeholder">Choose your target time, then build your race plan.</div>}
    </main>
  );
}
