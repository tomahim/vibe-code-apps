import { authFetch, clearToken } from "../../auth.js";

function redirectToLogin() {
  clearToken();
  const next = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState({}, "", `/login?next=${next}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

async function api(path, options) {
  const response = await authFetch(`/api/learning/${path}`, options);
  if (response.status === 401) { redirectToLogin(); throw new Error("Your session expired."); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export { api, redirectToLogin };
