import * as THREE from "three";
import sizes from "./size.ts";
import { SpriteFlipBook } from "./spriteFlipBook.ts";
import { SpriteAnimationSelector } from "./spriteAnimationSelector.ts";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Add sprite
const run = new SpriteFlipBook("/sprites/player/run.png", 8, 1, scene);
run.loop([0, 1, 2, 3, 4, 5, 6, 7], 0.7);

const walk = new SpriteFlipBook("/sprites/player/walk.png", 8, 1, scene);
walk.loop([0, 1, 2, 3, 4, 5, 6, 7], 0.7);

const idle = new SpriteFlipBook("/sprites/player/idle.png", 10, 1, scene);
idle.loop([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.7);

// Animation selector
const spriteAnimationSelector = new SpriteAnimationSelector(
  [run, walk, idle],
  0
);

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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

// Animation
const tick = () => {
  // Time
  spriteAnimationSelector.update();

  renderer.render(scene, camera);
  globalThis.requestAnimationFrame(tick);
};

tick();
