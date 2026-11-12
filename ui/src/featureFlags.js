import { authFetch } from "./auth.js";

// Keys of the feature flags on for the signed-in user (GET /api/auth/me).
// Fails closed: any error, bad status or unexpected shape means no flags.
export async function fetchFeatureFlags() {
  try {
    const response = await authFetch("/api/auth/me", { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.feature_flags) ? data.feature_flags.filter((key) => typeof key === "string") : [];
  } catch {
    return [];
  }
}
