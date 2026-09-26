export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string;
  fork?: boolean;
}

export interface GhData {
  user: { followers: number; public_repos: number };
  repos: Repo[];
  fetchedAt: number;
  stale?: boolean;
}

const KEY = 'gh:v1';
const TTL = 60 * 60 * 1000;

function read(): GhData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GhData) : null;
  } catch {
    return null;
  }
}

function write(d: GhData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* storage unavailable */
  }
}

export async function fetchGithub(
  user: string,
  fallback: { followers: number; public_repos: number; repos: Repo[] },
): Promise<GhData> {
  const cached = read();
  if (cached && Date.now() - cached.fetchedAt < TTL) return cached;

  try {
    const headers = { Accept: 'application/vnd.github+json' };
    const [u, r] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers }),
      fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=20&type=owner`, { headers }),
    ]);
    if (!u.ok || !r.ok) throw new Error(`${u.status}/${r.status}`);
    const uj = await u.json();
    const rj = (await r.json()) as Repo[];
    const repos = rj
      .filter((x) => !x.fork && x.name.toLowerCase() !== user.toLowerCase() && !x.name.endsWith('.github.io'))
      .slice(0, 6);
    const data: GhData = {
      user: { followers: uj.followers, public_repos: uj.public_repos },
      repos,
      fetchedAt: Date.now(),
    };
    write(data);
    return data;
  } catch {
    if (cached) return { ...cached, stale: true };
    return { user: { followers: fallback.followers, public_repos: fallback.public_repos }, repos: fallback.repos, fetchedAt: 0, stale: true };
  }
}

export function relTime(iso: string): string {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  if (d < 86400 * 30) return `${Math.floor(d / 86400)}d ago`;
  if (d < 86400 * 365) return `${Math.floor(d / (86400 * 30))}mo ago`;
  return `${Math.floor(d / (86400 * 365))}y ago`;
}

export const LANG_COLORS: Record<string, string> = {
  'C#': '#178600', Go: '#00ADD8', Python: '#3572A5', TypeScript: '#3178c6', JavaScript: '#f1e05a',
  Java: '#b07219', 'C++': '#f34b7d', HTML: '#e34c26', CSS: '#563d7c', Dockerfile: '#384d54', Shell: '#89e051',
};
