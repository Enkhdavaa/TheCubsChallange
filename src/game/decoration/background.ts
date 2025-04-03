import * as THREE from "three";
import scene from "../scene.ts";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export const LoadBackground = () => {
  const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);

  const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    // side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  //   plane.position.set(0, -0.5, -1);
  //   plane.scale.set(3.5, 0.5, 1);
  scene.add(plane);
};
