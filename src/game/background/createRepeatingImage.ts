import * as THREE from "three";
import { RepeatingImagePosition } from "./repeatingImagePosition.ts";
import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { addResizeCallback } from "../helper/resizeCallback.ts";

interface CreateRepeatingImageOptions {
  texture: THREE.Texture;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  // World size of one copy of the image
  tileWidth: number;
  height: number;
  position: RepeatingImagePosition;
  // 1 moves with the ground, lower values drift slower (further away)
  parallax?: number;
  // World units per second
  getSpeed?: () => number;
  zOffset?: number;
}

// A strip that repeats the image across the view and scrolls it
export function createRepeatingImage({
  texture,
  camera,
  scene,
  tileWidth,
  height,
  position,
  parallax = 1,
  getSpeed,
  zOffset = -1,
}: CreateRepeatingImageOptions): THREE.Mesh {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  // A unit-wide plane, stretched to the view width on resize
  const geometry = new THREE.PlaneGeometry(1, height);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.matrixAutoUpdate = false;

  const fitToView = () => {
    const viewWidth = camera.right - camera.left;
    const viewHeight = camera.top - camera.bottom;

    let y = camera.bottom + viewHeight / 2;
    if (position === RepeatingImagePosition.BOTTOM) {
      y = camera.bottom + height / 2;
    } else if (position === RepeatingImagePosition.TOP) {
      y = camera.top - height / 2;
    }

    // Keep the image's proportions; a wider view shows more copies
    texture.repeat.set(viewWidth / tileWidth, 1);
    mesh.scale.x = viewWidth;
    mesh.position.set(camera.left + viewWidth / 2, y, zOffset);
    mesh.updateMatrix();
  };

  fitToView();
  addResizeCallback(fitToView);

  scene.add(mesh);

  if (getSpeed) {
    addFrameCallback(() => {
      const distance = getSpeed() * parallax * getDeltaTime();
      texture.offset.x = (texture.offset.x + distance / tileWidth) % 1;
    });
  }

  return mesh;
}
