import {
  createTileCanvas,
  PARALLAX,
  PATH_TOP,
  SceneryLayer,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "./tileCanvas.ts";

// A repeating trail scene: far hills, nearer hills with trees, and a dirt
// path
const height = TILE_HEIGHT;
const pathTop = PATH_TOP;
// Where the trees stand, behind the grass along the path
const verge = pathTop - 4;

// Whole waves across a layer keep it seamless
function wave(x: number, width: number, waves: number, phase = 0) {
  return Math.sin((x / width) * Math.PI * 2 * waves + phase);
}

function drawFar() {
  const width = TILE_WIDTH;
  const { canvas, rect } = createTileCanvas(width);
  for (let x = 0; x < width; x++) {
    const top = Math.round(
      78 + 10 * wave(x, width, 2) + 5 * wave(x, width, 5, 1),
    );
    rect(x, top, 1, pathTop - top, "#8cbf6e");
  }
  return canvas;
}

// Twice as wide as the others, so the same tree comes round less often
function drawNear() {
  const width = TILE_WIDTH * 2;
  const { canvas, rect } = createTileCanvas(width);
  for (let x = 0; x < width; x++) {
    const top = Math.round(
      90 + 5 * wave(x, width, 6, 2) + 3 * wave(x, width, 14),
    );
    rect(x, top, 1, pathTop - top, "#6aa356");
  }

  // Trees standing on the verge
  const trees = 18;
  for (let i = 0; i < trees; i++) {
    const x = Math.floor((i / trees) * width + Math.random() * 20);
    if (i % 3 === 1) {
      // Leafy tree: a round crown on a trunk
      const size = 10 + Math.floor(Math.random() * 5);
      rect(x - 1, verge - 6, 3, 6, "#5b3a1e");
      for (let row = 0; row < size; row++) {
        const half = Math.round(
          Math.sqrt((size / 2) ** 2 - (row - size / 2) ** 2),
        );
        rect(x - half, verge - 6 - size + row, half * 2 + 1, 1, "#4c9a3f");
      }
      rect(x - 2, verge - 4 - size, 2, 2, "#6cbf55");
    } else {
      // Pine: a stepped triangle
      const tall = 22 + Math.floor(Math.random() * 14);
      rect(x - 1, verge - 4, 3, 4, "#5b3a1e");
      for (let row = 0; row < tall; row++) {
        const half = Math.floor((row / tall) * 7) + (row % 4 === 3 ? 1 : 0);
        rect(x - half, verge - 4 - tall + row, half * 2 + 1, 1, "#2f6b3a");
        rect(x - half, verge - 4 - tall + row, 1, 1, "#3f8a49");
      }
    }
  }
  return canvas;
}

function drawGround() {
  const width = TILE_WIDTH;
  const { canvas, rect } = createTileCanvas(width);

  // Grass verge with tufts, then the dirt path
  rect(0, verge, width, pathTop - verge, "#4f8a3a");
  for (let x = 0; x < width; x += 3 + Math.floor(Math.random() * 4)) {
    rect(x, verge - 1, 1, 1, "#4f8a3a");
  }
  rect(0, pathTop, width, height - pathTop, "#8a6240");

  // Darker patches and pebbles on the path
  for (let i = 0; i < 120; i++) {
    const x = Math.floor(Math.random() * width);
    const y = pathTop + 2 + Math.floor(Math.random() * (height - pathTop - 8));
    const isPebble = i % 3 === 0;
    rect(x, y, isPebble ? 2 : 3, 1, isPebble ? "#b49167" : "#73502f");
  }

  // Grass overhanging the path edge, and along the bottom
  for (let x = 0; x < width; x += 2 + Math.floor(Math.random() * 3)) {
    rect(x, pathTop, 1, 1 + Math.floor(Math.random() * 2), "#4f8a3a");
  }
  rect(0, height - 5, width, 5, "#3f6b2e");

  return canvas;
}

export function createTrailLayers(): SceneryLayer[] {
  return [
    { canvas: drawFar(), parallax: PARALLAX.far },
    { canvas: drawNear(), parallax: PARALLAX.near },
    { canvas: drawGround(), parallax: PARALLAX.ground },
  ];
}
