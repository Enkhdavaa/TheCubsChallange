import * as THREE from "three";
import { getCameraBounds } from "./camera.ts";
import { SETTINGS } from "./settings.ts";

const { PLAYER_FEET_OFFSET, PLAYER_HITBOX } = SETTINGS;

// World units; the view is always 9 units tall, centered on 0
const introTextY = 3.6;
const runnerY = -3.15;
// Distance from the left edge, so there is room to see what is coming
const runnerOffsetX = 1.6;
// Gap between the runner's head (hitbox top) and the pickup lane
const pickupLaneGap = 0.45;

// The line the runner's feet touch
export const GROUND_Y = runnerY - PLAYER_FEET_OFFSET;

// Pickups float just out of reach, so only a jump collects them
export const PICKUP_LANE_BOTTOM_Y = runnerY + PLAYER_HITBOX.top + pickupLaneGap;

export const getIntroTextPosition = () => {
  return new THREE.Vector3(0, introTextY, 0);
};

export const getCharacterPosition = () => {
  const { left } = getCameraBounds();
  return new THREE.Vector3(left + runnerOffsetX, runnerY, 0);
};
