import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
const matcapTexture1 = textureLoader.load("/textures/matcap/1.png");
const matcapTexture2 = textureLoader.load("/textures/matcap/2.png");

export const matcapMaterial1 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture1,
  lights: true,
  emissive: new THREE.Color(0x000000),
  emissiveIntensity: 4,
});

export const matcapMaterial2 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture2,
});
