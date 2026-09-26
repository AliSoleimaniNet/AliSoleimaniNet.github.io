attribute float aEdge;
attribute float aSeed;
attribute float aSpeed;
attribute float aTrail;
uniform sampler2D uCurves;
uniform float uEdges;
uniform float uSamples;
uniform float uTime;
uniform float uSize;
varying float vAlpha;

void main() {
  float t = fract(aSeed + uTime * aSpeed) - aTrail * 0.028;
  vAlpha = 1.0 - aTrail * 0.3;
  if (t < 0.0) { t = 0.0; vAlpha = 0.0; }
  // sample the pre-baked curve at texel centers so t in [0,1] maps exactly onto the samples
  float u = (0.5 + t * (uSamples - 1.0)) / uSamples;
  float v = (aEdge + 0.5) / uEdges;
  vec3 p = texture2D(uCurves, vec2(u, v)).xyz;
  float sc = uSize * (1.0 - aTrail * 0.22);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  mv.xyz += position * sc;
  gl_Position = projectionMatrix * mv;
}
