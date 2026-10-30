// Visitor-initiated anonymous GitHub API reads for guest factories. No token, public repos only.
const BASE = 'https://api.github.com';

export function parseRepo(input) {
  const m = String(input || '').trim().match(/(?:github\.com\/)?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?(?:[?#].*)?$/);
  return m ? { owner: m[1], repo: m[2] } : null;
}

async function gh(path) {
  const r = await fetch(BASE + path, { headers: { Accept: 'application/vnd.github+json' } });
  if (r.status === 404) throw new Error('Repository not found — public repos only.');
  if (r.status === 403 || r.status === 429) {
    const reset = r.headers.get('x-ratelimit-reset');
    const when = reset ? new Date(+reset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    throw new Error("GitHub's anonymous rate limit was reached" + (when ? ` — it resets around ${when}.` : '. Try again later.'));
  }
  if (!r.ok) throw new Error(`GitHub answered ${r.status}. Try again later.`);
  return r.json();
}

export async function loadGuestRepo(fullName, onStep) {
  const parsed = parseRepo(fullName);
  if (!parsed) throw new Error('Use the shape owner/repo, for example mrdoob/three.js');
  const { owner, repo } = parsed;
  onStep && onStep('Reading the repository…');
  const info = await gh(`/repos/${owner}/${repo}`);
  let closed = [];
  const MAX_PAGES = 3;
  for (let page = 1; page <= MAX_PAGES; page++) {
    onStep && onStep(`Reading pull requests… page ${page}/${MAX_PAGES}`);
    const arr = await gh(`/repos/${owner}/${repo}/pulls?state=closed&per_page=100&page=${page}&sort=updated&direction=desc`);
    if (!Array.isArray(arr)) throw new Error('Unexpected answer from GitHub.');
    closed.push(...arr);
    if (arr.length < 100) break;
  }
  const merged = closed.filter(p => p.merged_at).map(p => ({
    n: p.number, t: (p.title || '').slice(0, 90), a: (p.user && p.user.login) || 'ghost',
    o: p.created_at, m: p.merged_at, b: ((p.head && p.head.ref) || '').slice(0, 40),
    c: 0, add: null, dele: null,
  }));
  if (!merged.length) throw new Error('No merged pull requests found to replay.');
  merged.sort((a, b) => +new Date(a.m) - +new Date(b.m));
  const capped = closed.length >= MAX_PAGES * 100;
  return {
    repo: info.full_name, label: info.full_name,
    snapshot: new Date().toISOString().slice(0, 10),
    firstCommit: info.created_at, lastCommit: info.pushed_at,
    totalCommits: null, authors: null,
    prs: merged, direct: [], guest: true, capped,
  };
}
