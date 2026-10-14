import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const fontLoader = new FontLoader();

// Only the title uses a 3D font; the game waits for it before starting
const matrixtype_regular = await fontLoader.loadAsync(
  "/fonts/matrixtype/matrixtype_display_regular.json",
);

export const matrixtype_regular_font = matrixtype_regular;
