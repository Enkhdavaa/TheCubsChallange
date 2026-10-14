import {
  createTileCanvas,
  PATH_TOP,
  Rect,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "./tileCanvas.ts";

// A repeating city park: a mown lawn with trees, a pond, lamps and
// benches behind a gravel path
const width = TILE_WIDTH;
const height = TILE_HEIGHT;
const pathTop = PATH_TOP;
// Where the far trees meet the lawn, and the front of the lawn where
// trees, lamps and benches stand
const horizon = 80;
const verge = pathTop - 3;

const iron = "#2e3b3a";

function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// A filled circle, drawn one row at a time
function disc(rect: Rect, x: number, y: number, radius: number, color: string) {
  for (let row = -radius; row <= radius; row++) {
    const half = Math.round(Math.sqrt(radius ** 2 - row ** 2));
    rect(x - half, y + row, half * 2 + 1, 1, color);
  }
}

// A round crown on a trunk: shade on the lower right, light on the upper left
function tree(rect: Rect, x: number, radius: number, isBlossom: boolean) {
  const [shade, leaf, light] = isBlossom
    ? ["#c9708f", "#e595b0", "#f6c3d3"]
    : ["#2f7a34", "#3f9440", "#5cb04c"];
  const trunk = 9;
  const y = verge - trunk - radius + 2;
  rect(x - 1, verge - trunk, 3, trunk, "#6b4423");
  disc(rect, x, y, radius, shade);
  disc(rect, x - 1, y - 1, radius - 2, leaf);
  const third = Math.round(radius / 3);
  disc(rect, x - third, y - third, third, light);
}

function lamp(rect: Rect, x: number) {
  const post = 20;
  rect(x, verge - post, 2, post, iron);
  rect(x - 1, verge - 2, 4, 2, iron);
  // Housing with a warm glass, under a little cap
  rect(x - 2, verge - post - 5, 6, 5, iron);
  rect(x - 1, verge - post - 4, 4, 3, "#ffe9a3");
  rect(x - 1, verge - post - 6, 4, 1, iron);
}

// Facing the path: two backrest planks, the seat and an iron frame
function bench(rect: Rect, x: number) {
  rect(x, verge - 10, 13, 2, "#a8683a");
  rect(x, verge - 7, 13, 1, "#a8683a");
  rect(x, verge - 4, 13, 2, "#c27d48");
  rect(x + 1, verge - 10, 1, 10, iron);
  rect(x + 11, verge - 10, 1, 10, iron);
}

export function createParkTexture(): HTMLCanvasElement {
  const { canvas, rect } = createTileCanvas();

  // Far trees: a soft, lumpy line of crowns along the back of the lawn
  for (let x = 0; x < width; x += randomInt(8, 14)) {
    disc(rect, x, horizon - 1, randomInt(6, 9), "#9fcdb0");
  }
  for (let x = 4; x < width; x += randomInt(9, 15)) {
    disc(rect, x, horizon, randomInt(4, 6), "#80b892");
  }

  // Lawn with mowing stripes
  for (let y = horizon; y < pathTop; y += 3) {
    rect(0, y, width, 3, (y - horizon) % 6 === 0 ? "#7cc35a" : "#72b852");
  }

  // A pond with ripples and a duck; the far bank is darker
  const pondX = 146 + randomInt(-4, 4);
  const pondY = horizon + 8;
  const pondWidth = 22;
  const pondHeight = 4;
  for (let row = -pondHeight; row <= pondHeight; row++) {
    const half = Math.round(
      pondWidth * Math.sqrt(1 - (row / pondHeight) ** 2),
    );
    const color = row === -pondHeight ? "#4a90bd" : "#64b2df";
    rect(pondX - half, pondY + row, half * 2 + 1, 1, color);
  }
  rect(pondX - 14, pondY - 1, 5, 1, "#a8dcf5");
  rect(pondX - 2, pondY + 2, 6, 1, "#a8dcf5");
  rect(pondX + 8, pondY - 1, 4, 2, "#ffffff");
  rect(pondX + 11, pondY - 2, 2, 1, "#ffffff");
  rect(pondX + 13, pondY - 2, 1, 1, "#ff9f1a");

  // Flowers dotted along the front of the lawn
  const flowers = ["#ff6b6b", "#ffd43b", "#ffffff", "#c084fc"];
  for (let x = randomInt(0, 5); x < width; x += randomInt(4, 9)) {
    rect(x, verge - randomInt(1, 4), 1, 1, flowers[randomInt(0, 3)]);
  }

  // Trees, one of them in blossom, then lamps and benches
  const blossom = randomInt(0, 2);
  [20, 88, 206].forEach((x, i) => {
    tree(rect, x + randomInt(-4, 4), randomInt(11, 14), i === blossom);
  });
  [56, 178].forEach((x) => lamp(rect, x));
  [108, 228].forEach((x) => bench(rect, x));

  // A neat lawn edge, then the gravel path between stone edges
  rect(0, verge, width, pathTop - verge, "#5fa746");
  rect(0, pathTop, width, height - pathTop, "#b59f76");
  for (let i = 0; i < 160; i++) {
    const x = randomInt(0, width - 1);
    const y = randomInt(pathTop + 2, height - 8);
    const isLight = i % 2 === 0;
    rect(x, y, isLight ? 1 : 2, 1, isLight ? "#c8b48c" : "#957f59");
  }
  rect(0, pathTop, width, 1, "#d8cbae");
  rect(0, height - 6, width, 1, "#d8cbae");
  rect(0, height - 5, width, 5, "#5fa746");

  return canvas;
}
