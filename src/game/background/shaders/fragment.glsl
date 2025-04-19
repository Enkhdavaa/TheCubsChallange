uniform float uTime;
varying vec2 vUv;

void main() {
  // Oscillate blend factor over time (or use a player-controlled value instead)
  float blend = 0.5 + 0.5 * sin(uTime * 0.05);

  // Day colors
  vec3 dayTop = vec3(0.5, 0.8, 1.0);     // Light blue sky
  vec3 dayBottom = vec3(1.0, 0.8, 0.5);  // Warm ground

  // Night colors
  vec3 nightTop = vec3(0.05, 0.05, 0.2);   // Dark blue
  vec3 nightBottom = vec3(0.2, 0.1, 0.05); // Deep orange ground

  // Interpolate between day and night based on blend
  vec3 topColor = mix(nightTop, dayTop, blend);
  vec3 bottomColor = mix(nightBottom, dayBottom, blend);

  float gradient = smoothstep(0.0, 1.0, vUv.y);
  vec3 color = mix(bottomColor, topColor, gradient);
  
  gl_FragColor = vec4(color, 1.0);
}
