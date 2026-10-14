import * as THREE from "three";
import { scene } from "../scene.ts";
import { orthographicCamera } from "../camera.ts";
import { createRepeatingImage } from "./createRepeatingImage.ts";
import { addSkyPlaneToScene } from "./sky.ts";
import { RepeatingImagePosition } from "./repeatingImagePosition.ts";
import { createCityTexture } from "./cityTexture.ts";
import { createParkTexture } from "./parkTexture.ts";
import { createTrailTexture } from "./trailTexture.ts";
import { PIXELS_PER_UNIT } from "./tileCanvas.ts";
import { mainCharacter } from "../characters/main/mainCharacter.ts";
import { Scenery } from "../levels.ts";

const drawScenery: Record<Scenery, () => HTMLCanvasElement> = {
  city: createCityTexture,
  park: createParkTexture,
  trail: createTrailTexture,
};
const sceneries = new Map<Scenery, THREE.Mesh>();

// The running path (foreground overlay), moving with the ground; each
// scenery is drawn the first time it's shown
function getScenery(scenery: Scenery) {
  let mesh = sceneries.get(scenery);
  if (!mesh) {
    const canvas = drawScenery[scenery]();
    const texture = new THREE.CanvasTexture(canvas);
    // Canvas colors are sRGB; without this they render washed out
    texture.colorSpace = THREE.SRGBColorSpace;
    mesh = createRepeatingImage({
      texture,
      camera: orthographicCamera,
      scene: scene,
      // Every scenery is drawn at the same scale, so a wider image
      // repeats less often
      tileWidth: canvas.width / PIXELS_PER_UNIT,
      height: canvas.height / PIXELS_PER_UNIT,
      position: RepeatingImagePosition.BOTTOM,
      getSpeed: () => mainCharacter.getWorldSpeed(),
      zOffset: -1,
    });
    sceneries.set(scenery, mesh);
  }
  return mesh;
}

export const LoadBackground = (scenery: Scenery) => {
  addSkyPlaneToScene();
  showScenery(scenery);
};

export function showScenery(scenery: Scenery) {
  const shown = getScenery(scenery);
  sceneries.forEach((mesh) => {
    mesh.visible = mesh === shown;
  });
}
