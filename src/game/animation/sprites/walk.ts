import { generateAscendingArray } from "../../helper/helper.ts";
import { SpriteFlipBook } from "../spriteFlipBook.ts";

const path = "sprites/player/walk.png";

const frames = 8;
const columns = 1;
const walk = new SpriteFlipBook(path, frames, columns);
const totalDuration = 0.7;

const tileIndexArray = generateAscendingArray(frames);
walk.loop(tileIndexArray, totalDuration);

export default walk;
