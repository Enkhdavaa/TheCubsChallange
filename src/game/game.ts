import { SpriteAnimationSelector } from "./spriteAnimationSelector.ts";
import { SpriteFlipBook } from "./spriteFlipBook.ts";

// Add the sprite flip book
const idle = new SpriteFlipBook("/sprites/player/idle.png", 10, 1);
idle.loop([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.7);

const run = new SpriteFlipBook("/sprites/player/run.png", 8, 1);
run.loop([0, 1, 2, 3, 4, 5, 6, 7], 0.7);

const walk = new SpriteFlipBook("/sprites/player/walk.png", 8, 1);
walk.loop([0, 1, 2, 3, 4, 5, 6, 7], 0.7);

// Animation selector
const spriteAnimationSelector = new SpriteAnimationSelector([idle, walk, run]);

// Set the default animation
const tick = () => {
  spriteAnimationSelector.update();
  globalThis.requestAnimationFrame(tick);
};

tick();
