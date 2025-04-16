import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export default function Add3DTextMesh(
  text: string,
  size: number,
  font: THREE.Font,
  matcapMaterial: THREE.MeshMatcapMaterial
): THREE.Mesh {
  const textGeometry = new TextGeometry(text, {
    font: font,
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

  return new THREE.Mesh(textGeometry, matcapMaterial);
}
