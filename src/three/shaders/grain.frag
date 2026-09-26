uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uAmount;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  float g = (hash(vUv * vec2(1920.0, 1080.0) + fract(uTime * 7.0)) - 0.5) * uAmount;
  c.rgb += g;
  float d = distance(vUv, vec2(0.5));
  c.rgb *= 0.62 + 0.38 * smoothstep(0.92, 0.30, d);
  gl_FragColor = c;
}
