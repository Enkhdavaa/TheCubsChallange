import * as THREE from "three";
import { getAspectRatio, sizes } from "./size.ts";
import camera from "./camera.ts";
import { bgCamera, bgScene } from "./background/scene.ts";

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

const tick = () => {
  renderer.autoClear = false;
  renderer.clear();

  renderer.render(bgScene, bgCamera);
  renderer.render(scene, camera);
  globalThis.requestAnimationFrame(tick);
};

tick();

export function addToScene(mesh: THREE.Mesh) {
  const aspectRation = getAspectRatio();
  mesh.scale.set(aspectRation, aspectRation, 1);
  scene.add(mesh);
}

export function removeFromScene(mesh: THREE.Mesh) {
  scene.remove(mesh);
}
