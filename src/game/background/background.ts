import * as THREE from "three";
import { scene } from "../scene.ts";
import { orthographicCamera } from "../camera.ts";
import { createRepeatingImage } from "./createRepeatingImage.ts";
import { addSkyPlaneToScene } from "./sky.ts";
import { RepeatingImagePosition } from "./repeatingImagePosition.ts";
import { createParkTexture } from "./parkTexture.ts";
import { createTrailTexture } from "./trailTexture.ts";
import { mainCharacter } from "../characters/main/mainCharacter.ts";
import { Scenery } from "../levels.ts";

function createCityTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pathY = canvas.height * 0.7; // Lowered to give the character a realistically sized path
  const pathHeight = canvas.height * 0.3;

  // Draw Dutch skyline (Background buildings)
  let x = 0;
  while (x < canvas.width) {
    const bWidth = 40 + Math.random() * 40; // 40 to 80
    const bHeight = 80 + Math.random() * 60; // 80 to 140
    const bY = pathY - bHeight;

    // Base building color (typical brick palettes)
    const colors = [
      "#4a3c31",
      "#6b4231",
      "#784a3d",
      "#5c4033",
      "#8b5a2b",
      "#3d3d3d",
    ];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(x, bY, bWidth, bHeight);

    // Stepped Gable roof (Iconic Dutch architecture)
    const steps = 3 + Math.floor(Math.random() * 2); // 3 or 4 steps
    const stepWidth = bWidth / (steps * 2);
    const stepHeight = 8;
    for (let i = 0; i < steps; i++) {
      const sx = x + stepWidth * i;
      const sy = bY - stepHeight * (i + 1);
      const sw = bWidth - stepWidth * 2 * i;
      ctx.fillRect(sx, sy, sw, stepHeight + 1); // +1 to overlap and avoid seams
    }

    // Windows
    ctx.fillStyle = "rgba(255, 255, 220, 0.9)"; // Warm light
    const floors = Math.floor(bHeight / 25);
    const winWidth = 8;
    const winHeight = 14;
    const marginX = (bWidth - winWidth * 2) / 3;
    for (let f = 0; f < floors; f++) {
      const wy = bY + 10 + f * 25;
      ctx.fillRect(x + marginX, wy, winWidth, winHeight);
      ctx.fillRect(x + marginX * 2 + winWidth, wy, winWidth, winHeight);
    }

    // Add a small door
    ctx.fillStyle = "#222";
    ctx.fillRect(x + bWidth / 2 - 6, pathY - 16, 12, 16);

    x += bWidth;
  }

  // Draw Solid Path
  ctx.fillStyle = "#555555"; // Solid gray asphalt/pavement
  ctx.fillRect(0, pathY, canvas.width, pathHeight);

  // Running track / bike path dashed line
  ctx.fillStyle = "#dddddd";
  for (let i = 0; i < canvas.width; i += 60) {
    ctx.fillRect(i, pathY + pathHeight / 2 - 2, 30, 4);
  }

  // Grass transition at the bottom
  ctx.fillStyle = "#3a4f29";
  ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

  // Grass transition at the top of the path
  ctx.fillStyle = "#4a6336";
  ctx.fillRect(0, pathY, canvas.width, 4);

  return canvas;
}

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
    const texture = new THREE.CanvasTexture(drawScenery[scenery]());
    // Canvas colors are sRGB; without this they render washed out
    texture.colorSpace = THREE.SRGBColorSpace;
    mesh = createRepeatingImage({
      texture,
      camera: orthographicCamera,
      scene: scene,
      // Same look as before: 1.5 copies across a 16:9 view (16 units wide)
      tileWidth: 16 / 1.5,
      height: 6,
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
