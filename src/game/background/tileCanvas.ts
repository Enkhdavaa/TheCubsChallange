// Scenery tiles drawn in code. One canvas pixel is one art pixel at the
// runner's scale, and the path starts where the city road does (70% down),
// so the runner and obstacles fit every scenery
export const PIXELS_PER_UNIT = 24;
export const TILE_WIDTH = 256;
export const TILE_HEIGHT = 144;
export const PATH_TOP = Math.round(TILE_HEIGHT * 0.7);

// How fast each layer of a scenery scrolls compared with the road: far
// things drift by slowly, which also makes them repeat less often
export const PARALLAX = { far: 0.2, near: 0.5, ground: 1 };

// One repeating image of a scenery, and how fast it scrolls
export interface SceneryLayer {
  canvas: HTMLCanvasElement;
  parallax: number;
}

export type Rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) => void;

export function createTileCanvas(width = TILE_WIDTH) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = TILE_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const rect: Rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    // Draw a second copy across the edge so the image tiles seamlessly
    ctx.fillRect(x, y, w, h);
    if (x < 0) ctx.fillRect(x + width, y, w, h);
    if (x + w > width) ctx.fillRect(x - width, y, w, h);
  };
  return { canvas, rect };
}

export function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function pick<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

// A filled circle, drawn one row at a time
export function disc(
  rect: Rect,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  for (let row = -radius; row <= radius; row++) {
    const half = Math.round(Math.sqrt(radius ** 2 - row ** 2));
    rect(x - half, y + row, half * 2 + 1, 1, color);
  }
}
