import { SpriteFlipBook } from "../../animation/spriteFlipBook.ts";
import { SpriteSelector } from "../../animation/spriteSelector.ts";
import { addFrameCallback } from "../../helper/frameCallback.ts";

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
export const spriteSelector = new SpriteSelector(animationMap, "walk");
spriteSelector.selectAnimation("walk");

addFrameCallback(() => {
  spriteSelector.getPosition();
});

export const getBoudingBox = () => {
  return spriteSelector.getPlayerBox();
};
