// The world is always 9 units tall; its width follows the screen
// between these aspect ratios (narrower or wider screens get black bars)
const viewHeight = 9;
const minAspect = 4 / 3;
const maxAspect = 2.4;

const mainCharacterScale = 2;
const jumpHeight = 0.7;

// Player sprite frames are 48px square; the body spans px 10 (head) to 40 (feet)
const playerPixel = mainCharacterScale / 48;

export const SETTINGS = {
  VIEW_HEIGHT: viewHeight,
  MIN_ASPECT: minAspect,
  MAX_ASPECT: maxAspect,
  MAIN_CHARACTER_SCALE: mainCharacterScale,
  JUMP_HEIGHT: jumpHeight * mainCharacterScale,
  PLAYER_PIXEL: playerPixel,
  // Distance from the sprite center down to the feet
  PLAYER_FEET_OFFSET: 16 * playerPixel,
  // Collision box, slightly smaller than the visible body to feel fair
  PLAYER_HITBOX: {
    width: 12 * playerPixel,
    bottom: -14 * playerPixel,
    top: 12 * playerPixel,
  },
  // Seconds an obstacle is announced at the right edge before it appears
  WARNING_LEAD_TIME: 0.8,
  RUN_GOAL_KM: 5,
  METERS_PER_UNIT: 10,
  DEBUG: new URLSearchParams(globalThis.location?.search).has("debug"),
};
