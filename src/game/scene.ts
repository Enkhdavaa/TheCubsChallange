import * as THREE from "three";
import { sizes } from "./size.ts";
import camera from "./camera.ts";

globalThis.addEventListener("resize", () => {
  // Update sizes
  const { width, height } = sizes();

  // Update camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
});

// Scene
const scene = new THREE.Scene();
scene.add(camera);

// Renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

const { width, height } = sizes();

renderer.setSize(width, height);
renderer.render(scene, camera);

const tick = () => {
  renderer.render(scene, camera);
  globalThis.requestAnimationFrame(tick);
};

tick();

export default scene;
