uniform vec3 uColor;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(uColor * 0.9, vAlpha * 0.85);
}
