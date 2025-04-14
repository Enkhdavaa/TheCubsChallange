import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const fontLoader = new FontLoader();

const helvetiker_regular = await fontLoader.loadAsync(
  "/fonts/helvetiker_regular.typeface.json",
  (font: any) => {
    return font;
  }
);

export const helvetiker_regular_font = helvetiker_regular;
