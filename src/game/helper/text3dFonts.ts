import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const fontLoader = new FontLoader();

const helvetiker_regular = await fontLoader.loadAsync(
  "/fonts/helvetiker/helvetiker_regular.typeface.json",
  (font: any) => {
    return font;
  }
);

const matrixtype_regular = await fontLoader.loadAsync(
  "/fonts/matrixtype/matrixtype_display_regular.json",
  (font: any) => {
    return font;
  }
);

const glitch_regular = await fontLoader.loadAsync(
  "/fonts/glitch/glitch_goblin_regular.json",
  (font: any) => {
    return font;
  }
);

const superrugged_regular = await fontLoader.loadAsync(
  "/fonts/superrugged/superrugged_regular.json",
  (font: any) => {
    return font;
  }
);

export const helvetiker_regular_font = helvetiker_regular;
export const matrixtype_regular_font = matrixtype_regular;
export const glitch_regular_font = glitch_regular;
export const superrugged_regular_font = superrugged_regular;
