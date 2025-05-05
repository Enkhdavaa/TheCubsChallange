import * as THREE from "three";
import { SETTINGS } from "./settings.ts";

const {
  Min_INTERNAL_WIDTH: INTERNAL_WIDTH,
  MIN_INTERNAL_HEIGHT: INTERNAL_HEIGHT,
} = SETTINGS;

const orthoCamera = new THREE.OrthographicCamera(
  -INTERNAL_WIDTH / 2,
  INTERNAL_WIDTH / 2,
  INTERNAL_HEIGHT / 2,
  -INTERNAL_HEIGHT / 2,
  0.1,
  1000
);

orthoCamera.position.z = 10;

function getCameraBounds() {
  const left = orthoCamera.left + orthoCamera.position.x;
  const right = orthoCamera.right + orthoCamera.position.x;
  const top = orthoCamera.top + orthoCamera.position.y;
  const bottom = orthoCamera.bottom + orthoCamera.position.y;

  return { left, right, top, bottom };
}

export function isOffScreen(box: THREE.Box3): boolean {
  const { left, right, top, bottom } = getCameraBounds();
  return (
    box.max.x < left ||
    box.min.x > right ||
    box.max.y < bottom ||
    box.min.y > top
  );
}

export const orthographicCamera = orthoCamera;
