import { scene } from "../scene.ts";
import { orthographicCamera } from "../camera.ts";
import { createRepeatingImage } from "./createRepeatingImage.ts";

// const bushTexture = textureLoader.load("sprites/background/park.png");

// const bushMaterial = new THREE.MeshBasicMaterial({
//   map: bushTexture,
//   transparent: true,
// });

export const LoadBackground = () => {
  createRepeatingImage({
    imagePath: "sprites/background/eindhoven.png",
    camera: orthographicCamera,
    scene: scene,
  });
  //   const bushGeometry = new THREE.PlaneGeometry(2, 0.5, 32, 32);
  //   const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);
  //   bushMesh.position.set(0, -0.8, 0);
  //   scene.add(bushMesh);
};
