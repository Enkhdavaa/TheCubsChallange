import * as THREE from "three";
import { scene } from "../scene.ts";
import { getCameraBounds } from "../camera.ts";
import { getMetersPerUnit } from "../course.ts";
import { LandmarkName, Level } from "../levels.ts";
import { getCharacterPosition } from "../positions.ts";
import { runState } from "../runState.ts";
import { SETTINGS } from "../settings.ts";
import { GROUND_Z } from "../background/background.ts";
import { createLandmarkCanvas } from "../background/cityTexture.ts";
import {
  PARALLAX,
  PIXELS_PER_UNIT,
  TILE_HEIGHT,
} from "../background/tileCanvas.ts";

// Just in front of the buildings, behind the pavement
const z = GROUND_Z - 0.05;
// As tall as the scenery and level with it, so the rows line up
const centerY = -SETTINGS.VIEW_HEIGHT / 2 + TILE_HEIGHT / PIXELS_PER_UNIT / 2;

const textures = new Map<LandmarkName, THREE.CanvasTexture>();

function getTexture(name: LandmarkName) {
  let texture = textures.get(name);
  if (!texture) {
    texture = new THREE.CanvasTexture(createLandmarkCanvas(name));
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.set(name, texture);
  }
  return texture;
}

interface PlacedLandmark {
  units: number;
  message: string;
  sprite: THREE.Sprite;
  isMentioned: boolean;
}

// Landmarks stand once each along a run's route, among the buildings and
// moving at their pace; the runner mentions each one as it reaches the
// middle of the view, so it's in sight while the message is up
export class Landmarks {
  private landmarks: PlacedLandmark[] = [];

  constructor(private onMention: (message: string) => void) {}

  // For the level being picked or run; mentions start over
  public reset(level: Level) {
    this.landmarks.forEach(({ sprite }) => {
      scene.remove(sprite);
      sprite.material.dispose();
    });
    const metersPerUnit = getMetersPerUnit(level);
    this.landmarks = (level.landmarks ?? []).map(({ km, name, message }) => {
      const texture = getTexture(name);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: texture }),
      );
      const { width, height } = texture.image as HTMLCanvasElement;
      sprite.scale.set(width / PIXELS_PER_UNIT, height / PIXELS_PER_UNIT, 1);
      sprite.visible = false;
      scene.add(sprite);
      return {
        units: (km * 1000) / metersPerUnit,
        message,
        sprite,
        isMentioned: false,
      };
    });
  }

  public update() {
    // The start screen shows the start of the route
    const isRunning = runState.phase === "running";
    const distance = runState.phase === "ready"
      ? 0
      : runState.getDistanceUnits();
    const runnerX = getCharacterPosition().x;
    const { left, right } = getCameraBounds();
    const middle = (left + right) / 2;

    this.landmarks.forEach((landmark) => {
      const { sprite } = landmark;
      const x = runnerX + (landmark.units - distance) * PARALLAX.near;
      const halfWidth = sprite.scale.x / 2;
      sprite.visible = x + halfWidth > left && x - halfWidth < right;
      sprite.position.set(x, centerY, z);

      if (isRunning && !landmark.isMentioned && x <= middle) {
        landmark.isMentioned = true;
        this.onMention(landmark.message);
      }
    });
  }
}
