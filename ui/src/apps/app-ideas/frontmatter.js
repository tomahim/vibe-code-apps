// Parses the small frontmatter block used by idea markdown files.
// Supports `key: value`, `key: [A, B]` lists and integer values.

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    const list = value.match(/^\[(.*)\]$/);
    if (list) {
      value = list[1].split(',').map((item) => item.trim()).filter(Boolean);
    } else if (/^\d+$/.test(value)) {
      value = Number(value);
    }
    meta[kv[1]] = value;
  }
  return { meta, body: match[2].trim() };
}
