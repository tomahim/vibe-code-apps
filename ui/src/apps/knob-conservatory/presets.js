import { authFetch } from "../../auth.js";

const BASE = "/api/apps/knob-conservatory";

async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The workshop shelf is unreachable.");
  return data;
}

export async function listPresets() {
  return parse(await authFetch(`${BASE}/presets`));
}

export async function savePreset(name, settings) {
  return parse(await authFetch(`${BASE}/presets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, settings }),
  }));
}

export async function deletePreset(id) {
  const response = await authFetch(`${BASE}/presets/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) await parse(response);
}
