import {
  createTileCanvas,
  disc,
  PATH_TOP,
  randomInt,
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
    const at = x + randomInt(-4, 4);
    if (i === blossom) {
      blossomTree(rect, at);
    } else {
      tree(rect, at, randomInt(11, 14));
    }
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
