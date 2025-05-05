import * as THREE from "three";

export function getScreenAnchor(
  xFraction: number,
  yFraction: number,
  camera: THREE.Camera
): THREE.Vector3 {
  const viewHeight = camera.top - camera.bottom;
  const viewWidth = camera.right - camera.left;

  const x = camera.left + xFraction * viewWidth;
  const y = camera.bottom + yFraction * viewHeight;

  return new THREE.Vector3(x, y, 0);
}

export function generateAscendingArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

export function getObjectWidth(object: THREE.Object3D): number {
  if (object instanceof THREE.Sprite) {
    return object.scale.x;
  }

  if (object instanceof THREE.Mesh && object.geometry) {
    object.geometry.computeBoundingBox();
    const box = object.geometry.boundingBox!;
    const width = (box.max.x - box.min.x) * object.scale.x;
    return width;
  }

  if (object instanceof THREE.Box3) {
    const box = object;
    const width = (box.max.x - box.min.x) * object.scale.x;
    return width;
  }

  console.warn("Unsupported object type for width calculation:", object);
  return 0;
}
