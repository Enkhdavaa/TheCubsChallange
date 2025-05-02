import * as THREE from "three";
import { sizes } from "../size.ts";
import { perspectiveCamera, cameraViewHeight } from "../camera.ts";

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

export function normalizedToCanvasX(normX: number): number {
  // Ensure normX and normY are within the expected range (-1 to 1)
  normX = THREE.MathUtils.clamp(normX, -1, 1);

  // Get camera aspect ratio
  const { width, height } = sizes();
  const aspect = width / height;

  // Depth
  const depth = perspectiveCamera.position.z;

  // Compute frustum height at given depth
  const frustumHeight =
    2 * Math.tan((perspectiveCamera.fov * Math.PI) / 360) * Math.abs(depth);
  const frustumWidth = frustumHeight * aspect;

  // Convert normalized coordinates to world space
  const worldX = (normX * frustumWidth) / 2;
  return worldX;
}

export function generateAscendingArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}
