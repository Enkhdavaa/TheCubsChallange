import * as THREE from "three";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { helvetiker_regular_font } from "./text3dFonts.ts";
import { matcapMaterial1 } from "./textures.ts";

export default function Add3DTextMesh(text: string, size: number): THREE.Mesh {
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

  return new THREE.Mesh(textGeometry, matcapMaterial1);
}
