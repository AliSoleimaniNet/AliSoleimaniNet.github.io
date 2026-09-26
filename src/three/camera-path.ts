import * as THREE from 'three';

// One keyframe per page section, in scroll order.
const KEYS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [-2, 2, 27], look: [2, 0, 0] },        // hero: wide, mesh sits right of the headline
  { pos: [9, 2, 16], look: [3, 0, 0] },         // about
  { pos: [-10, 5, 14], look: [0, 0, 0] },       // experience
  { pos: [2, 11, 13], look: [3, 0, 0] },        // projects
  { pos: [10, -3, 12], look: [3, 1, 0] },       // stack
  { pos: [-4, 3, 20], look: [2, 0.5, 0] },      // github
  { pos: [1, 0, 32], look: [3, 0, 0] },         // contact
];

export function createCameraPath() {
  const pos = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.pos)), false, 'catmullrom', 0.35);
  const look = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.look)), false, 'catmullrom', 0.35);
  const p = new THREE.Vector3();
  const l = new THREE.Vector3();
  const target = new THREE.Vector3();
  const current = new THREE.Vector3();
  let started = false;

  return {
    apply(camera: THREE.PerspectiveCamera, progress: number, mouse: THREE.Vector2, dt: number) {
      const t = THREE.MathUtils.clamp(progress, 0, 1);
      pos.getPoint(t, p);
      look.getPoint(t, l);
      target.copy(p);
      target.x += mouse.x * 0.9;
      target.y += mouse.y * 0.6;
      if (!started) { current.copy(target); started = true; }
      const k = 1 - Math.exp(-dt * 4.5);
      current.lerp(target, k);
      camera.position.copy(current);
      camera.lookAt(l);
    },
  };
}
