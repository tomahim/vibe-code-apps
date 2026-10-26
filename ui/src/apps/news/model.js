export const DATABASE_URL = "https://app.notion.com/p/7a3681569a5348e1afc793c68ae529b1";

export function safeLink(value) {
  try {
    const parsed = new URL(value);
    return ["https:", "http:"].includes(parsed.protocol) && !parsed.username && !parsed.password ? value : null;
  } catch { return null; }
}

export function uniqueItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    let key = item.id;
    const link = safeLink(item.url);
    if (link) {
      const url = new URL(link);
      url.hash = "";
      for (const name of [...url.searchParams.keys()]) {
        if (name.toLowerCase().startsWith("utm_") || ["fbclid", "gclid"].includes(name)) url.searchParams.delete(name);
      }
      url.pathname = url.pathname.replace(/\/$/, "");
      key = url.toString();
    }
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function latestDate(items) {
  return items.map((item) => item.added).filter(Boolean).sort().at(-1) || null;
}

export function selectItems(items, { topic, query }) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) =>
    (!topic || item.topics.includes(topic)) &&
    (!needle || [item.title, item.why_it_matters, item.author, item.source, ...item.topics].join(" ").toLowerCase().includes(needle))
  ); // Keep the server's publication-date-descending / saved-date / created-time order.
}

export function dateLabel(value) {
  if (!value) return "Date unknown";
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.valueOf()) ? "Date unknown" : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}
