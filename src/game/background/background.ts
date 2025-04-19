import * as THREE from "three";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { addFrameCallback, getElapsedTime } from "../helper/frameCallback.ts";
import { bgScene } from "./scene.ts";

const planeGeometry = new THREE.PlaneGeometry(2, 2, 32, 32);

const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uTime: { value: 0.0 },
  },
  side: THREE.DoubleSide,
});

addFrameCallback(() => {
  planeMaterial.uniforms.uTime.value = getElapsedTime();
});

export const LoadBackground = () => {
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, 0, -1);
  bgScene.add(plane);
};
