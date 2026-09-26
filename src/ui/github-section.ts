import type { Profile } from '../data/profile';
import { fetchGithub, LANG_COLORS, relTime, type Repo } from '../lib/github';
import { icons } from './icons';
import { gsap } from '../lib/scroll';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function repoCard(r: Repo) {
  const color = (r.language && LANG_COLORS[r.language]) || '#8b93a3';
  return `
    <a class="card repo" href="${r.html_url}" target="_blank" rel="noopener" data-hover>
      <div class="n">${icons.repo}${esc(r.name)}</div>
      <div class="d">${esc(r.description ?? 'No description yet.')}</div>
      <div class="m">
        ${r.language ? `<span><i style="background:${color}"></i>${esc(r.language)}</span>` : ''}
        <span>${icons.star} ${r.stargazers_count}</span>
        <span>pushed ${relTime(r.pushed_at)}</span>
      </div>
    </a>`;
}

function countUp(el: HTMLElement, to: number) {
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: 1.4, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v).toString(); } });
}

export async function initGithubSection(p: Profile) {
  const statsEl = document.getElementById('gh-stats');
  const reposEl = document.getElementById('gh-repos');
  const noteEl = document.getElementById('gh-note');
  if (!statsEl || !reposEl || !noteEl) return;

  const data = await fetchGithub(p.meta.handle, p.githubFallback);
  const stars = data.repos.reduce((a, r) => a + r.stargazers_count, 0);
  const stats = [
    { v: data.user.public_repos, l: 'public repos' },
    { v: data.user.followers, l: 'followers' },
    { v: stars, l: 'stars on recent repos' },
    { v: data.repos.length, l: 'recently pushed' },
  ];
  statsEl.innerHTML = stats.map((s) => `<div class="card stat"><b data-count="${s.v}">0</b><small>${s.l}</small></div>`).join('');
  statsEl.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => countUp(el, Number(el.dataset.count)));
  reposEl.innerHTML = data.repos.map(repoCard).join('');
  gsap.fromTo(reposEl.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' });
  noteEl.textContent = data.stale
    ? 'Showing cached data. Live GitHub data refreshes hourly when the API is reachable.'
    : `Live from the GitHub API, updated ${relTime(new Date(data.fetchedAt).toISOString())}. Most of my work is in private organizations, so public numbers undercount.`;
}
