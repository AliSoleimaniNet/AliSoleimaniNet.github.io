uniform vec3 uColor;
uniform vec3 uHot;
varying float vFresnel;
varying float vActivity;

void main() {
  vec3 core = uColor * 0.10;
  vec3 rim = mix(uColor, uHot, vActivity);
  vec3 col = mix(core, rim, vFresnel * 1.15);
  col += uHot * vActivity * 0.5;
  float alpha = 0.65 + vFresnel * 0.35;
  gl_FragColor = vec4(col, alpha);
}
