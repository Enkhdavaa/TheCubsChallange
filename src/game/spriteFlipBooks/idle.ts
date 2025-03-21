import { SpriteFlipBook } from "./spriteFlipBook.ts";

const path = "sprites/player/idle.png";

const frames = 10;
const columns = 1;
const idle = new SpriteFlipBook(path, frames, columns);
const totalDuration = 0.7;
idle.loop([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], totalDuration);

export default idle;
