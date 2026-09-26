attribute float aActivity;
attribute float aPhase;
uniform float uTime;
varying float vFresnel;
varying float vActivity;

void main() {
  float s = 1.0 + 0.06 * sin(uTime * 1.4 + aPhase) + aActivity * 0.45;
  vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(position * s, 1.0);
  vec3 n = normalize(normalMatrix * mat3(instanceMatrix) * normal);
  vec3 viewDir = normalize(-mvPos.xyz);
  vFresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.2);
  vActivity = aActivity;
  gl_Position = projectionMatrix * mvPos;
}
