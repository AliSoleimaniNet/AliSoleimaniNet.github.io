import { gsap, ScrollTrigger, scrollTo } from '../lib/scroll';
import { isTouch } from '../lib/device';

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

/* ── custom cursor ─────────────────────────────────────────────── */
export function initCursor() {
  if (isTouch) return;
  const c = document.getElementById('cursor');
  if (!c) return;
  document.body.classList.add('has-cursor');
  const ring = c.querySelector<HTMLElement>('.ring')!;
  const dot = c.querySelector<HTMLElement>('.dot')!;
  const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  window.addEventListener('mousemove', (e) => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); }, { passive: true });
  document.addEventListener('mouseover', (e) => { if ((e.target as HTMLElement).closest('a, button, [data-hover]')) c.classList.add('is-hover'); });
  document.addEventListener('mouseout', (e) => { if ((e.target as HTMLElement).closest('a, button, [data-hover]')) c.classList.remove('is-hover'); });
  window.addEventListener('mousedown', () => c.classList.add('is-down'));
  window.addEventListener('mouseup', () => c.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => { c.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { c.style.opacity = ''; });
}

/* ── magnetic buttons ──────────────────────────────────────────── */
export function initMagnetic() {
  if (isTouch) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.32);
      y((e.clientY - (r.top + r.height / 2)) * 0.32);
    });
    el.addEventListener('mouseleave', () => { x(0); y(0); });
  });
}

/* ── card spotlight ────────────────────────────────────────────── */
export function initTilt() {
  if (isTouch) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
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
  const setActive = (id: string) => links.forEach((l) => l.classList.toggle('is-active', l.dataset.nav === id));
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

export function initCopyEmail(email: string) {
  document.getElementById('copy-email')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(email); toast('Email copied to clipboard'); }
    catch { toast(email); }
  });
}
