import { generateAscendingArray } from "../../../helper/helper.ts";
import { SpriteFlipBook } from "../../../animation/spriteFlipBook.ts";

const path = "sprites/player/jump.png";

const frames = 6;
const columns = 1;
const jump = new SpriteFlipBook(path, frames, columns);
const totalDuration = 0.7;

const tileIndexArray = generateAscendingArray(frames);
jump.setArrayAndDuration(tileIndexArray, totalDuration);

export default jump;
