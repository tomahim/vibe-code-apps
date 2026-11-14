// REST client for the DB-backed music library API (api/apps/music_library).
// Reads are open (same as the other tailnet app APIs); writes go through
// authFetch, which attaches the signed-in user's JWT when present.

import { authFetch, getToken } from "../../auth.js";

const API = "/api/apps/music-library";

async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Library request failed (${response.status})`);
  }
  return data;
}

export function signedIn() {
  return Boolean(getToken());
}

export async function fetchTracks({ q = "", category = "", page = 1, signal } = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (category) params.set("category", category);
  params.set("page", String(page));
  const response = await fetch(`${API}/tracks/?${params}`, { signal });
  return parse(response);
}

export async function fetchTrack(id, signal) {
  const response = await fetch(`${API}/tracks/${id}/`, { signal });
  return parse(response);
}

export async function fetchCategories(signal) {
  const response = await fetch(`${API}/categories/`, { signal });
  return parse(response);
}

export async function createTrack(payload) {
  const response = await authFetch(`${API}/tracks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parse(response);
}

export async function updateTrack(id, payload) {
  const response = await authFetch(`${API}/tracks/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parse(response);
}

export async function fetchVersions(id, signal) {
  const response = await fetch(`${API}/tracks/${id}/versions/`, { signal });
  return parse(response);
}

export async function fetchVersion(id, versionId) {
  const response = await fetch(`${API}/tracks/${id}/versions/${versionId}/`);
  return parse(response);
}

export async function restoreVersion(id, versionId) {
  const response = await authFetch(`${API}/tracks/${id}/versions/${versionId}/restore/`, {
    method: "POST",
  });
  return parse(response);
}
