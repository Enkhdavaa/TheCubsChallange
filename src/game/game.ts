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
  if (event.key === "ArrowUp") {
    spriteAnimationSelector.selectAnimation("jump", false);
  } else if (event.key === "ArrowRight") {
    spriteAnimationSelector.selectAnimation("run");
  } else if (event.key === "ArrowLeft") {
    spriteAnimationSelector.selectAnimation("walk");
  }
});

document.addEventListener("touchstart", (event) => {
  if (event.touches[0].clientX > globalThis.innerWidth / 2) {
    spriteAnimationSelector.selectAnimation("run");
  } else if (event.touches[0].clientX < globalThis.innerWidth / 2) {
    spriteAnimationSelector.selectAnimation("walk");
  }
  if (event.touches[0].clientY < globalThis.innerHeight / 2) {
    spriteAnimationSelector.selectAnimation("jump", false);
  }
});
