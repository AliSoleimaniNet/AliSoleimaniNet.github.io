import * as THREE from 'three';

export interface Edge { a: number; b: number; curve: THREE.QuadraticBezierCurve3 }
export interface Graph { nodes: THREE.Vector3[]; edges: Edge[] }

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateGraph({ count = 40, radius = 7, seed = 42 } = {}): Graph {
  const rnd = mulberry32(seed);
  const nodes: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    // fibonacci sphere, flattened, with jitter: an organic cloud
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const jitter = () => (rnd() - 0.5) * 1.6;
    nodes.push(new THREE.Vector3(
      Math.cos(th) * r * radius * 1.7 + jitter(),
      y * radius * 0.75 + jitter(),
      Math.sin(th) * r * radius * 1.1 + jitter(),
    ));
  }

  const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const seen = new Set<string>();
  const pairs: [number, number][] = [];
  const add = (a: number, b: number) => {
    if (a === b || seen.has(key(a, b))) return;
    seen.add(key(a, b));
    pairs.push(rnd() < 0.5 ? [a, b] : [b, a]);
  };

  nodes.forEach((p, i) => {
    const near = nodes
      .map((q, j) => ({ j, d: p.distanceTo(q) }))
      .filter((x) => x.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2 + (rnd() < 0.4 ? 1 : 0));
    near.forEach((n) => add(i, n.j));
  });
  for (let k = 0; k < Math.floor(count * 0.28); k++) add(Math.floor(rnd() * count), Math.floor(rnd() * count));

  const edges: Edge[] = pairs.map(([a, b]) => {
    const pa = nodes[a], pb = nodes[b];
    const mid = pa.clone().add(pb).multiplyScalar(0.5);
    const out = mid.clone().normalize().multiplyScalar(pa.distanceTo(pb) * 0.28 + 0.4);
    const ctrl = mid.add(out);
    return { a, b, curve: new THREE.QuadraticBezierCurve3(pa, ctrl, pb) };
  });

  return { nodes, edges };
}
