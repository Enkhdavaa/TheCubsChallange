import * as THREE from "three";
import { RepeatingImagePosition } from "./repeatingImagePosition.ts";
import { addFrameCallback } from "../helper/frameCallback.ts";

interface CreateRepeatingImageOptions {
  imagePath: string;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  repeatX: number;
  position: RepeatingImagePosition;
  speedMultiplier?: number;
  getSpeed?: () => number;
  zOffset?: number;
}

export function createRepeatingImage({
  imagePath,
  camera,
  scene,
  repeatX,
  position,
  speedMultiplier = 0.005,
  getSpeed,
  zOffset = -1,
}: CreateRepeatingImageOptions): void {
  const loader = new THREE.TextureLoader();

  loader.load(imagePath, (texture: THREE.Texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const viewWidth = camera.right - camera.left;
    const viewHeight = camera.top - camera.bottom;

    // Geometry should match the texture’s world size
    const height = viewHeight / repeatX;
    const geometry = new THREE.PlaneGeometry(viewWidth, height);
    texture.repeat.set(repeatX, 1);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);

    let heightOffset = 0;
    if (position === RepeatingImagePosition.BOTTOM) {
      heightOffset = height / 2;
    } else if (position === RepeatingImagePosition.TOP) {
    } else if (position === RepeatingImagePosition.MIDDLE) {
    }

    mesh.position.set(
      camera.left + viewWidth / 2,
      camera.bottom + heightOffset,
      zOffset,
    );

    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    scene.add(mesh);

    if (getSpeed) {
      addFrameCallback(() => {
        texture.offset.x += getSpeed() * speedMultiplier;
      });
    }
  });
}
