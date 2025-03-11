import * as THREE from "three";
import sizes from "./size.ts";
import { SpriteFlipBook } from "./spriteFlipBook.ts";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// Add sprite
const flipbook = new SpriteFlipBook("/sprites/player/run.png", 8, 1, scene);
flipbook.loop([0, 1, 2, 3, 4, 5, 6, 7], 0.7);

// Axes Helper
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// camera.lookAt(mesh.position);
// camera.lookAt(sprite.position);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

// Clock
const clock = new THREE.Clock();

let previousElapsedTime = clock.getElapsedTime();
// Animation
const tick = () => {
  // Time
  const currentElapsedTime = clock.getElapsedTime();
  const deltaTime = currentElapsedTime - previousElapsedTime;
  previousElapsedTime = currentElapsedTime;

  flipbook.update(deltaTime);
  renderer.render(scene, camera);
  globalThis.requestAnimationFrame(tick);
};

tick();
