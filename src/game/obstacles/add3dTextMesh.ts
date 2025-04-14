import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { helvetiker_regular_font } from "../helper/text3dFonts.ts";

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcap/1.png");

export default function Add3DText(text: string, size: number): THREE.Mesh {
  const textGeometry = new TextGeometry(text, {
    font: helvetiker_regular_font,
    size: size,
    depth: 0.001,
    curveSegments: 1,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 2,
  });

  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  return new THREE.Mesh(textGeometry, textMaterial);
}
