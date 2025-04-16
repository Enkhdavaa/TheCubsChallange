import { AddToScene } from "../scene.ts";
import { normalizedToCanvas } from "../helper/helper.ts";
import Add3DTextMesh from "../helper/add3dTextMesh.ts";
import { matrixtype_regular_font } from "../helper/text3dFonts.ts";
import { matcapMaterial1 } from "../helper/textures.ts";

export const RenderScreenText = () => {
  const textMesh = Add3DTextMesh(
    "The Cubs Run Club",
    0.2,
    matrixtype_regular_font,
    matcapMaterial1
  );

  const position = normalizedToCanvas(0, 0.8);
  textMesh.position.set(position.x, position.y, 0);
  textMesh.rotation.x = (Math.PI / 2) * 0.2;

  AddToScene(textMesh);
};
