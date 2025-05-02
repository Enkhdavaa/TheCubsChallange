import * as THREE from "three";
import { cameraViewHeight } from "../camera.ts";

export function getScreenAnchor(
  xFraction: number,
  yFraction: number,
  viewHeight = cameraViewHeight
) {
  const aspect = globalThis.innerWidth / globalThis.innerHeight;
  const viewWidth = viewHeight * aspect;

  const x = -viewWidth / 2 + viewWidth * xFraction;
  const y = -viewHeight / 2 + viewHeight * yFraction;

  return new THREE.Vector3(x, y, 0);
}

export function generateAscendingArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}
