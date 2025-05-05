import { scene } from "../scene.ts";
import add3DTextMesh from "../helper/add3dTextMesh.ts";
import { matrixtype_regular_font } from "../helper/text3dFonts.ts";
import { matcapMaterial1 } from "../helper/textures.ts";
import { getIntroTextPosition } from "../positions.ts";

export const RenderScreenText = () => {
  const textMesh = add3DTextMesh(
    "The Cubs Run Club",
    0.6,
    matrixtype_regular_font,
    matcapMaterial1
  );

  const position = getIntroTextPosition();
  textMesh.position.set(position.x, position.y, 0);
  textMesh.rotation.x = (Math.PI / 2) * 0.2;

  scene.add(textMesh);
};
