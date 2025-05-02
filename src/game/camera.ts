import * as THREE from "three";
import { getAspectRatio } from "./size.ts";

const aspect = getAspectRatio();
const viewHeight = 5;
const viewWidth = aspect * viewHeight;

const persCamera = new THREE.PerspectiveCamera(75, aspect);
persCamera.position.z = 3;

const orthoCamera = new THREE.OrthographicCamera(
  -viewWidth / 2,
  viewWidth / 2,
  viewHeight / 2,
  -viewHeight / 2,
  0.1,
  1000
);

orthoCamera.position.z = 10;

export function updateOrthographicCamera() {
  const aspect = getAspectRatio();

  orthoCamera.left = (-aspect * viewHeight) / 2;
  orthoCamera.right = (aspect * viewHeight) / 2;
  orthoCamera.top = viewHeight / 2;
  orthoCamera.bottom = -viewHeight / 2;
  orthoCamera.updateProjectionMatrix();
}

export const orthographicCamera = orthoCamera;
export const cameraViewHeight = viewHeight;
export const perspectiveCamera = persCamera;
