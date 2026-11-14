// REST client for the Garmin stats API (api/apps/garmin/stats.py).
// Stats are personal data: every call goes through authFetch with the
// signed-in user's JWT, and a 401 bounces to the login page like Hockey.

import { authFetch, clearToken, getToken } from "../../auth.js";

const ROOT = "/api/apps/garmin/stats";

export function signedIn() {
  return Boolean(getToken());
}

export function login() {
  if (window.location.pathname === "/login") return;
  window.history.replaceState({}, "", `/login?next=${encodeURIComponent(window.location.pathname)}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

async function get(path) {
  const response = await authFetch(ROOT + path);
  if (response.status === 401) {
    clearToken();
    login();
    throw new Error("Please sign in again.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Could not load your Garmin stats. Try again.");
  }
  return data;
}

export function fetchOverview(signal) {
  return get("/overview/");
}

export function fetchRunning(signal) {
  return get("/running/");
}
