// Formatting helpers shared by the dashboard and the animated story.

export function formatInt(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value || 0));
}

export function formatKm(value, digits = 1) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value || 0)} km`;
}

export function formatHours(value, digits = 1) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value || 0)} h`;
}

export function formatElevation(value) {
  return `${formatInt(value)} m`;
}

export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatPace(secondsPerKm) {
  if (!secondsPerKm) return "";
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")} /km`;
}

const SPORT_ICONS = {
  running: "🏃",
  trail_running: "⛰️",
  cycling: "🚴",
  virtual_ride: "🚴",
  road_biking: "🚴",
  cyclocross: "🚴",
  walking: "🚶",
  hiking: "🥾",
  lap_swimming: "🏊",
  snorkeling: "🤿",
  resort_skiing: "⛷️",
  snow_shoe_ws: "❄️",
  hiit: "💪",
};

export function sportIcon(type) {
  return SPORT_ICONS[type] || "✨";
}
