import { useEffect, useState } from "react";
import AccountMenu from "../../components/AccountMenu.jsx";
import { signedIn, login } from "./api.js";
import OverallStats from "./OverallStats.jsx";
import RunningStory from "./RunningStory.jsx";
import "./garmin-stats.css";

const TABS = [
  { id: "overall", label: "Overall stats" },
  { id: "story", label: "My stats animated" },
];

export default function GarminStats({ onHome }) {
  const [tab, setTab] = useState("overall");

  useEffect(() => {
    if (!signedIn()) login();
  }, []);

  if (!signedIn()) {
    return <p role="status" className="garmin-loading">Opening sign in...</p>;
  }

  return (
    <div className={`garmin-app ${tab === "story" ? "garmin-app--story" : ""}`}>
      <header className="garmin-header">
        <button type="button" className="garmin-home" onClick={onHome} aria-label="Back to the gallery">
          ←
        </button>
        <div className="garmin-title">
          <span className="garmin-title-icon" aria-hidden="true">🏔️</span>
          <h1>Garmin stats</h1>
        </div>
        <nav className="garmin-tabs" aria-label="Garmin stats views">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`garmin-tab ${tab === entry.id ? "garmin-tab--active" : ""}`}
              aria-pressed={tab === entry.id}
              onClick={() => setTab(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </nav>
        <AccountMenu />
      </header>
      {tab === "overall" ? <OverallStats /> : <RunningStory />}
    </div>
  );
}
