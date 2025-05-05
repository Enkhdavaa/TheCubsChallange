import * as THREE from "three";
import { orthographicCamera } from "./camera.ts";
import { SETTINGS } from "./settings.ts";

const {
  Min_INTERNAL_WIDTH: INTERNAL_WIDTH,
  MIN_INTERNAL_HEIGHT: INTERNAL_HEIGHT,
  ASPECT_RATIO: ASPECT_RATIO,
} = SETTINGS;

globalThis.addEventListener("resize", () => {
  resizeCanvas();
});

// Scene
export const scene = new THREE.Scene();
scene.add(orthographicCamera);

// Renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: false,
  alpha: false,
});

renderer.setSize(INTERNAL_WIDTH, INTERNAL_HEIGHT, false);
renderer.setClearColor(0x000000, 1);
renderer.setPixelRatio(1);

resizeCanvas();

const tick = () => {
  renderer.render(scene, orthographicCamera);
  globalThis.requestAnimationFrame(tick);
};

tick();

function resizeCanvas() {
  const winW = globalThis.innerWidth;
  const winH = globalThis.innerHeight;
  const winAspect = winW / winH;

  const targetAspect = ASPECT_RATIO;

  let viewWidth, viewHeight;

  if (winAspect > targetAspect) {
    viewHeight = winH;
    viewWidth = viewHeight * targetAspect;
  } else {
    viewWidth = winW;
    viewHeight = viewWidth / targetAspect;
  }

  renderer.setSize(viewWidth, viewHeight);
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
}
