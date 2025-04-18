import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export default function add3DTextMesh(
  text: string,
  size: number,
  font: THREE.Font,
  matcapMaterial: any,
  bevelThickness: number = 0.02,
  bevelSegments: number = 2,
  bevelSize: number = 0.01
): THREE.Mesh {
  const textGeometry = new TextGeometry(text, {
    font: font,
    size: size,
    depth: 0.001,
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
