const width = 16;
const height = 9;
const aspectRatio = width / height;

const mainCharacterScale = 2;
const jumpHeight = 0.5;

export const SETTINGS = {
  MIN_INTERNAL_WIDTH: width,
  MIN_INTERNAL_HEIGHT: height,
  ASPECT_RATIO: aspectRatio,
  MAIN_CHARACTER_SCALE: mainCharacterScale,
  JUMP_HEIGHT: jumpHeight * mainCharacterScale,
};
