precision mediump float;

varying vec2 vUv;
varying float vDelay;

uniform sampler2D uTexFront;  // 表面のテクスチャ
uniform sampler2D uTexBack;   // 裏面のテクスチャ
uniform float uProgress;

void main() {
  // 面の向きを判定（gl_FrontFacingは表面でtrue、裏面でfalse）
  if (gl_FrontFacing) {
    // 表面：フロントテクスチャを表示
    vec4 frontTex = texture(uTexFront, vUv);
    gl_FragColor = frontTex;
  } else {
    // 裏面：バックテクスチャを表示
    vec4 backTex = texture(uTexBack, vUv);
    gl_FragColor = backTex;
  }
}