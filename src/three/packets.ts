import * as THREE from 'three';
import type { Graph } from './graph';
import vert from './shaders/packet.vert';
import frag from './shaders/packet.frag';

const SAMPLES = 64;
const TRAIL = 3;

export function createPackets(graph: Graph, count: number, color: string, onArrive: (nodeIndex: number) => void) {
  const edges = graph.edges.length;

  // Bake every edge curve into one RGBA16F texture: row = edge, column = sample.
  const data = new Uint16Array(SAMPLES * edges * 4);
  graph.edges.forEach((e, row) => {
    const pts = e.curve.getPoints(SAMPLES - 1);
    for (let s = 0; s < SAMPLES; s++) {
      const i = (row * SAMPLES + s) * 4;
      data[i] = THREE.DataUtils.toHalfFloat(pts[s].x);
      data[i + 1] = THREE.DataUtils.toHalfFloat(pts[s].y);
      data[i + 2] = THREE.DataUtils.toHalfFloat(pts[s].z);
      data[i + 3] = THREE.DataUtils.toHalfFloat(1);
    }
  });
  const tex = new THREE.DataTexture(data, SAMPLES, edges, THREE.RGBAFormat, THREE.HalfFloatType);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;

  const instances = count * TRAIL;
  const base = new THREE.SphereGeometry(1, 6, 5);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.setAttribute('position', base.getAttribute('position'));
  geo.instanceCount = instances;

  const aEdge = new Float32Array(instances);
  const aSeed = new Float32Array(instances);
  const aSpeed = new Float32Array(instances);
  const aTrail = new Float32Array(instances);
  const edgeOf = new Int32Array(count);
  const seedOf = new Float32Array(count);
  const speedOf = new Float32Array(count);
  const lastT = new Float32Array(count);

  for (let k = 0; k < count; k++) {
    edgeOf[k] = Math.floor(Math.random() * edges);
    seedOf[k] = Math.random();
    speedOf[k] = 0.12 + Math.random() * 0.22; // laps per second
    for (let t = 0; t < TRAIL; t++) {
      const i = k * TRAIL + t;
      aEdge[i] = edgeOf[k]; aSeed[i] = seedOf[k]; aSpeed[i] = speedOf[k]; aTrail[i] = t;
    }
  }
  geo.setAttribute('aEdge', new THREE.InstancedBufferAttribute(aEdge, 1));
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
  geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(aSpeed, 1));
  geo.setAttribute('aTrail', new THREE.InstancedBufferAttribute(aTrail, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uCurves: { value: tex },
      uEdges: { value: edges },
      uSamples: { value: SAMPLES },
      uTime: { value: 0 },
      uSize: { value: 0.055 },
      uColor: { value: new THREE.Color(color) },
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;

  let time = 0;
  let active = count;
  return {
    mesh,
    /** Limit how many packets are simulated and drawn (quality tiers). */
    setCount(n: number) {
      active = Math.max(0, Math.min(count, Math.floor(n)));
      geo.instanceCount = active * TRAIL;
    },
    update(dt: number) {
      time += dt;
      mat.uniforms.uTime.value = time;
      // packets that wrapped around have arrived: pulse the target node
      for (let k = 0; k < active; k++) {
        const t = (seedOf[k] + time * speedOf[k]) % 1;
        if (t < lastT[k]) onArrive(graph.edges[edgeOf[k]].b);
        lastT[k] = t;
      }
    },
    dispose() { geo.dispose(); base.dispose(); mat.dispose(); tex.dispose(); },
  };
}
