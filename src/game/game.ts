import { SpriteAnimationSelector } from "./spriteAnimationSelector.ts";
import idle from "./spriteFlipBooks/idle.ts";
import run from "./spriteFlipBooks/run.ts";
import walk from "./spriteFlipBooks/walk.ts";

// Animation selector
const spriteAnimationSelector = new SpriteAnimationSelector([idle, walk, run]);
