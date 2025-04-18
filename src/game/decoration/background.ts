import * as THREE from "three";
import { addToScene } from "../scene.ts";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export const LoadBackground = () => {
  const planeGeometry = new THREE.PlaneGeometry(2, 2, 32, 32);

  const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniform: {
      uTime: { value: 0 },
    },
  });

  //   const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  //   scene.add(plane);
};
