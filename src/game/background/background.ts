import { scene } from "../scene.ts";
import { orthographicCamera } from "../camera.ts";
import { createRepeatingImage } from "./createRepeatingImage.ts";
import { addSkyPlaneToScene } from "./sky.ts";
import { RepeatingImagePosition } from "./repeatingImagePosition.ts";

export const LoadBackground = () => {
  addSkyPlaneToScene();
  createRepeatingImage({
    imagePath: "sprites/background/park.png",
    camera: orthographicCamera,
    scene: scene,
    repeatX: 5,
    position: RepeatingImagePosition.BOTTOM,
  });
};
