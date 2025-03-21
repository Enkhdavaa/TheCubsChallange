import { SpriteFlipBook } from "./spriteFlipBook.ts";

const path = "sprites/player/walk.png";

const frames = 8;
const columns = 1;
const walk = new SpriteFlipBook(path, frames, columns);
const totalDuration = 0.7;
walk.loop([0, 1, 2, 3, 4, 5, 6, 7], totalDuration);

export default walk;
