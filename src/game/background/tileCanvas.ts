// Scenery tiles drawn in code. One canvas pixel is one art pixel at the
// runner's scale (24 per world unit), and the path starts where the city
// road does (70% down), so the runner and obstacles fit every scenery
export const TILE_WIDTH = 256;
export const TILE_HEIGHT = 144;
export const PATH_TOP = Math.round(TILE_HEIGHT * 0.7);

export type Rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) => void;

export function createTileCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = TILE_WIDTH;
  canvas.height = TILE_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const rect: Rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    // Draw a second copy across the edge so the image tiles seamlessly
    ctx.fillRect(x, y, w, h);
    if (x < 0) ctx.fillRect(x + TILE_WIDTH, y, w, h);
    if (x + w > TILE_WIDTH) ctx.fillRect(x - TILE_WIDTH, y, w, h);
  };
  return { canvas, rect };
}
