import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import scene from "../scene.ts";

const fontLoader = new FontLoader();
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcap/1.png");

export const RenderScreenText = () => {
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font: any) => {
    const textGeometry = new TextGeometry("The Cubs Run Club", {
      font: font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });

    textGeometry.center();

    const textMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);
  });
};
