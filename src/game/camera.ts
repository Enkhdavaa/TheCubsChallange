import * as THREE from "three";
import { SETTINGS } from "./settings.ts";

const { VIEW_HEIGHT, MIN_ASPECT, MAX_ASPECT } = SETTINGS;

export function getViewAspect(): number {
  const windowAspect = globalThis.innerWidth / globalThis.innerHeight;
  return Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, windowAspect));
}

const initialHalfWidth = (VIEW_HEIGHT * getViewAspect()) / 2;

const orthoCamera = new THREE.OrthographicCamera(
  -initialHalfWidth,
  initialHalfWidth,
  VIEW_HEIGHT / 2,
  -VIEW_HEIGHT / 2,
  0.1,
  1000,
);

orthoCamera.position.z = 10;

export function setCameraAspect(aspect: number) {
  const halfWidth = (VIEW_HEIGHT * aspect) / 2;
  orthoCamera.left = -halfWidth;
  orthoCamera.right = halfWidth;
  orthoCamera.updateProjectionMatrix();
}

export function getCameraBounds() {
  const left = orthoCamera.left + orthoCamera.position.x;
  const right = orthoCamera.right + orthoCamera.position.x;
  const top = orthoCamera.top + orthoCamera.position.y;
  const bottom = orthoCamera.bottom + orthoCamera.position.y;

  return { left, right, top, bottom };
}

// True once the box has scrolled past the left edge; the margin covers
// art that sticks out beyond a hitbox
export function isPastLeftEdge(box: THREE.Box3, margin = 1): boolean {
  return box.max.x < getCameraBounds().left - margin;
}

export const orthographicCamera = orthoCamera;
