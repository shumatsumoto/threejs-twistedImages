precision mediump float;

#pragma glslify: easeBack = require(glsl-easings/back-in-out)

varying vec2 vUv;
varying float vDelay;
attribute float aDelay;

uniform float uProgress;

void main() {
	vUv = uv;
	vDelay = aDelay;

	vec3 pos = position;
	float delay = distance(vec2(0., 1.), uv) / distance(vec2(0., 1.), vec2(1., 0.));

	float x = clamp(uProgress * 1.3 - delay * 0.3, 0., 1.);
	float progress = easeBack(x);
	pos.z += progress * 100.0;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}