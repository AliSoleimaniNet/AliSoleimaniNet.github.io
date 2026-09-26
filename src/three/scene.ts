import * as THREE from 'three';
import { generateGraph } from './graph';
import { createNodes } from './nodes';
import { createDust, createEdges } from './edges';
import { createPackets } from './packets';
import { createCameraPath } from './camera-path';
import { FrameMonitor, TIER_ORDER, TIER_SETTINGS, type Tier } from './quality';
import { onScroll } from '../lib/scroll';
import type { createComposer } from './post';

export type { Tier };

const ACCENT = '#22d3ee';
const HOT = '#a5f3fc';
const BG = 0x07090f;

export interface SceneOptions {
  lowEnd: boolean;
  reduced: boolean;
  labels: string[];
  onTier?: (tier: Exclude<Tier, 'off'>) => void;
}

export interface SceneHandle {
  setTier(tier: Tier | 'auto'): void;
  getTier(): Tier;
  dispose(): void;
}

export function createScene(canvas: HTMLCanvasElement, opts: SceneOptions): SceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.lowEnd, powerPreference: 'high-performance', alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(BG, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.032);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(-2, 2, 27);

  const graph = generateGraph({ count: opts.lowEnd ? 26 : 42, radius: 7, seed: 7 });
  const nodes = createNodes(graph, ACCENT, HOT);
  const edges = createEdges(graph, ACCENT);
  const packets = createPackets(graph, TIER_SETTINGS.high.packets, ACCENT, (i) => nodes.pulse(i));
  const dust = createDust(opts.lowEnd ? 250 : 700, 22, ACCENT);

  const mesh = new THREE.Group();
  mesh.add(edges.lines, nodes.mesh, packets.mesh);
  mesh.position.x = 3.5;
  scene.add(mesh, dust.points);

  /* ── node labels (DOM, projected each frame) ─────────────────── */
  const labelRoot = document.getElementById('labels');
  const labelEls: { el: HTMLElement; node: number }[] = [];
  if (labelRoot) {
    const step = graph.nodes.length / opts.labels.length;
    opts.labels.forEach((text, i) => {
      const el = document.createElement('span');
      el.className = 'mlabel';
      el.textContent = text;
      labelRoot.appendChild(el);
      labelEls.push({ el, node: Math.min(graph.nodes.length - 1, Math.floor(i * step + step * 0.4)) });
    });
  }
  const proj = new THREE.Vector3();
  function updateLabels(progress: number) {
    if (!labelEls.length) return;
    const fade = THREE.MathUtils.clamp(1 - progress / 0.12, 0, 1);
    if (fade <= 0) { if (labelRoot!.style.opacity !== '0') labelRoot!.style.opacity = '0'; return; }
    labelRoot!.style.opacity = String(fade);
    const w = window.innerWidth, h = window.innerHeight;
    for (const { el, node } of labelEls) {
      proj.copy(graph.nodes[node]).applyMatrix4(mesh.matrixWorld).project(camera);
      const visible = proj.z < 1 && proj.x > -0.98 && proj.x < 0.98 && proj.y > -0.98 && proj.y < 0.98;
      if (!visible) { el.style.opacity = '0'; continue; }
      const x = (proj.x + 1) / 2 * w, y = (1 - proj.y) / 2 * h;
      const depth = THREE.MathUtils.clamp(1 - (proj.z - 0.94) * 14, 0.35, 1);
      el.style.opacity = String(depth);
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  }

  /* ── scroll + mouse ──────────────────────────────────────────── */
  const path = createCameraPath();
  let progress = 0;
  onScroll((p) => { progress = p; });

  const mouse = new THREE.Vector2();
  const mouseTarget = new THREE.Vector2();
  if (!opts.reduced) {
    window.addEventListener('mousemove', (e) => {
      mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    }, { passive: true });
  }

  /* ── quality tiers ───────────────────────────────────────────── */
  let composer: ReturnType<typeof createComposer> | null = null;
  let composerWanted = false;
  let tier: Tier = opts.lowEnd ? 'low' : 'high';
  let auto = true;
  let running = false;

  function applyTier(t: Exclude<Tier, 'off'>) {
    const s = TIER_SETTINGS[t];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, s.dpr));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    packets.setCount(s.packets);
    dust.points.visible = s.dust;
    composerWanted = s.composer;
    if (composerWanted && !composer) {
      import('./post').then((m) => { if (composerWanted && !composer) { composer = m.createComposer(renderer, scene, camera); composer.resize(window.innerWidth, window.innerHeight); } });
    }
    opts.onTier?.(t);
  }

  const monitor = new FrameMonitor(() => {
    if (!auto) return;
    const i = TIER_ORDER.indexOf(tier as Exclude<Tier, 'off'>);
    if (i >= 0 && i < TIER_ORDER.length - 1) { const next = TIER_ORDER[i + 1]; tier = next; applyTier(next); }
  });

  /* ── frame loop ──────────────────────────────────────────────── */
  const timer = new THREE.Timer();
  let visible = !document.hidden;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) monitor.reset(); });

  function frame() {
    if (!visible || tier === 'off') return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    monitor.push(dt);
    mouse.lerp(mouseTarget, 1 - Math.exp(-dt * 3));
    mesh.rotation.y += dt * 0.02;
    mesh.position.y = Math.sin(timer.getElapsed() * 0.25) * 0.25;
    mesh.updateMatrixWorld();
    nodes.update(dt);
    packets.update(opts.reduced ? dt * 0.35 : dt);
    path.apply(camera, progress, mouse, dt);
    if (composer && composerWanted) composer.render(dt);
    else renderer.render(scene, camera);
    updateLabels(progress);
  }

  function start() { if (!running) { running = true; renderer.setAnimationLoop(frame); } }
  function stop() { running = false; renderer.setAnimationLoop(null); if (labelRoot) labelRoot.style.opacity = '0'; }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer?.resize(w, h);
  }
  window.addEventListener('resize', resize);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); document.body.classList.add('no-webgl'); });

  applyTier(tier);
  start();

  return {
    setTier(t) {
      if (t === 'auto') { auto = true; tier = opts.lowEnd ? 'low' : 'high'; monitor.reset(); applyTier(tier); start(); return; }
      auto = false;
      tier = t;
      if (t === 'off') { stop(); return; }
      applyTier(t);
      start();
    },
    getTier: () => tier,
    dispose() {
      stop();
      window.removeEventListener('resize', resize);
      labelEls.forEach((l) => l.el.remove());
      nodes.dispose(); edges.dispose(); packets.dispose(); dust.dispose(); composer?.dispose();
      renderer.dispose();
    },
  };
}
