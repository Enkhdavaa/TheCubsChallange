import * as THREE from "three";
import { getViewAspect, orthographicCamera, setCameraAspect } from "./camera.ts";
import { notifyResize } from "./helper/resizeCallback.ts";
import { setRenderCallback } from "./helper/frameCallback.ts";

globalThis.addEventListener("resize", () => {
  resizeCanvas();
});

// Scene
export const scene = new THREE.Scene();
scene.add(orthographicCamera);

// Renderer
const container = document.querySelector<HTMLElement>(".game")!;
const canvas = document.querySelector<HTMLCanvasElement>("canvas.webgl")!;
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: false,
  alpha: false,
});

renderer.setClearColor(0x000000, 1);

// Uploads a loaded texture to the GPU now, so the first frame that
// shows it doesn't stall
export function preloadTexture(texture: THREE.Texture) {
  renderer.initTexture(texture);
}

resizeCanvas();

// Rendered in the same frame loop as the updates, after them
setRenderCallback(() => {
  renderer.render(scene, orthographicCamera);
});

function resizeCanvas() {
  const winW = globalThis.innerWidth;
  const winH = globalThis.innerHeight;
  const aspect = getViewAspect();

  let viewWidth, viewHeight;

  if (winW / winH > aspect) {
    viewHeight = winH;
    viewWidth = viewHeight * aspect;
  } else {
    viewWidth = winW;
    viewHeight = viewWidth / aspect;
  }

  viewWidth = Math.floor(viewWidth);
  viewHeight = Math.floor(viewHeight);

  // The container holds the canvas and the HUD overlays
  container.style.width = `${viewWidth}px`;
  container.style.height = `${viewHeight}px`;

  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
  renderer.setSize(viewWidth, viewHeight);

  setCameraAspect(aspect);
  notifyResize();
}
