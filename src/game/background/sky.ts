import * as THREE from "three";
import { scene } from "../scene.ts";
import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { getCameraBounds } from "../camera.ts";
import { mainCharacter } from "../characters/main/mainCharacter.ts";

// Clouds drift slowly on their own and a little faster while running
const clouds = [
  {
    sprite: createPixelSprite(
      "sprites/clouds/cloud1.png",
      [-2, 2.5, -1],
      [2, 1, 1],
    ),
    drift: 0.25,
    parallax: 0.06,
  },
  {
    sprite: createPixelSprite(
      "sprites/clouds/cloud2.png",
      [1, 2.8, -1],
      [1.5, 0.8, 1],
    ),
    drift: 0.15,
    parallax: 0.04,
  },
];

function createPixelSprite(
  url: string,
  position: [number, number, number],
  scale: [number, number, number],
) {
  const texture = new THREE.TextureLoader().load(url);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.set(...position);
  sprite.scale.set(...scale);
  return sprite;
}

function animate() {
  const { left, right } = getCameraBounds();
  const worldSpeed = mainCharacter.getWorldSpeed();

  clouds.forEach(({ sprite, drift, parallax }) => {
    sprite.position.x -= (drift + worldSpeed * parallax) * getDeltaTime();

    // Loop clouds back in from the right
    const halfWidth = sprite.scale.x / 2;
    if (sprite.position.x < left - halfWidth) {
      sprite.position.x = right + halfWidth;
    }
  });
}

clouds.forEach(({ sprite }) => scene.add(sprite));

export const addSkyPlaneToScene = () => {
  addFrameCallback(animate);
  scene.background = new THREE.Color(0x87ceeb); // Sky blue
};
