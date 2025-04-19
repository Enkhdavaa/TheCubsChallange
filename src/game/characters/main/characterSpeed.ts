import { spriteSelector } from "./mainCharacter.ts";
import { setSpeedBar } from "./speedbar.ts";
import run from "./sprites/run.ts";
import walk from "./sprites/walk.ts";

const maxSpeed = 20;
const minSpeed = 0;
const walkMaxSpeed = 5;
let currentSpeed = 1;

setSpeed(currentSpeed);
setSpeedBar(translateSpeedToPercentage(currentSpeed));

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

function setSpeed(speed: number) {
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
}

function translateSpeedToPercentage(speed: number) {
  const percentage = (speed / maxSpeed) * 100;
  return percentage;
}

function setWalkSpeedDuration() {
  // max walk duration is 1.3 and max is 0.3 seconds
  const translatedSpeedDuration = -0.25 * currentSpeed + 1.55;

  walk.setDuration(translatedSpeedDuration);
  spriteSelector.selectAnimation("walk");
  console.log(translatedSpeedDuration);
}

function setRunSpeedDuration() {
  // max run duration is 1 and min is 0.3 seconds
  const translatedSpeedDuration = -0.05 * currentSpeed + 1.3;
  run.setDuration(translatedSpeedDuration);
  spriteSelector.selectAnimation("run");

  console.log(translatedSpeedDuration);
}
