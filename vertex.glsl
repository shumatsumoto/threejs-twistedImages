precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)
#pragma glslify: easeCubic = require(glsl-easings/cubic-in-out)
#pragma glslify: rotate = require(glsl-rotate/rotate)

varying vec2 vUv;
varying float vDelay;
attribute float aDelay;
uniform float uProgress;

const float HALF_PI = 1.570796327;

void main() {
	vUv = uv;
	vDelay = aDelay;
	vec3 pos = position;
	float delay = clamp(uProgress * 1.2 - aDelay * 0.2, 0., 1.);
	float progress = easeCubic(delay);
	pos.z -= 200.;

	// 画像ツイスト
	vec3 axis = vec3(-1.0, -1.0, 0.0);
	pos = rotate(pos, axis, 4.0 * HALF_PI * progress);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}