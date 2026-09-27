// "Packet" cursor: a dot with a short fading trail (like the packets in the mesh), and a reticle
// that snaps onto interactive elements with corner brackets and a small label saying what a click does.
// Disabled on touch devices; no trail and no easing with prefers-reduced-motion.
import { isTouch, reducedMotion } from '../lib/device';

type Target = { el: HTMLElement; label: string } | null;

const SNAP = 'a, button, .chip, .si, .card.pc, .card.repo, .card.fact, .card.pr, .card.co, .contact .links a, [data-cursor]';

function labelFor(el: HTMLElement): string {
  const custom = el.closest<HTMLElement>('[data-cursor]')?.dataset.cursor;
  if (custom) return custom;
  const a = el.closest('a');
  if (a) {
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('mailto:')) return 'email';
    if (href.startsWith('#')) return 'jump';
    if (a.target === '_blank' || /^https?:/.test(href)) {
      try { return `open ${new URL(href, location.href).hostname.replace(/^www\./, '')} ↗`; } catch { return 'open ↗'; }
    }
    return 'go';
  }
  if (el.closest('#copy-email')) return 'copy';
  if (el.closest('.gfx')) return 'graphics';
  if (el.closest('#palette-open')) return 'commands';
  if (el.closest('button')) return 'click';
  return '';
}

export function initCursor() {
  if (isTouch) return;
  const root = document.getElementById('cursor');
  const canvas = document.getElementById('trail') as HTMLCanvasElement | null;
  if (!root || !canvas) return;
  const ring = root.querySelector<HTMLElement>('.c-ring')!;
  const dot = root.querySelector<HTMLElement>('.c-dot')!;
  const label = root.querySelector<HTMLElement>('.c-label')!;
  const ctx = canvas.getContext('2d')!;
  document.documentElement.classList.add('has-cursor');

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const pos = { x: mouse.x, y: mouse.y };
  const box = { x: mouse.x, y: mouse.y, w: 26, h: 26, r: 13 };
  const trail: { x: number; y: number; t: number }[] = [];
  let target: Target = null;
  let visible = false;
  let raf = 0;
  let last = performance.now();
  let idleSince = performance.now();

  const setTarget = (t: Target) => {
    if (t?.el === target?.el) return;
    target = t;
    root.classList.toggle('is-snapped', !!t);
    label.textContent = t?.label ?? '';
    root.classList.toggle('has-label', !!t?.label);
  };

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (!visible) { visible = true; root.classList.add('is-visible'); pos.x = mouse.x; pos.y = mouse.y; }
    trail.push({ x: mouse.x, y: mouse.y, t: performance.now() });
    idleSince = performance.now();
    if (!raf) raf = requestAnimationFrame(frame);
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>(SNAP);
    if (!el || el.closest('#palette .pal')) { setTarget(null); return; }
    setTarget({ el, label: labelFor(el) });
  });
  document.addEventListener('pointerout', (e) => {
    const to = e.relatedTarget as HTMLElement | null;
    if (!to || !to.closest(SNAP)) setTarget(null);
  });
  document.addEventListener('mouseleave', () => { visible = false; root.classList.remove('is-visible'); });
  document.addEventListener('pointerdown', () => {
    root.classList.remove('is-down'); void root.offsetWidth; root.classList.add('is-down');
    const p = document.createElement('i');
    p.className = 'c-pulse';
    p.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
    root.appendChild(p);
    setTimeout(() => p.remove(), 600);
  });
  document.addEventListener('pointerup', () => root.classList.remove('is-down'));
  // inputs keep the native text cursor
  document.addEventListener('focusin', (e) => { if ((e.target as HTMLElement).matches('input, textarea')) root.classList.add('is-typing'); });
  document.addEventListener('focusout', () => root.classList.remove('is-typing'));

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#22d3ee';
  const TRAIL_MS = 260;

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 28);
    pos.x += (mouse.x - pos.x) * k;
    pos.y += (mouse.y - pos.y) * k;

    // reticle: snaps to the hovered element's box, otherwise a small circle around the pointer
    let tx = pos.x, ty = pos.y, tw = 26, th = 26, tr = 13;
    if (target && target.el.isConnected) {
      const r = target.el.getBoundingClientRect();
      const pad = 6;
      tx = r.left + r.width / 2; ty = r.top + r.height / 2;
      tw = r.width + pad * 2; th = r.height + pad * 2;
      tr = Math.min(parseFloat(getComputedStyle(target.el).borderRadius) || 10, th / 2) + pad;
    }
    const kb = reducedMotion ? 1 : 1 - Math.exp(-dt * 18);
    box.x += (tx - box.x) * kb; box.y += (ty - box.y) * kb;
    box.w += (tw - box.w) * kb; box.h += (th - box.h) * kb; box.r += (tr - box.r) * kb;
    ring.style.transform = `translate(${(box.x - box.w / 2).toFixed(1)}px, ${(box.y - box.h / 2).toFixed(1)}px)`;
    ring.style.width = `${box.w.toFixed(1)}px`;
    ring.style.height = `${box.h.toFixed(1)}px`;
    ring.style.borderRadius = `${box.r.toFixed(1)}px`;
    dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
    label.style.transform = target
      ? `translate(${(box.x + box.w / 2 + 10).toFixed(1)}px, ${(box.y - box.h / 2 - 4).toFixed(1)}px)`
      : `translate(${mouse.x + 16}px, ${mouse.y + 14}px)`;

    // packet trail
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
    if (!reducedMotion && trail.length > 1) {
      ctx.lineCap = 'round';
      for (let i = 1; i < trail.length; i++) {
        const a = 1 - (now - trail[i].t) / TRAIL_MS;
        ctx.strokeStyle = accent;
        ctx.globalAlpha = Math.max(0, a) * 0.55;
        ctx.lineWidth = 1 + a * 2.2;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    const settled = Math.abs(tx - box.x) + Math.abs(ty - box.y) + Math.abs(tw - box.w) < 0.5 && Math.abs(mouse.x - pos.x) < 0.3;
    if (settled && !trail.length && now - idleSince > 300) { raf = 0; return; }
    raf = requestAnimationFrame(frame);
  }

  // keep the reticle glued to snapped elements while the page scrolls
  window.addEventListener('scroll', () => { if (target && !raf) raf = requestAnimationFrame(frame); }, { passive: true });
}
