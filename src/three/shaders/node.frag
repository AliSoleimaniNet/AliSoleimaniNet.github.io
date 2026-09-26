uniform vec3 uColor;
uniform vec3 uHot;
varying float vFresnel;
varying float vActivity;

void main() {
  vec3 core = uColor * 0.10;
  vec3 rim = mix(uColor, uHot, vActivity);
  vec3 col = mix(core, rim, vFresnel);
  col += uHot * vActivity * 0.9;
  float alpha = 0.55 + vFresnel * 0.45;
  gl_FragColor = vec4(col, alpha);
}
