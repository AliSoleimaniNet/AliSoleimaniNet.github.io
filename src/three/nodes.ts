import * as THREE from 'three';
import type { Graph } from './graph';
import vert from './shaders/node.vert';
import frag from './shaders/node.frag';

export function createNodes(graph: Graph, color: string, hot: string) {
  const count = graph.nodes.length;
  const geo = new THREE.IcosahedronGeometry(0.3, 1);
  const activity = new Float32Array(count);
  const phase = new Float32Array(count).map(() => Math.random() * Math.PI * 2);
  const aActivity = new THREE.InstancedBufferAttribute(activity, 1);
  geo.setAttribute('aActivity', aActivity);
  geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uHot: { value: new THREE.Color(hot) },
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const m = new THREE.Matrix4();
  graph.nodes.forEach((p, i) => { m.makeTranslation(p.x, p.y, p.z); mesh.setMatrixAt(i, m); });
  mesh.instanceMatrix.needsUpdate = true;

  return {
    mesh,
    pulse(i: number, amount = 0.8) { activity[i] = Math.min(1, activity[i] + amount); },
    update(dt: number) {
      mat.uniforms.uTime.value += dt;
      const decay = Math.exp(-dt * 2.4);
      let any = false;
      for (let i = 0; i < count; i++) { if (activity[i] > 0.001) { activity[i] *= decay; any = true; } }
      if (any) aActivity.needsUpdate = true;
    },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
