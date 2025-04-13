varying vec2 vUv;

// Hash function for pseudo-random star positions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Star intensity falloff
float star(vec2 uv, vec2 pos, float size) {
    float d = distance(uv, pos);
    float intensity = size / d;
    intensity = clamp(intensity, 0.0, 1.0);
    return pow(intensity, 4.0);
}

void main()
{
    vec3 color = vec3(0.0);

    // Grid size for stars
    float gridSize = 4.0;

    // Loop over nearby star "cells"
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 grid = floor(vUv * gridSize) + vec2(x, y);
            vec2 rand = vec2(hash(grid), hash(grid + 1.0));
            vec2 starPos = (grid + rand) / gridSize;

            float shine = star(vUv, starPos, 0.03);
            color += vec3(shine);
        }
    }

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}
