import { SpriteFlipBook } from "../../animation/spriteFlipBook.ts";
import { SpriteSelector } from "../../animation/spriteSelector.ts";
import { addFrameCallback } from "../../helper/frameCallback.ts";
import { normalizedToCanvas } from "../../helper/helper.ts";
import { Bar } from "../bar/bar.ts";

import idle from "./sprites/idle.ts";
import jump from "./sprites/jump.ts";
import run from "./sprites/run.ts";
import walk from "./sprites/walk.ts";

// Create animation map
const animationMap = new Map<string, SpriteFlipBook>();
animationMap.set("idle", idle);
animationMap.set("jump", jump);
animationMap.set("run", run);
animationMap.set("walk", walk);

// Animation selector
const spriteSelector = new SpriteSelector(animationMap, "walk");
const position = normalizedToCanvas(-0.7, 0);
spriteSelector.setPosition(position);
spriteSelector.selectAnimation("walk");

addFrameCallback(() => {
  const characterPosition = spriteSelector.getPosition();
  bar.setPosition(characterPosition);
});

const maxSpeed = 20;
const minSpeed = 1;
const walkMaxSpeed = 5;
let currentSpeed = 1;

const bar = new Bar("SPEED", 0xffffff);

export const increaseSpeed = () => {
  if (currentSpeed < maxSpeed) {
    currentSpeed = currentSpeed + 1;
    setSpeed(currentSpeed);
    setBar();
  }
};
export const decreaseSpeed = () => {
  if (currentSpeed > 0) {
    currentSpeed = currentSpeed - 1;
    setSpeed(currentSpeed);
    setBar();
  }
};
const barMax = 100;

function setBar() {
  bar.setBar((barMax / maxSpeed) * currentSpeed);
}
const runMinDuration = 0.3;
const runMaxDuration = 1;

const walkMinDuration = 0.3;
const walkMaxDuration = 1.3;

const setSpeed = (speed: number) => {
  if (speed <= 0) {
    spriteSelector.selectAnimation("idle");
    return;
  }
  if (speed > maxSpeed) {
    currentSpeed = maxSpeed;
  }
  if (speed < minSpeed) {
    currentSpeed = minSpeed;
  }
  if (currentSpeed > walkMaxSpeed) {
    setRunSpeedDuration();
  } else if (currentSpeed <= walkMaxSpeed) {
    setWalkSpeedDuration();
  }
};

export const getBoudingBox = () => {
  return spriteSelector.getPlayerBox();
};

export const MainCharacterStart = () => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      spriteSelector.selectAnimation("jump", false);
    }
  });

  document.addEventListener("touchstart", (event) => {
    if (event.touches[0].clientY < globalThis.innerHeight / 2) {
      spriteSelector.selectAnimation("jump", false);
    }
  });
};

function setWalkSpeedDuration() {
  const translatedSpeedDuration = -0.25 * currentSpeed + 1.55;

  walk.setDuration(translatedSpeedDuration);
  spriteSelector.selectAnimation("walk");
  console.log(translatedSpeedDuration);
}

function setRunSpeedDuration() {
  const translatedSpeedDuration = -0.05 * currentSpeed + 1.3;
  run.setDuration(translatedSpeedDuration);
  spriteSelector.selectAnimation("run");

  console.log(translatedSpeedDuration);
}
