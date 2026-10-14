import * as THREE from "three";
import { scene } from "../scene.ts";
import { getCameraBounds } from "../camera.ts";
import { course } from "../course.ts";
import { createPixelArtTexture } from "../helper/pixelArt.ts";
import { PIXEL_FONT } from "../helper/pixelFont.ts";
import { getCharacterPosition, ROAD_BACK_Y } from "../positions.ts";
import { runState } from "../runState.ts";

// World units per art pixel for the lights, crossings and signs
const artPixel = 0.06;

// Places a sprite at a spot along the course: it scrolls with the road
// and hides while off screen
export function placeOnCourse(
  sprite: THREE.Sprite,
  units: number,
  bottomY: number,
  z: number,
) {
  const x = getCharacterPosition().x + (units - runState.getDistanceUnits());
  const { left, right } = getCameraBounds();
  const halfWidth = sprite.scale.x / 2;
  sprite.visible = runState.phase !== "ready" &&
    x + halfWidth > left && x - halfWidth < right;
  sprite.position.set(x, bottomY + sprite.scale.y / 2, z);
}

function createSprite(texture: THREE.Texture) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
  const { width, height } = texture.image as HTMLCanvasElement;
  sprite.scale.set(width * artPixel, height * artPixel, 1);
  sprite.visible = false;
  scene.add(sprite);
  return sprite;
}

function removeSprite(sprite: THREE.Sprite) {
  scene.remove(sprite);
  sprite.material.dispose();
}

// --- Traffic lights -------------------------------------------------------

const LIGHT_HEAD = [
  ".kkkkk.",
  "kkRRRkk",
  "kRRRRRk",
  "kRRRRRk",
  "kkRRRkk",
  "kkkkkkk",
  "kkGGGkk",
  "kGGGGGk",
  "kGGGGGk",
  "kkGGGkk",
  ".kkkkk.",
];
const LIGHT_ART = [...LIGHT_HEAD, ...Array(30).fill("..pP...")];
const lightPalette = { k: "#212529", p: "#adb5bd", P: "#6c757d" };
const redLight = createPixelArtTexture(LIGHT_ART, {
  ...lightPalette,
  R: "#ff4d4d",
  G: "#1b4d26",
});
const greenLight = createPixelArtTexture(LIGHT_ART, {
  ...lightPalette,
  R: "#5c1a1a",
  G: "#51cf66",
});

// White bars across the road
const CROSSING_ART = Array.from(
  { length: 28 },
  (_, row) => (row % 5 < 3 ? "w" : ".").repeat(16),
);
const crossing = createPixelArtTexture(CROSSING_ART, {
  w: "rgba(255, 255, 255, 0.85)",
});

// Seconds of play; a full cycle is red then green
const redSeconds = 2.5;
const greenSeconds = 3.5;
const cycleSeconds = redSeconds + greenSeconds;
// The runner waits this far before the crossing
const stopGap = 0.9;

interface TrafficLight {
  units: number;
  // Where in its cycle this light starts, so lights aren't in sync
  offset: number;
  pole: THREE.Sprite;
  crossing: THREE.Sprite;
}

// Crossings on city runs: a red light stops the runner until it turns green
export class TrafficLights {
  private lights: TrafficLight[] = [];

  public reset() {
    this.lights.forEach((light) => {
      removeSprite(light.pole);
      removeSprite(light.crossing);
    });
    this.lights = course.lightUnits.map((units) => ({
      units,
      offset: Math.random() * cycleSeconds,
      pole: createSprite(redLight),
      crossing: createSprite(crossing),
    }));
  }

  // The furthest the runner may go: just before the next light while red
  public getStopUnits() {
    const distance = runState.getDistanceUnits();
    for (const light of this.lights) {
      const stopUnits = light.units - stopGap;
      if (distance <= stopUnits + 0.001) {
        return this.isRed(light) ? stopUnits : Infinity;
      }
    }
    return Infinity;
  }

  public update() {
    this.lights.forEach((light) => {
      light.pole.material.map = this.isRed(light) ? redLight : greenLight;
      // The pole stands on the far side of the road; the crossing lies on it
      placeOnCourse(light.pole, light.units + 0.6, ROAD_BACK_Y, -0.5);
      placeOnCourse(light.crossing, light.units, -4.45, -0.9);
    });
  }

  private isRed(light: TrafficLight) {
    return (runState.getElapsed() + light.offset) % cycleSeconds < redSeconds;
  }
}

// --- Hill signs -----------------------------------------------------------

const signTextures = new Map<number, THREE.CanvasTexture>();

// A wooden sign with an up or down arrow and the grade, e.g. "9%"
function getSignTexture(percent: number) {
  const cached = signTextures.get(percent);
  if (cached) {
    return cached;
  }

  // Drawn at 4 canvas pixels per art pixel so the text stays sharp
  const scale = 4;
  const width = 26;
  const height = 22;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d")!;
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
  };

  // Post, then the board with a dark rim
  rect(12, 11, 2, 11, "#6b4423");
  rect(0, 0, 26, 12, "#3d2614");
  rect(1, 1, 24, 10, "#a0703c");
  rect(1, 1, 24, 1, "#c08a52");

  // Arrow: pointing up for a climb, down for a descent
  const isUp = percent > 0;
  for (let row = 0; row < 4; row++) {
    const y = isUp ? 4 + row : 7 - row;
    rect(5 - row, y, 1 + row * 2, 1, "#ffffff");
  }

  ctx.font = `${7 * scale}px ${PIXEL_FONT}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#3d2614";
  ctx.fillText(`${Math.abs(percent)}%`, 12 * scale + 4, 6.5 * scale + 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`${Math.abs(percent)}%`, 12 * scale, 6.5 * scale);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  signTextures.set(percent, texture);
  return texture;
}

// Signs at the start of each climb and descent on trail runs
export class HillSigns {
  private signs: { units: number; sprite: THREE.Sprite }[] = [];

  public reset() {
    this.signs.forEach(({ sprite }) => removeSprite(sprite));
    this.signs = course.stretches
      .filter(({ grade }) => Math.abs(grade) >= 0.03)
      .map(({ startUnits, grade }) => {
        const sprite = createSprite(getSignTexture(Math.round(grade * 100)));
        // The texture is drawn at 4x, so scale back to art pixels
        sprite.scale.multiplyScalar(1 / 4);
        return { units: startUnits, sprite };
      });
  }

  public update() {
    this.signs.forEach(({ units, sprite }) => {
      placeOnCourse(sprite, units, ROAD_BACK_Y, -0.5);
    });
  }
}
