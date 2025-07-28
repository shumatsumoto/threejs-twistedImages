precision mediump float;

varying vec2 vUv;
varying float vDelay;

uniform sampler2D uTexFront;  // 表面のテクスチャ
uniform sampler2D uTexBack;   // 裏面のテクスチャ
uniform float uProgress;

void main() {
  vec4 frontTex = texture(uTexFront, vUv);
  gl_FragColor = frontTex;
}