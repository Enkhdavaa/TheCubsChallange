import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
const matcapTexture1 = textureLoader.load("/textures/matcap/1.png");

export const matcapMaterial1 = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture1,
});
