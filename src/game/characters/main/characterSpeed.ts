import { addFrameCallback } from "../../helper/frameCallback.ts";
import { spriteSelector } from "./mainCharacter.ts";
import { setSpeedBar } from "./speedbar.ts";
import run from "./sprites/run.ts";
import walk from "./sprites/walk.ts";

const maxSpeed = 20;
const minSpeed = 0;
const walkMaxSpeed = 5;
let currentSpeed = 1;

const runMinDuration = 0.3;
const runMaxDuration = 1;

const walkMinDuration = 0.3;
const walkMaxDuration = 1.3;

export const increaseSpeed = () => {
  if (currentSpeed < maxSpeed) {
    currentSpeed = currentSpeed + 1;
    setSpeed(currentSpeed);
    setSpeedBar(translateSpeedToPercentage(currentSpeed));
  }
};
export const decreaseSpeed = () => {
  if (currentSpeed > 0) {
    currentSpeed = currentSpeed - 1;
    setSpeed(currentSpeed);
    setSpeedBar(translateSpeedToPercentage(currentSpeed));
  }
};

const setSpeed = (speed: number) => {
  console.log("speed", speed);

  if (speed > maxSpeed) {
    currentSpeed = maxSpeed;
  }
  if (speed < minSpeed) {
    currentSpeed = minSpeed;
  }
  if (currentSpeed == 0) {
    spriteSelector.selectAnimation("idle");
  } else if (currentSpeed > walkMaxSpeed) {
    setRunSpeedDuration();
  } else if (currentSpeed <= walkMaxSpeed) {
    setWalkSpeedDuration();
  }
};

function translateSpeedToPercentage(speed: number) {
  const percentage = (speed / maxSpeed) * 100;
  return percentage;
}

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
