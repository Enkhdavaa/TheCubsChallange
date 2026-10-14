import {
  createTileCanvas,
  disc,
  PARALLAX,
  PATH_TOP,
  randomInt,
  Rect,
  SceneryLayer,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "./tileCanvas.ts";

// A repeating city park: far trees, then a mown lawn with trees, a pond,
// lamps and benches behind a gravel path
const width = TILE_WIDTH;
const height = TILE_HEIGHT;
const pathTop = PATH_TOP;
// Where the far trees meet the lawn, and the front of the lawn where
// trees, lamps and benches stand
const horizon = 80;
const verge = pathTop - 3;

const iron = "#2e3b3a";

// A round crown on a trunk: shade on the lower right, light on the upper left
function tree(rect: Rect, x: number, radius: number) {
  const trunk = 9;
  const y = verge - trunk - radius + 2;
  rect(x - 1, verge - trunk, 3, trunk, "#6b4423");
  disc(rect, x, y, radius, "#2f7a34");
  disc(rect, x - 1, y - 1, radius - 2, "#3f9440");
  const third = Math.round(radius / 3);
  disc(rect, x - third, y - third, third, "#5cb04c");
}

// Puffs of a cherry crown as [x, y, radius] from its center: wider than
// tall, like a cloud
const blossomPuffs = [
  [-10, 2, 5],
  [10, 2, 5],
  [-5, -2, 7],
  [5, -2, 7],
  [-3, -7, 5],
  [4, -8, 4],
];

// A cherry tree in bloom: a dark trunk forking under a cloudy crown, with
// a few fresh leaves showing and petals fallen on the lawn
function blossomTree(rect: Rect, x: number) {
  const bark = "#5a3a2e";
  const trunk = 9;
  rect(x - 1, verge - trunk, 3, trunk, bark);
  for (let step = 1; step <= 5; step++) {
    rect(x - step, verge - trunk - step, 2, 1, bark);
    rect(x + step - 1, verge - trunk - step, 2, 1, bark);
  }

  const y = verge - trunk - 12;
  blossomPuffs.forEach(([dx, dy, radius]) => {
    disc(rect, x + dx, y + dy, radius, "#d4879f");
  });
  blossomPuffs.forEach(([dx, dy, radius]) => {
    disc(rect, x + dx - 1, y + dy - 1, radius - 1, "#eeaac0");
  });

  // Specks of blossom, light up top and deeper below, and a few fresh
  // leaves low down, where the blossom is thinner
  for (let i = 0; i < 30; i++) {
    const [dx, dy, radius] =
      blossomPuffs[randomInt(0, blossomPuffs.length - 1)];
    const spread = radius - 3;
    const row = randomInt(-spread, spread);
    const color = row < 0 ? "#fad4e1" : i % 3 === 0 ? "#5cb04c" : "#d4879f";
    rect(
      x + dx - 1 + randomInt(-spread, spread),
      y + dy - 1 + row,
      1,
      1,
      color,
    );
  }
  for (let i = 0; i < 8; i++) {
    rect(x + randomInt(-16, 16), verge - randomInt(1, 2), 1, 1, "#fad4e1");
  }
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

// A pond with ripples and a duck; the far bank is darker
function pond(rect: Rect, x: number) {
  const y = horizon + 8;
  const halfWidth = 22;
  const halfHeight = 4;
  for (let row = -halfHeight; row <= halfHeight; row++) {
    const half = Math.round(
      halfWidth * Math.sqrt(1 - (row / halfHeight) ** 2),
    );
    const color = row === -halfHeight ? "#4a90bd" : "#64b2df";
    rect(x - half, y + row, half * 2 + 1, 1, color);
  }
  rect(x - 14, y - 1, 5, 1, "#a8dcf5");
  rect(x - 2, y + 2, 6, 1, "#a8dcf5");
  rect(x + 8, y - 1, 4, 2, "#ffffff");
  rect(x + 11, y - 2, 2, 1, "#ffffff");
  rect(x + 13, y - 2, 1, 1, "#ff9f1a");
}

// Far trees: a soft, lumpy line of crowns along the back of the lawn
function drawFar() {
  const { canvas, rect } = createTileCanvas();
  for (let x = 0; x < width; x += randomInt(8, 14)) {
    disc(rect, x, horizon - 1, randomInt(6, 9), "#9fcdb0");
  }
  for (let x = 4; x < width; x += randomInt(9, 15)) {
    disc(rect, x, horizon, randomInt(4, 6), "#80b892");
  }
  return canvas;
}

// Two different sections of park side by side, so the same tree or the
// pond comes round less often
const sections = [
  { trees: [20, 88, 206], lamps: [56, 178], benches: [108, 228], pond: 146 },
  { trees: [30, 116, 150, 236], lamps: [84, 190], benches: [52, 204] },
];

function drawNear() {
  const nearWidth = width * sections.length;
  const { canvas, rect } = createTileCanvas(nearWidth);

  // Lawn with mowing stripes
  for (let y = horizon; y < pathTop; y += 3) {
    const color = (y - horizon) % 6 === 0 ? "#7cc35a" : "#72b852";
    rect(0, y, nearWidth, 3, color);
  }
  sections.forEach((section, i) => {
    if (section.pond) {
      pond(rect, i * width + section.pond + randomInt(-4, 4));
    }
  });

  // Flowers dotted along the front of the lawn
  const flowers = ["#ff6b6b", "#ffd43b", "#ffffff", "#c084fc"];
  for (let x = randomInt(0, 5); x < nearWidth; x += randomInt(4, 9)) {
    rect(x, verge - randomInt(1, 4), 1, 1, flowers[randomInt(0, 3)]);
  }

  // Trees, one of them in blossom, then lamps and benches
  const trees = sections.flatMap((section, i) =>
    section.trees.map((x) => i * width + x)
  );
  const blossom = randomInt(0, trees.length - 1);
  trees.forEach((x, i) => {
    const at = x + randomInt(-4, 4);
    if (i === blossom) {
      blossomTree(rect, at);
    } else {
      tree(rect, at, randomInt(11, 14));
    }
  });
  sections.forEach((section, i) => {
    section.lamps.forEach((x) => lamp(rect, i * width + x));
    section.benches.forEach((x) => bench(rect, i * width + x));
  });
  return canvas;
}

// A neat lawn edge, then the gravel path between stone edges
function drawGround() {
  const { canvas, rect } = createTileCanvas();
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

export function createParkLayers(): SceneryLayer[] {
  return [
    { canvas: drawFar(), parallax: PARALLAX.far },
    { canvas: drawNear(), parallax: PARALLAX.near },
    { canvas: drawGround(), parallax: PARALLAX.ground },
  ];
}
