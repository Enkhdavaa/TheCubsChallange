import { SpriteFlipBook } from "./spriteFlipBook.ts";

const path = "sprites/player/run.png";

const frames = 8;
const columns = 1;
const run = new SpriteFlipBook(path, frames, columns);
const totalDuration = 0.7;
run.loop([0, 1, 2, 3, 4, 5, 6, 7], totalDuration);

export default run;
