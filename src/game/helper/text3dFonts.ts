import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const fontLoader = new FontLoader();

const helvetiker_regular = await fontLoader.loadAsync(
  "/fonts/helvetiker_regular.typeface.json",
  (font: any) => {
    return font;
  }
);

const matrixtype_regular = await fontLoader.loadAsync(
  "/fonts/matrixtype_display_regular.json",
  (font: any) => {
    return font;
  }
);

export const helvetiker_regular_font = helvetiker_regular;
export const matrixtype_regular_font = matrixtype_regular;
