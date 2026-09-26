import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { profile } from './data/profile';
import { renderAll } from './ui/render';
import { initScroll } from './lib/scroll';
import { hasWebGL, isLowEnd, isTouch, reducedMotion } from './lib/device';
import { initClock, initCopyEmail, initGfxControl, initNav, initPalette, initReveal, initTyping, loadGfx, type GfxMode } from './ui/effects';
import { initGithubSection } from './ui/github-section';
import type { SceneHandle, Tier } from './three/scene';

renderAll(profile);

initScroll(!reducedMotion && !isTouch);
initNav();
initReveal(reducedMotion);
initTyping(profile.hero.roles, reducedMotion);
initCopyEmail(profile.meta.email);
initClock(profile.meta.timeZone);
void initGithubSection(profile);

/* ── 3D scene with adaptive quality ─────────────────────────────── */
const canvas = document.getElementById('bg') as HTMLCanvasElement | null;
let scene: SceneHandle | null = null;
let loading: Promise<SceneHandle> | null = null;

const modeToTier = (m: GfxMode): Tier | 'auto' => (m === 'lite' ? 'low' : m);

function setOff(off: boolean) {
  document.body.classList.toggle('no-webgl', off);
}

async function ensureScene(): Promise<SceneHandle | null> {
  if (!canvas || !hasWebGL()) { setOff(true); return null; }
  if (scene) return scene;
  loading ??= import('./three/scene').then((m) =>
    m.createScene(canvas, { lowEnd: isLowEnd, reduced: reducedMotion, labels: profile.meshLabels, onTier: (t) => gfx.paint(t === 'high' ? undefined : t === 'medium' ? 'balanced' : 'lite') }),
  );
  try { scene = await loading; return scene; }
  catch { setOff(true); return null; }
}

function applyMode(mode: GfxMode) {
  const tier = modeToTier(mode);
  if (tier === 'off') { scene?.setTier('off'); setOff(true); return; }
  setOff(false);
  void ensureScene().then((s) => { s?.setTier(tier); gfx.paint(); });
}

const gfx = initGfxControl(applyMode);
initPalette(profile, [
  { label: 'Graphics: Auto (adapts to your machine)', hint: 'graphics', run: () => gfx.set('auto') },
  { label: 'Graphics: High', hint: 'graphics', run: () => gfx.set('high') },
  { label: 'Graphics: Lite (low-end devices)', hint: 'graphics', run: () => gfx.set('lite') },
  { label: 'Graphics: Off (static background)', hint: 'graphics', run: () => gfx.set('off') },
]);

// Load the 3D scene after first paint so the hero text stays the LCP element.
requestAnimationFrame(() => applyMode(loadGfx()));
