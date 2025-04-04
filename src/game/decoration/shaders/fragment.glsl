varying vec2 vUv;

void main()
{
    float strength = vUv.x;
    gl_FragColor = vec4(vUv, 0.5, 1.0);

    #include <colorspace_fragment>
}