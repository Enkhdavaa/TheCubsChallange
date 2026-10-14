import * as THREE from "three";
import { textureLoader } from "../helper/textures.ts";
import { GROUND_Y } from "../positions.ts";
import { preloadTexture } from "../scene.ts";
import { SpriteObstacle } from "./spriteObstacle.ts";

// Pixel art SVGs at their real pixel size, cropped to the art.
// World sizes keep the look the original PNGs had
const ROAD_ICONS: Record<string, { width: number; height: number }> = {
  banana: { width: 0.74, height: 0.67 },
  // Squashed so the top-down puddle reads as lying flat on the road
  puddle: { width: 1.03, height: 0.35 },
  mud: { width: 1.03, height: 0.35 },
  rocks: { width: 0.7, height: 0.6 },
};

function loadIconTexture(name: string) {
  const texture = textureLoader.load(
    `sprites/obstacle/${name}.svg`,
    preloadTexture,
  );
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Loaded and uploaded up front so they are ready before the first one spawns
const textures = new Map(
  Object.keys(ROAD_ICONS).map((name) => [name, loadIconTexture(name)]),
);

// A picture hazard lying on the road
export class RoadObstracle extends SpriteObstacle {
  constructor(name: string, startX: number) {
    const { width, height } = ROAD_ICONS[name];

    super({
      name,
      kind: "hazard",
      texture: textures.get(name)!,
      width,
      height,
      startX,
      bottomY: GROUND_Y,
      hitboxScale: { x: 0.8, y: 0.85 },
    });
  }
}
