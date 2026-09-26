import * as THREE from 'three';
import { generateGraph } from './graph';
import { createNodes } from './nodes';
import { createDust, createEdges } from './edges';
import { createPackets } from './packets';
import { createCameraPath } from './camera-path';
import { onScroll } from '../lib/scroll';
import type { createComposer } from './post';

const ACCENT = '#22d3ee';
const HOT = '#a5f3fc';
const BG = 0x07090f;

export interface SceneOptions { lowEnd: boolean; reduced: boolean }

export function createScene(canvas: HTMLCanvasElement, opts: SceneOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.lowEnd, powerPreference: 'high-performance', alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.lowEnd ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(BG, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.032);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 19);

  const graph = generateGraph({ count: opts.lowEnd ? 26 : 42, radius: 7, seed: 7 });
  const nodes = createNodes(graph, ACCENT, HOT);
  const edges = createEdges(graph, ACCENT);
  const packets = createPackets(graph, opts.lowEnd ? 120 : 360, ACCENT, (i) => nodes.pulse(i));
  const dust = createDust(opts.lowEnd ? 250 : 700, 22, ACCENT);

  const mesh = new THREE.Group();
  mesh.add(edges.lines, nodes.mesh, packets.mesh);
  mesh.position.x = 3.5;
  scene.add(mesh, dust.points);

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

  let composer: ReturnType<typeof createComposer> | null = null;
  if (!opts.lowEnd) {
    import('./post').then((m) => { composer = m.createComposer(renderer, scene, camera); });
  }

  const timer = new THREE.Timer();
  let visible = !document.hidden;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  function frame() {
    if (!visible) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    mouse.lerp(mouseTarget, 1 - Math.exp(-dt * 3));
    mesh.rotation.y += dt * 0.02;
    mesh.position.y = Math.sin(timer.getElapsed() * 0.25) * 0.25;
    nodes.update(dt);
    packets.update(opts.reduced ? dt * 0.35 : dt);
    path.apply(camera, progress, mouse, dt);
    if (composer) composer.render(dt);
    else renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(frame);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer?.resize(w, h);
  }
  window.addEventListener('resize', resize);

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); document.body.classList.add('no-webgl'); });

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', resize);
      nodes.dispose(); edges.dispose(); packets.dispose(); dust.dispose(); composer?.dispose();
      renderer.dispose();
    },
  };
}
