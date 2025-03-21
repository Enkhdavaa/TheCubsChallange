import { SpriteSelector } from "./animation/spriteSelector.ts";
import idle from "./animation/sprites/idle.ts";
import jump from "./animation/sprites/jump.ts";
import run from "./animation/sprites/run.ts";
import walk from "./animation/sprites/walk.ts";

// Animation selector
const spriteAnimationSelector = new SpriteSelector([idle, walk, run, jump]);
spriteAnimationSelector.selectSpriteIndex(3);
