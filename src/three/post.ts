import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import passVert from './shaders/pass.vert';
import grainFrag from './shaders/grain.frag';

export function createComposer(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(size, 0.85, 0.65, 0.18);
  composer.addPass(bloom);
  const grain = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmount: { value: 0.06 } },
    vertexShader: passVert,
    fragmentShader: grainFrag,
  });
  composer.addPass(grain);
  composer.addPass(new OutputPass());

  return {
    render(dt: number) { grain.uniforms.uTime.value += dt; composer.render(); },
    resize(w: number, h: number) { composer.setSize(w, h); bloom.setSize(w, h); },
    dispose() { composer.dispose(); },
  };
}
