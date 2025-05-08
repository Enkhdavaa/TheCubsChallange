varying vec2 vUv;

float circle(vec2 uv, vec2 center, float radius) {
  return smoothstep(radius, radius - 0.01, distance(uv, center));
}

float cloud(vec2 uv) {
  uv *= 5.0;
  return smoothstep(0.5, 0.0, fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453));
}

void main() {
  vec3 topColor = vec3(0.0, 0.5, 0.9);
  vec3 bottomColor = vec3(0.7, 0.9, 1.0);
  vec3 sky = mix(bottomColor, topColor, vUv.y);

  // Add sun
  float sun = circle(vUv, vec2(0.8, 0.85), 0.07);
  vec3 sunColor = vec3(1.0, 0.9, 0.6);
  sky = mix(sky, sunColor, sun);

  // Add simple clouds
  float c = cloud(vUv + vec2(0.1, 0.0));
  vec3 cloudColor = vec3(1.0);
  sky = mix(sky, cloudColor, c * 0.2); // faint clouds

  gl_FragColor = vec4(sky, 1.0);
}
