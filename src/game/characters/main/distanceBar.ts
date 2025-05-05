import * as THREE from "three";
import { addFrameCallback } from "../../helper/frameCallback.ts";
import { Bar } from "../bar/bar.ts";
import { mainCharacter } from "./mainCharacter.ts";

const bar = new Bar("42.195 km", 0xffffff);
bar.setOffset(0, 0.78, 0);

class DistanceBar {
  constructor() {
    bar.setPosition(mainCharacter.getPosition());
    bar.setBar(0);
  }

  public setPosition(position: THREE.Vector3) {
    bar.setPosition(position);
  }

  updateDistanceBar() {
    const percentage = translateSpeedToPercentage();
    bar.setBar(percentage);
  }
}

function translateSpeedToPercentage() {
  const maxSpeed = mainCharacter.getMaxSpeed();
  const currentSpeed = mainCharacter.getCurrentSpeed();
  const percentage = (currentSpeed / maxSpeed) * 100;
  return percentage;
}

const distanceBar = new DistanceBar();

export const spawnDistanceBar = () => {
  addFrameCallback(() => {
    distanceBar.updateDistanceBar();
    const characterPosition = mainCharacter.getPosition();
    bar.setPosition(characterPosition);
  });
};
