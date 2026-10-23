// Kept independent of Vite so discovery defaults and filtering can be tested.
export function createCatalog(files, metadata = {}) {
  return Object.entries(files).map(([path, load]) => {
    const slug = path.split("/").at(-1).replace(/\.html$/, "");
    const info = metadata[path.replace(/\.html$/, ".json")] || {};
    const candidate = info.date || slug.match(/^\d{4}-\d{2}-\d{2}(?=-)/)?.[0];
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(candidate || "") ? new Date(`${candidate}T00:00:00Z`) : null;
    const date = parsed && !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === candidate ? candidate : null;
    return {
      slug,
      title: typeof info.title === "string" && info.title.trim() ? info.title : slug.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      description: typeof info.description === "string" ? info.description : "A standalone web design experiment.",
      tags: [...new Set((Array.isArray(info.tags) ? info.tags : []).filter((tag) => typeof tag === "string" && tag.trim()).map((tag) => tag.trim().toLowerCase()))],
      date,
      load,
    };
  });
}

export function filterArtifacts(artifacts, { query = "", tag = "", year = "", order = "newest" } = {}) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return artifacts.filter((artifact) => {
    const haystack = [artifact.title, artifact.description, ...artifact.tags, artifact.date || ""].join(" ").toLowerCase();
    return words.every((word) => haystack.includes(word)) && (!tag || artifact.tags.includes(tag)) && (!year || artifact.date?.startsWith(year));
  }).sort((a, b) => {
    // Undated files always come last, with a deterministic title tie-breaker.
    if (!a.date && b.date) return 1;
    if (a.date && !b.date) return -1;
    const dates = (a.date || "").localeCompare(b.date || "");
    return (order === "oldest" ? dates : -dates) || a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug);
  });
}
