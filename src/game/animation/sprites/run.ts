import { generateAscendingArray } from "../../helper/helper.ts";
import { SpriteFlipBook } from "../spriteFlipBook.ts";

const path = "sprites/player/run.png";

const frames = 8;
const columns = 1;
const run = new SpriteFlipBook(path, frames, columns);
const totalDuration = 0.7;

const tileIndexArray = generateAscendingArray(frames);
run.setArrayAndDuration(tileIndexArray, totalDuration);

export default run;
