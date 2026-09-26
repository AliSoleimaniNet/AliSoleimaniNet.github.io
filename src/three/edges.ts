import * as THREE from 'three';
import type { Graph } from './graph';

export function createEdges(graph: Graph, color: string, segments = 24) {
  const pos = new Float32Array(graph.edges.length * segments * 2 * 3);
  let o = 0;
  for (const e of graph.edges) {
    const pts = e.curve.getPoints(segments);
    for (let i = 0; i < segments; i++) {
      const a = pts[i], b = pts[i + 1];
      pos[o++] = a.x; pos[o++] = a.y; pos[o++] = a.z;
      pos[o++] = b.x; pos[o++] = b.y; pos[o++] = b.z;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(geo, mat);
  return { lines, dispose() { geo.dispose(); mat.dispose(); } };
}

export function createDust(count: number, spread: number, color: string) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread * 2.2;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 1.6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: new THREE.Color(color), size: 0.045, sizeAttenuation: true,
    transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  return { points: new THREE.Points(geo, mat), dispose() { geo.dispose(); mat.dispose(); } };
}
