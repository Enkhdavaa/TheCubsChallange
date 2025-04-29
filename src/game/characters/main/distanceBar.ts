import { addFrameCallback } from "../../helper/frameCallback.ts";
import { Bar } from "../bar/bar.ts";
import { spriteSelector } from "./mainCharacter.ts";

const bar = new Bar("42.195 km", 0xffffff);

export function setSpeedBar(percentage: number) {
  if (percentage < 0) {
    percentage = 0;
  }
  if (percentage > 100) {
    percentage = 100;
  }
  bar.setBar(percentage);
}

addFrameCallback(() => {
  const characterPosition = spriteSelector.getPosition();
  bar.setPosition(characterPosition);
});
