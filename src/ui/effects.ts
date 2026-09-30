import { gsap, ScrollTrigger, scrollTo } from '../lib/scroll';
import type { Profile } from '../data/profile';
import { NAV } from './render';

/* ── typing effect ─────────────────────────────────────────────── */
export function initTyping(roles: string[], reduced: boolean) {
  const el = document.getElementById('typed');
  if (!el) return;
  if (reduced || roles.length < 2) { el.textContent = roles[0]; return; }
  let i = 0;
  const type = (text: string, k: number, done: () => void) => {
    el.textContent = text.slice(0, k);
    if (k < text.length) setTimeout(() => type(text, k + 1, done), 42 + Math.random() * 40);
    else setTimeout(done, 1900);
  };
  const erase = (done: () => void) => {
    const t = el.textContent ?? '';
    if (t.length) { el.textContent = t.slice(0, -1); setTimeout(() => erase(done), 22); }
    else setTimeout(done, 250);
  };
  const loop = () => { i = (i + 1) % roles.length; type(roles[i], 0, () => erase(loop)); };
  setTimeout(() => erase(loop), 2200);
}

/* ── scroll reveals ────────────────────────────────────────────── */
export function initReveal(reduced: boolean) {
  if (reduced) { document.documentElement.classList.add('reduced'); return; }
  const hero = gsap.utils.toArray<HTMLElement>('.hero [data-reveal]');
  gsap.to(hero, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out', delay: 0.15 });
  ScrollTrigger.batch('section:not(.hero) [data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', overwrite: true }),
  });
}

/* ── nav state + anchor scrolling ──────────────────────────────── */
export function initNav() {
  const nav = document.getElementById('nav')!;
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav]'));
  const path = document.getElementById('nav-path');
  const setActive = (id: string) => {
    links.forEach((l) => l.classList.toggle('is-active', l.dataset.nav === id));
    if (path) path.textContent = id === 'top' ? '~/' : `~/${id}`;
  };
  document.querySelectorAll('section[id]').forEach((s) => {
    ScrollTrigger.create({ trigger: s, start: 'top 45%', end: 'bottom 45%', onToggle: (st) => { if (st.isActive) setActive(s.id); } });
  });
  ScrollTrigger.create({ start: 80, end: 'max', onToggle: (st) => nav.classList.toggle('is-scrolled', st.isActive) });
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      if (id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      scrollTo(id);
      history.replaceState(null, '', id);
    });
  });
}

/* ── toast + copy email ────────────────────────────────────────── */
let toastTimer = 0;
export function toast(msg: string) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove('show'), 2200);
}

export async function copyEmail(email: string) {
  try { await navigator.clipboard.writeText(email); toast('Email copied to clipboard'); }
  catch { toast(email); }
}

export function initCopyEmail(email: string) {
  document.getElementById('copy-email')?.addEventListener('click', () => void copyEmail(email));
}

/* ── local time in Isfahan ─────────────────────────────────────── */
export function initClock(timeZone: string) {
  const el = document.getElementById('clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 20_000);
}

/* ── graphics quality control ──────────────────────────────────── */
export type GfxMode = 'auto' | 'high' | 'lite' | 'off';
const GFX_ORDER: GfxMode[] = ['auto', 'high', 'lite', 'off'];
const GFX_LABEL: Record<GfxMode, string> = { auto: 'Auto', high: 'High', lite: 'Lite', off: 'Off' };

export function loadGfx(): GfxMode {
  try { const v = localStorage.getItem('gfx') as GfxMode | null; return v && GFX_ORDER.includes(v) ? v : 'auto'; } catch { return 'auto'; }
}

export function initGfxControl(onChange: (mode: GfxMode) => void) {
  let mode = loadGfx();
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.gfx'));
  const paint = (detail?: string) => buttons.forEach((b) => {
    b.querySelector('span')!.textContent = detail ? `${GFX_LABEL[mode]} · ${detail}` : GFX_LABEL[mode];
    b.dataset.mode = mode;
  });
  const set = (m: GfxMode) => {
    mode = m;
    try { localStorage.setItem('gfx', m); } catch { /* ignore */ }
    paint();
    onChange(m);
  };
  buttons.forEach((b) => b.addEventListener('click', () => set(GFX_ORDER[(GFX_ORDER.indexOf(mode) + 1) % GFX_ORDER.length])));
  paint();
  return { get: () => mode, set, paint };
}

/* ── command palette (Ctrl+K) ──────────────────────────────────── */
interface Cmd { label: string; hint: string; run: () => void; keywords?: string }

export function initPalette(p: Profile, extra: Cmd[]) {
  const root = document.getElementById('palette')!;
  const input = document.getElementById('pal-input') as HTMLInputElement;
  const list = document.getElementById('pal-list')!;
  const cmds: Cmd[] = [
    ...NAV.map(([id, label]) => ({ label: `Go to ${label}`, hint: 'section', run: () => scrollTo(`#${id}`), keywords: id })),
    { label: 'Go to top', hint: 'section', run: () => scrollTo('#top'), keywords: 'home hero' },
    { label: 'Open GitHub profile', hint: 'link', run: () => window.open(p.meta.github, '_blank', 'noopener') },
    { label: 'Open LinkedIn', hint: 'link', run: () => window.open(p.meta.linkedin, '_blank', 'noopener') },
    { label: 'Open Helpsy', hint: 'link', run: () => window.open('https://helpsy.ir', '_blank', 'noopener') },
    { label: 'Open Barnabus', hint: 'link', run: () => window.open('https://barnabus.ai', '_blank', 'noopener') },
    { label: 'Open Gymivo', hint: 'link', run: () => window.open('https://gymivo.ir', '_blank', 'noopener') },
    { label: 'Copy email address', hint: p.meta.email, run: () => void copyEmail(p.meta.email), keywords: 'mail contact' },
    { label: 'Send an email', hint: 'mailto', run: () => { location.href = `mailto:${p.meta.email}`; } },
    ...extra,
  ];
  let filtered = cmds;
  let sel = 0;
  let open = false;

  const render = () => {
    list.innerHTML = filtered.map((c, i) => `<li role="option" class="${i === sel ? 'is-sel' : ''}" data-i="${i}"><span>${c.label}</span><small>${c.hint}</small></li>`).join('')
      || '<li class="empty">Nothing matches.</li>';
  };
  const filter = () => {
    const q = input.value.trim().toLowerCase();
    filtered = q ? cmds.filter((c) => `${c.label} ${c.hint} ${c.keywords ?? ''}`.toLowerCase().includes(q)) : cmds;
    sel = 0;
    render();
  };
  const show = () => { open = true; root.classList.add('open'); input.value = ''; filter(); setTimeout(() => input.focus(), 30); };
  const hide = () => { open = false; root.classList.remove('open'); input.blur(); };
  const pick = (i: number) => { const c = filtered[i]; if (!c) return; hide(); c.run(); };

  document.getElementById('palette-open')?.addEventListener('click', show);
  root.querySelector('[data-pal-close]')?.addEventListener('click', hide);
  input.addEventListener('input', filter);
  list.addEventListener('click', (e) => { const li = (e.target as HTMLElement).closest<HTMLElement>('li[data-i]'); if (li) pick(Number(li.dataset.i)); });
  window.addEventListener('keydown', (e) => {
    const inField = (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA';
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open ? hide() : show(); return; }
    if (!open && !inField && e.key === '/') { e.preventDefault(); show(); return; }
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); hide(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, filtered.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(sel); }
  });
}

/* ── scroll progress under the nav ─────────────────────────────── */
export function initProgress() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (st) => { bar.style.transform = `scaleX(${st.progress.toFixed(4)})`; } });
}

/* ── pointer-following border light on cards ───────────────────── */
export function initSpotlight() {
  document.addEventListener('pointermove', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

/* ── boot sequence, once per session ───────────────────────────── */
export function runBoot(reduced: boolean) {
  const root = document.getElementById('boot');
  const log = document.getElementById('boot-log');
  if (!root || !log) return;
  let seen = false;
  try { seen = sessionStorage.getItem('booted') === '1'; sessionStorage.setItem('booted', '1'); } catch { /* ignore */ }
  if (seen || reduced) { root.remove(); return; }
  const lines = [
    ['$ ssh ali@alisoleimaninet.github.io', ''],
    ['  resolving gateway', 'ok'],
    ['  starting services  identity · booking · billing', 'ok'],
    ['  connecting postgres · redis · broker', 'ok'],
    ['  warming the mesh', 'ok'],
  ];
  root.classList.add('on');
  let i = 0;
  const step = () => {
    if (i < lines.length) {
      const [t, st] = lines[i++];
      log.innerHTML += `<span>${t}</span>${st ? `<b>${st}</b>` : ''}
`;
      setTimeout(step, i === 1 ? 260 : 150);
    } else {
      setTimeout(() => { root.classList.add('done'); setTimeout(() => root.remove(), 700); }, 220);
    }
  };
  step();
  // any interaction skips it
  const skip = () => { root.classList.add('done'); setTimeout(() => root.remove(), 500); };
  window.addEventListener('keydown', skip, { once: true });
  root.addEventListener('pointerdown', skip, { once: true });
}
