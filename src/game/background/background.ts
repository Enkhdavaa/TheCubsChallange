import * as THREE from "three";
import { scene } from "../scene.ts";
import { orthographicCamera } from "../camera.ts";
import { createRepeatingImage } from "./createRepeatingImage.ts";
import { addSkyPlaneToScene } from "./sky.ts";
import { RepeatingImagePosition } from "./repeatingImagePosition.ts";
import { createCityLayers } from "./cityTexture.ts";
import { createParkLayers } from "./parkTexture.ts";
import { createTrailLayers } from "./trailTexture.ts";
import { PIXELS_PER_UNIT, SceneryLayer } from "./tileCanvas.ts";
import { mainCharacter } from "../characters/main/mainCharacter.ts";
import { Scenery } from "../levels.ts";

// Background layers sit behind everything else, the ground nearest
export const GROUND_Z = -1;
const layerGapZ = 0.1;

const drawScenery: Record<Scenery, () => SceneryLayer[]> = {
  city: createCityLayers,
  park: createParkLayers,
  trail: createTrailLayers,
};
const sceneries = new Map<Scenery, THREE.Mesh[]>();

// Each scenery's layers, far to near, moving with the ground at their own
// pace; a scenery is drawn the first time it's shown
function getScenery(scenery: Scenery) {
  let meshes = sceneries.get(scenery);
  if (!meshes) {
    const layers = drawScenery[scenery]();
    meshes = layers.map(({ canvas, parallax }, i) => {
      const texture = new THREE.CanvasTexture(canvas);
      // Canvas colors are sRGB; without this they render washed out
      texture.colorSpace = THREE.SRGBColorSpace;
      return createRepeatingImage({
        texture,
        camera: orthographicCamera,
        scene: scene,
        // Every layer is drawn at the same scale, so a wider image
        // repeats less often
        tileWidth: canvas.width / PIXELS_PER_UNIT,
        height: canvas.height / PIXELS_PER_UNIT,
        position: RepeatingImagePosition.BOTTOM,
        parallax,
        getSpeed: () => mainCharacter.getWorldSpeed(),
        zOffset: GROUND_Z - (layers.length - 1 - i) * layerGapZ,
      });
    });
    sceneries.set(scenery, meshes);
  }
  return meshes;
}

export const LoadBackground = (scenery: Scenery) => {
  addSkyPlaneToScene();
  showScenery(scenery);
};

export function showScenery(scenery: Scenery) {
  getScenery(scenery);
  sceneries.forEach((meshes, name) => {
    meshes.forEach((mesh) => {
      mesh.visible = name === scenery;
    });
  });
}
