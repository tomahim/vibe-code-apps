import { useEffect, useRef, useState } from "react";

const BASE = "/apps/little-notes";
const views = new Set(["default", "database", "table", "cards", "calendar"]);
export function readNotesRoute(search = window.location.search) {
  const p = new URLSearchParams(search);
  const month = p.get("month") || "";
  const page = Number(p.get("page") || 1);
  return { type: (p.get("type") || "").slice(0, 64), category: p.has("category") ? p.get("category").slice(0, 100) : "inbox",
    tag: (p.get("tag") || "").slice(0, 100), q: (p.get("q") || "").slice(0, 200),
    month: /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : "", page: Number.isInteger(page) && page > 0 && page <= 10000 ? page : 1,
    view: views.has(p.get("view")) ? p.get("view") : "default", item: (p.get("item") || "").slice(0, 64), admin: p.get("admin") === "1" };
}
export function notesUrl(route) {
  const p = new URLSearchParams();
  for (const key of ["type", "category", "tag", "q", "month", "view", "item"]) {
    if (route[key] || key === "category") p.set(key, route[key]);
  }
  if (route.page > 1) p.set("page", route.page);
  if (route.admin) p.set("admin", "1");
  return BASE + (p.size ? "?" + p : "");
}
export function useNotesRoute() {
  const [route, setRoute] = useState(readNotesRoute);
  const skip = useRef(false); const first = useRef(true); const lastQuery = useRef(route.q);
  useEffect(() => {
    const pop = () => { skip.current = true; setRoute(readNotesRoute()); };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    const url = notesUrl(route);
    if (skip.current) { skip.current = false; lastQuery.current = route.q; return; }
    const replace = first.current || lastQuery.current !== route.q;
    first.current = false; lastQuery.current = route.q;
    if (url !== window.location.pathname + window.location.search) window.history[replace ? "replaceState" : "pushState"]({}, "", url);
  }, [route]);
  function setter(key) { return value => setRoute(old => ({ ...old, [key]: typeof value === "function" ? value(old[key]) : value })); }
  return { route, setRoute, setter };
}
