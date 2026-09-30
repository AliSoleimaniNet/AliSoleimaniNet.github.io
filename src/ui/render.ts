import type { Profile, Project, StackItem } from '../data/profile';
import { icons } from './icons';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const NAV: [string, string][] = [
  ['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'], ['architecture', 'Architecture'],
  ['stack', 'Stack'], ['github', 'GitHub'], ['contact', 'Contact'],
];

function nav(p: Profile) {
  return `
    <a class="logo" href="#top" data-cursor="top"><i></i>${esc(p.meta.name)}<span class="path" id="nav-path">~/</span></a>
    <span class="progress" aria-hidden="true"><i id="progress"></i></span>
    <ul>${NAV.map(([id, l]) => `<li><a class="link" href="#${id}" data-nav="${id}">${l}</a></li>`).join('')}</ul>
    <div class="tools">
      <button type="button" class="tool" id="palette-open" aria-label="Open command palette" title="Command palette (Ctrl+K)"><kbd>Ctrl</kbd><kbd>K</kbd></button>
      <button type="button" class="tool gfx" id="gfx" aria-label="Graphics quality" title="Graphics quality"><i></i><span>Auto</span></button>
    </div>`;
}

function hero(p: Profile) {
  const [first, last] = p.meta.name.split(' ');
  return `
  <section class="hero" id="top">
    <div class="wrap">
      <p class="eyebrow" data-reveal>${esc(p.hero.eyebrow)}</p>
      <h1 aria-label="${esc(p.meta.name)}">
        <span class="line"><span data-reveal>${esc(first)}</span></span>
        <span class="line"><span data-reveal><em>${esc(last)}</em></span></span>
      </h1>
      <p class="typing" data-reveal><span class="t" id="typed">${esc(p.hero.roles[0])}</span><span class="caret"></span></p>
      <p class="lead" data-reveal>${esc(p.hero.tagline)}</p>
      <div class="cta" data-reveal>
        <a class="btn btn-primary" href="#projects"><span class="label">See my work</span>${icons.arrow}</a>
        <a class="btn btn-ghost" href="#contact"><span class="label">Get in touch</span></a>
        <a class="btn btn-ghost" href="${p.meta.github}" target="_blank" rel="noopener">${icons.github}<span class="label">GitHub</span></a>
      </div>
      <div class="meta" data-reveal>${p.hero.chips.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>
    </div>
    <div class="scroll" aria-hidden="true"><i></i>scroll</div>
  </section>`;
}

function about(p: Profile) {
  const ic = icons as Record<string, string>;
  return `
  <section class="about" id="about">
    <div class="wrap">
      <p class="eyebrow" data-reveal><span class="n">01</span>About</p>
      <h2 class="h2" data-reveal>Tech lead, software architect,<br>systems person.</h2>
      <div class="grid">
        <div class="bio">${p.about.bio.map((b) => `<p data-reveal>${b}</p>`).join('')}</div>
        <div>
          <div class="card avatar" data-reveal>
            <img src="/avatar.jpg" alt="${esc(p.meta.name)}" width="72" height="72" />
            <div><div class="n">${esc(p.meta.name)}</div><div class="r">${esc(p.meta.title)}</div></div>
          </div>
          <div class="facts">
            ${p.about.facts.map((f) => `
              <div class="card fact" data-reveal>
                <div class="ic">${ic[f.icon] ?? ''}</div>
                <div><b>${esc(f.title)}</b><small>${esc(f.sub)}</small></div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function experience(p: Profile) {
  return `
  <section class="experience" id="experience">
    <div class="wrap">
      <p class="eyebrow" data-reveal><span class="n">02</span>Experience</p>
      <h2 class="h2" data-reveal>Where I have shipped.</h2>
      <div class="timeline">
        ${p.experience.map((e) => `
          <div class="tl" data-reveal>
            <div class="card">
              <div class="top">
                <h3>${esc(e.role)} <span class="org">· ${'orgUrl' in e && e.orgUrl ? `<a href="${e.orgUrl}" target="_blank" rel="noopener">${esc(e.org)}</a>` : esc(e.org)}</span></h3>
                <span class="period">${esc(e.period)}</span>
              </div>
              <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
            </div>
          </div>`).join('')}
      </div>
      <div class="edu">
        ${p.education.map((e) => `<div class="card" data-reveal><b>${esc(e.degree)}</b><small>${esc(e.org)} · ${esc(e.period)}</small></div>`).join('')}
      </div>
    </div>
  </section>`;
}

function projectCard(pr: Project) {
  const status = { production: 'Production', launching: 'Launching soon', 'in progress': 'In progress', 'open source': 'Open source' }[pr.status];
  const links = [
    pr.link ? `<a href="${pr.link}" target="_blank" rel="noopener">Visit ${icons.arrowUpRight}</a>` : '',
    pr.repo ? `<a href="${pr.repo}" target="_blank" rel="noopener">Source ${icons.arrowUpRight}</a>` : '',
  ].join('');
  return `
    <article class="card pc ${pr.featured ? 'featured' : ''}" id="project-${pr.id}" data-reveal>
      <div class="kicker"><span>${esc(pr.kicker)}</span><span class="st"><i></i>${status}</span></div>
      <h3>${esc(pr.name)}</h3>
      <div class="sub">${esc(pr.sub)}</div>
      <p class="d">${esc(pr.description)}</p>
      ${pr.stats ? `<div class="stats">${pr.stats.map((s) => `<div><b>${esc(s.value)}</b><small>${esc(s.label)}</small></div>`).join('')}</div>` : ''}
      ${links ? `<div class="links">${links}</div>` : ''}
      <div class="tags">${pr.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    </article>`;
}

function projects(p: Profile) {
  return `
  <section class="projects" id="projects">
    <div class="wrap">
      <p class="eyebrow" data-reveal><span class="n">03</span>Projects</p>
      <h2 class="h2" data-reveal>Systems I have built<br>and still run.</h2>
      <p class="lead" data-reveal>Most of my day-to-day work lives in private GitLab and GitHub organizations. These are the ones I can talk about.</p>
      <div class="grid">${p.projects.map(projectCard).join('')}</div>
      <p class="more" data-reveal>More experiments on <a href="${p.meta.github}?tab=repositories" target="_blank" rel="noopener">GitHub</a>: proxy tooling, metaheuristics, a WinForms chess with online play, a Persian calendar library and more.</p>
    </div>
  </section>`;
}

function architecture(_p: Profile) {
  return `
  <section class="arch" id="architecture">
    <div class="wrap">
      <p class="eyebrow" data-reveal><span class="n">04</span>Architecture</p>
      <h2 class="h2" data-reveal>The shape I reach for.</h2>
      <p class="lead" data-reveal>A reference architecture, not any one product: requests enter through a single fail-closed gateway, services own their data and talk over gRPC, and every cross-service side effect goes through a transactional outbox on a message broker.</p>
      <div class="card diagram" data-reveal>
        <img src="/architecture.svg" alt="Reference architecture: clients, an API gateway, independent services, and a PostgreSQL, Redis, message broker, job scheduler, observability and CI/CD layer" loading="lazy" width="1200" height="560" />
      </div>
      <div class="callouts">
        ${[
          ['Edge', 'One gateway handles authentication, rate limiting and routing, and denies by default. Services never trust the client directly.'],
          ['Messaging', 'A transactional outbox on the broker, retries with dead-letter queues, and idempotent consumers. Nothing is fire-and-forget.'],
          ['Operations', 'Containerised deployments per environment, pipelines that run tests against real dependencies, and traces, metrics and logs from day one.'],
        ].map(([t, d]) => `<div class="card co" data-reveal><b>${t}</b><p>${d}</p></div>`).join('')}
      </div>
    </div>
  </section>`;
}

function principles(p: Profile) {
  return `
  <section class="principles" id="principles">
    <div class="wrap">
      <p class="eyebrow" data-reveal><span class="n">05</span>How I work</p>
      <h2 class="h2" data-reveal>Principles I keep coming back to.</h2>
      <div class="grid">
        ${p.principles.map((pr, i) => `
          <div class="card pr" data-reveal>
            <span class="num">${String(i + 1).padStart(2, '0')}</span>
            <b>${esc(pr.title)}</b>
            <p>${esc(pr.text)}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>`;
}

function stackItem(i: StackItem) {
  const vis = i.icon
    ? `<img src="/icons/${i.icon}.svg" alt="" width="22" height="22" loading="lazy" />`
    : `<span class="ph">${esc(i.short ?? i.label.slice(0, 2))}</span>`;
  return `<span class="si">${vis}${esc(i.label)}</span>`;
}

function stack(p: Profile) {
  return `
  <section class="stack" id="stack">
    <div class="wrap">
      <p class="eyebrow" data-reveal><span class="n">06</span>Stack</p>
      <h2 class="h2" data-reveal>Tools I reach for.</h2>
      <div class="groups">
        ${p.stack.map((g) => `<div class="card sg" data-reveal><h3>${esc(g.group)}</h3><div class="items">${g.items.map(stackItem).join('')}</div></div>`).join('')}
      </div>
    </div>
  </section>`;
}

function github(p: Profile) {
  return `
  <section class="gh" id="github">
    <div class="wrap">
      <div class="head">
        <div>
          <p class="eyebrow" data-reveal><span class="n">07</span>GitHub · live</p>
          <h2 class="h2" data-reveal>What I am pushing.</h2>
        </div>
        <a class="btn btn-ghost" href="${p.meta.github}" target="_blank" rel="noopener" data-reveal>${icons.github}<span class="label">@${esc(p.meta.handle)}</span></a>
      </div>
      <div id="gh-stats" class="stats" data-reveal><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>
      <div id="gh-repos" class="repos"></div>
      <div class="card chart" data-reveal>
        <img src="https://ghchart.rshah.org/22d3ee/${esc(p.meta.handle)}" alt="Contribution calendar for ${esc(p.meta.handle)}" loading="lazy" onerror="this.parentElement.style.display='none'" />
      </div>
      <p class="note" id="gh-note"></p>
    </div>
  </section>`;
}

function contact(p: Profile) {
  return `
  <section class="contact" id="contact">
    <div class="wrap">
      <p class="eyebrow" data-reveal><span class="n">08</span>Contact</p>
      <div class="card panel" data-reveal>
        <div>
          <h2 class="h2">Let us build something<br>that stays up.</h2>
          <p class="lead">Open to backend, platform and tech-lead roles, consulting on .NET and Go systems, and interesting collaborations.</p>
          <div class="email">
            <a href="mailto:${p.meta.email}">${esc(p.meta.email)}</a>
            <button type="button" id="copy-email" aria-label="Copy email">${icons.copy}</button>
          </div>
          <p class="clock"><i></i><span id="clock">--:--</span> in ${esc(p.meta.location.split(',')[0])} · I usually reply within a day</p>
        </div>
        <div class="links">
          <a href="mailto:${p.meta.email}">${icons.mail}<span><b>Email</b><small>Fastest way to reach me</small></span></a>
          <a href="${p.meta.linkedin}" target="_blank" rel="noopener">${icons.linkedin}<span><b>LinkedIn</b><small>Career, roles and background</small></span></a>
          <a href="${p.meta.github}" target="_blank" rel="noopener">${icons.github}<span><b>GitHub</b><small>Code, experiments and activity</small></span></a>
        </div>
      </div>
    </div>
  </section>`;
}

function footer(p: Profile) {
  return `
    <span>© ${new Date().getFullYear()} ${esc(p.meta.name)} · ${esc(p.meta.location)}</span>
    <span class="fright">
      <button type="button" class="tool gfx" id="gfx-footer"><i></i><span>Auto</span></button>
      Built with Three.js, GSAP and Vite · <a href="https://github.com/AliSoleimaniNet/AliSoleimaniNet.github.io" target="_blank" rel="noopener">source</a>
    </span>`;
}

export function palette(p: Profile) {
  return `
    <div class="pal-backdrop" data-pal-close></div>
    <div class="pal" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="pal-in"><span>›</span><input id="pal-input" type="text" placeholder="Jump to a section, open a link, change graphics…" autocomplete="off" spellcheck="false" /><kbd>esc</kbd></div>
      <ul id="pal-list" role="listbox"></ul>
      <div class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span><span>${esc(p.meta.name)} · ${esc(p.meta.handle)}</span></div>
    </div>`;
}

export function renderAll(p: Profile) {
  document.getElementById('nav')!.innerHTML = nav(p);
  document.getElementById('app')!.innerHTML = [hero, about, experience, projects, architecture, principles, stack, github, contact].map((f) => f(p)).join('');
  document.getElementById('footer')!.innerHTML = footer(p);
  document.getElementById('palette')!.innerHTML = palette(p);
}
