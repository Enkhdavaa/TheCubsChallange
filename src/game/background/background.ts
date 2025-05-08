import { scene } from "../scene.ts";
import { orthographicCamera } from "../camera.ts";
import { createRepeatingImage } from "./createRepeatingImage.ts";
import { addSkyPlaneToScene } from "./sky.ts";

export const LoadBackground = () => {
  addSkyPlaneToScene();
  createRepeatingImage({
    imagePath: "sprites/background/eindhoven.png",
    camera: orthographicCamera,
    scene: scene,
  });
};
