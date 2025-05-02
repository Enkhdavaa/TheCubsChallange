import * as THREE from "three";
import { sizes } from "./size.ts";
import { orthographicCamera, updateOrthographicCamera } from "./camera.ts";

globalThis.addEventListener("resize", () => {
  updateOrthographicCamera();

  // Update renderer
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
});

// Scene
export const scene = new THREE.Scene();
scene.add(orthographicCamera);

// Renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

const { width, height } = sizes();

renderer.setSize(width, height);

const tick = () => {
  renderer.render(scene, orthographicCamera);
  globalThis.requestAnimationFrame(tick);
};

tick();
