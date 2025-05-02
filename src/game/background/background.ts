import * as THREE from "three";

// import vertexShader from "./shaders/vertex.glsl";
// import fragmentShader from "./shaders/fragment.glsl";
// import { addFrameCallback, getElapsedTime } from "../helper/frameCallback.ts";
import { textureLoader } from "../helper/textures.ts";
import { scene } from "../scene.ts";

const buildingTexture = textureLoader.load("sprites/background/eindhoven.png");
const bushTexture = textureLoader.load("sprites/background/park.png");

const buildingMaterial = new THREE.MeshBasicMaterial({
  map: buildingTexture,
  transparent: true,
});

const bushMaterial = new THREE.MeshBasicMaterial({
  map: bushTexture,
  transparent: true,
});

// const planeGeometry = new THREE.PlaneGeometry(2, 2, 32, 32);

// const planeMaterial = new THREE.ShaderMaterial({
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
//   uniforms: {
//     uTime: { value: 0.0 },
//   },
//   side: THREE.DoubleSide,
// });

// addFrameCallback(() => {
//   //   planeMaterial.uniforms.uTime.value = getElapsedTime();
// });

export const LoadBackground = () => {
  const buildingGeometry = new THREE.PlaneGeometry(2, 1, 32, 32);
  const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);

  const bushGeometry = new THREE.PlaneGeometry(2, 0.5, 32, 32);
  const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);

  bushMesh.position.set(0, 0, -1);
  buildingMesh.position.set(0, 0, -1);

  scene.add(buildingMesh);
  //   scene.add(bushMesh);
};
