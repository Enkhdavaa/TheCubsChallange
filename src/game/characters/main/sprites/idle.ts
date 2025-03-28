import { generateAscendingArray } from "../../../helper/helper.ts";
import { SpriteFlipBook } from "../../../animation/spriteFlipBook.ts";

const path = "sprites/player/idle.png";

const frames = 10;
const columns = 1;
const idle = new SpriteFlipBook(path, frames, columns);
const totalDuration = 0.7;

const tileIndexArray = generateAscendingArray(frames);
idle.setArrayAndDuration(tileIndexArray, totalDuration);

export default idle;
