varying vec2 vUv;
uniform float uTime;

void main() {
    vec3 topColor = vec3(0.1, 0.2, 0.4);  // Night sky blue
    vec3 bottomColor = vec3(0.9, 0.5, 0.2); // Sunset orange
    float gradient = smoothstep(0.0, 1.0, vUv.y + 0.05 * sin(uTime * 0.5));
    vec3 color = mix(bottomColor, topColor, gradient);
    gl_FragColor = vec4(color, 1.0);
}