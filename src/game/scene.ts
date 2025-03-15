import * as THREE from "three";
import sizes from "./size.ts";
import camera from "./camera.ts";

globalThis.addEventListener("resize", () => {
  // Update sizes
  sizes.width = globalThis.innerWidth;
  sizes.height = globalThis.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// Scene
const scene = new THREE.Scene();
scene.add(camera);

// Renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const tick = () => {
  renderer.render(scene, camera);
  globalThis.requestAnimationFrame(tick);
};

tick();

export default scene;
