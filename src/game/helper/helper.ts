import * as THREE from "three";
import sizes from "../size.ts";
import camera from "../camera.ts";

function screenToWorld(
  x: number,
  y: number,
  camera: THREE.camera,
  canvas: HTMLCanvasElement
): THREE.Vector3 {
  // Convert screen coordinates (pixels) to normalized device coordinates (NDC)
  const ndcX = (x / canvas.clientWidth) * 2 - 1;
  const ndcY = -(y / canvas.clientHeight) * 2 + 1; // Invert Y for Three.js

  // Create a vector at the given NDC position and unproject it
  const vector = new THREE.Vector3(ndcX, ndcY, 0); // 0 = near plane
  vector.unproject(camera);

  // Return the world coordinates
  return vector;
}

export function normalizedToCanvas(
  normX: number,
  normY: number
): THREE.Vector3 {
  // Ensure normX and normY are within the expected range (-1 to 1)
  normX = THREE.MathUtils.clamp(normX, -1, 1);
  normY = THREE.MathUtils.clamp(normY, -1, 1);

  // Get camera aspect ratio
  const aspect = sizes.width / sizes.height;

  // Depth
  const depth = camera.position.z;

  // Compute frustum height at given depth
  const frustumHeight =
    2 * Math.tan((camera.fov * Math.PI) / 360) * Math.abs(depth);
  const frustumWidth = frustumHeight * aspect;

  // Convert normalized coordinates to world space
  const worldX = (normX * frustumWidth) / 2;
  const worldY = (normY * frustumHeight) / 2;

  const worldPos = new THREE.Vector3(worldX, worldY, 0);

  return worldPos;
}

export function normalizedToCanvasX(normX: number): number {
  // Ensure normX and normY are within the expected range (-1 to 1)
  normX = THREE.MathUtils.clamp(normX, -1, 1);

  // Get camera aspect ratio
  const aspect = sizes.width / sizes.height;

  // Depth
  const depth = camera.position.z;

  // Compute frustum height at given depth
  const frustumHeight =
    2 * Math.tan((camera.fov * Math.PI) / 360) * Math.abs(depth);
  const frustumWidth = frustumHeight * aspect;

  // Convert normalized coordinates to world space
  const worldX = (normX * frustumWidth) / 2;
  return worldX;
}

export function generateAscendingArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}
