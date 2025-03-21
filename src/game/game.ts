import { SpriteFlipBook } from "./animation/spriteFlipBook.ts";
import { SpriteSelector } from "./animation/spriteSelector.ts";

import idle from "./animation/sprites/idle.ts";
import jump from "./animation/sprites/jump.ts";
import run from "./animation/sprites/run.ts";
import walk from "./animation/sprites/walk.ts";

// Create animation map
const animationMap = new Map<string, SpriteFlipBook>();
animationMap.set("idle", idle);
animationMap.set("jump", jump);
animationMap.set("run", run);
animationMap.set("walk", walk);

// Animation selector
const spriteAnimationSelector = new SpriteSelector(animationMap, "idle");
spriteAnimationSelector.selectAnimation("idle");

document.addEventListener("keydown", (event) => {
  spriteAnimationSelector.selectAnimation("jump", false);
});

document.addEventListener("touchstart", (event) => {
  spriteAnimationSelector.selectAnimation("jump", false);
});
