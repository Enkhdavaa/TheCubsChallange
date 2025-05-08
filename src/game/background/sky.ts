import * as THREE from "three";
import { scene } from "../scene.ts";
import { addFrameCallback } from "../helper/frameCallback.ts";

const cloud1 = createPixelSprite(
  "sprites/clouds/cloud1.png",
  [-2, 2.5, -1],
  [2, 1, 1]
);
const cloud2 = createPixelSprite(
  "sprites/clouds/cloud2.png",
  [1, 2.8, -1],
  [1.5, 0.8, 1]
);

function createPixelSprite(url: string, position: number[], scale: number[]) {
  const texture = new THREE.TextureLoader().load(url);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

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
  cloud1.position.x += 0.005;
  cloud2.position.x += 0.003;
  // Loop clouds
  if (cloud1.position.x > 8) cloud1.position.x = -8;
  if (cloud2.position.x > 8) cloud2.position.x = -8;
}

scene.add(cloud1);
scene.add(cloud2);

export const addSkyPlaneToScene = () => {
  addFrameCallback(animate);
  scene.background = new THREE.Color(0x87ceeb); // Sky blue
};
