import * as THREE from "three";

import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import type { Font } from "three/addons/loaders/FontLoader.js";

export default function add3DTextMesh(
  text: string,
  size: number,
  font: Font,
  matcapMaterial: THREE.Material,
  bevelThickness: number = 0.05,
  bevelSegments: number = 2,
  bevelSize: number = 0.01,
): THREE.Mesh<TextGeometry, THREE.Material> {
  const textGeometry = new TextGeometry(text, {
    font: font,
    size: size,
    depth: 0.01,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelOffset: 0,
    bevelSegments: bevelSegments,
  });

  textGeometry.center();

  return new THREE.Mesh(textGeometry, matcapMaterial);
}
