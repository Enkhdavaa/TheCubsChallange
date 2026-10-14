import { LandmarkName } from "../levels.ts";
import {
  createTileCanvas,
  disc,
  PARALLAX,
  PATH_TOP,
  pick,
  randomInt,
  Rect,
  SceneryLayer,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "./tileCanvas.ts";

// Eindhoven: a hazy skyline, streets of ordinary buildings, and the road.
// Its landmarks are drawn here too, but stand once each along the route
// instead of repeating with the streets
const height = TILE_HEIGHT;
const pathTop = PATH_TOP;
// Where buildings stand, at the back of the pavement
const base = pathTop - 4;

const glass = "#5f7889";

// Calls draw at each pane of a grid centered across a facade
function eachPane(
  x: number,
  top: number,
  facadeWidth: number,
  rows: number,
  [paneWidth, paneHeight]: [number, number],
  [gapX, gapY]: [number, number],
  draw: (paneX: number, paneY: number) => void,
) {
  const stepX = paneWidth + gapX;
  const columns = Math.floor((facadeWidth - gapX) / stepX);
  const left = x + Math.floor((facadeWidth - columns * stepX + gapX) / 2);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      draw(left + column * stepX, top + row * (paneHeight + gapY));
    }
  }
}

// --- Ordinary streets -----------------------------------------------------

function apartments(rect: Rect, x: number, w: number) {
  const tall = randomInt(40, 60);
  rect(x, base - tall, w, tall, pick(["#d8cfc0", "#c5ccd1", "#cdb9a0"]));
  rect(x, base - tall, w, 2, "#8f9aa1");
  const rows = Math.floor((tall - 12) / 7);
  eachPane(x, base - tall + 5, w, rows, [4, 4], [3, 3], (px, py) => {
    rect(px, py, 4, 4, glass);
  });
  // Shop windows on the ground floor
  rect(x, base - 8, w, 8, "#3e4c56");
  eachPane(x, base - 7, w, 1, [5, 6], [2, 0], (px, py) => {
    rect(px, py, 5, 6, "#7f9aac");
  });
}

function brickBlock(rect: Rect, x: number, w: number) {
  const tall = randomInt(30, 46);
  rect(x, base - tall, w, tall, pick(["#9c5b45", "#8b4d3c", "#a8654a"]));
  rect(x, base - tall, w, 2, "#6e3a2d");
  const rows = Math.floor((tall - 8) / 9);
  eachPane(x, base - tall + 4, w, rows, [5, 7], [4, 2], (px, py) => {
    rect(px, py, 5, 7, "#e8e2d6");
    rect(px + 1, py + 1, 3, 5, glass);
  });
}

function shops(rect: Rect, x: number, w: number) {
  const tall = randomInt(26, 34);
  rect(x, base - tall, w, tall, pick(["#e2d6c2", "#d6c7b0", "#c9d3d6"]));
  const rows = Math.floor((tall - 16) / 6);
  eachPane(x, base - tall + 4, w, rows, [4, 4], [3, 2], (px, py) => {
    rect(px, py, 4, 4, glass);
  });
  // A striped awning over the shop window and the door
  rect(x + 1, base - 11, w - 2, 3, pick(["#d9534f", "#2f7fb5", "#e8a33d"]));
  for (let stripe = x + 3; stripe < x + w - 2; stripe += 4) {
    rect(stripe, base - 11, 2, 3, "#f4f1ea");
  }
  rect(x + 2, base - 8, w - 4, 8, "#6d8798");
  rect(x + w - 8, base - 8, 4, 8, "#3e4c56");
}

// A narrow old house with a stepped gable
function gableHouse(rect: Rect, x: number, w: number) {
  const tall = randomInt(32, 42);
  const wall = pick(["#7c4a3a", "#8b5a2b", "#5c4033", "#6b4231"]);
  rect(x, base - tall, w, tall, wall);
  for (let step = 1; step <= 3; step++) {
    rect(x + step * 2, base - tall - step * 4, w - step * 4, 4, wall);
  }
  const rows = Math.floor((tall - 10) / 9);
  eachPane(x, base - tall + 3, w, rows, [4, 6], [3, 3], (px, py) => {
    rect(px, py, 4, 6, "#e8e2d6");
    rect(px + 1, py + 1, 2, 4, glass);
  });
  rect(x + Math.floor(w / 2) - 2, base - 8, 4, 8, "#3e2a20");
}

const buildings = [apartments, brickBlock, shops, gableHouse];

// Buildings side by side from one x to another
function street(rect: Rect, from: number, to: number) {
  let x = from;
  while (x < to) {
    const draw = pick(buildings);
    let w = draw === gableHouse ? randomInt(18, 22) : randomInt(26, 40);
    // Fold a sliver that's too narrow for a building into this one
    if (to - x - w < 16) {
      w = to - x;
    }
    draw(rect, x, w);
    x += w;
  }
}

function streetTree(rect: Rect, x: number) {
  rect(x, base - 3, 2, 6, "#6b4423");
  disc(rect, x + 1, base - 8, 5, "#3f9440");
  disc(rect, x, base - 9, 2, "#5cb04c");
}

// --- Landmarks ------------------------------------------------------------

// The neo-gothic church in the center: two towers with slate spires
// around a rose window
function catharinakerk(rect: Rect, x: number) {
  const brick = "#8a4b3a";
  const stone = "#c9b9a0";
  const slate = "#4f5b66";
  const dark = "#3b3340";
  rect(x + 14, base - 40, 32, 40, brick);
  for (let row = 0; row < 14; row++) {
    const half = Math.round(16 * (1 - row / 14));
    rect(x + 30 - half, base - 41 - row, half * 2, 1, slate);
  }
  disc(rect, x + 30, base - 27, 5, stone);
  disc(rect, x + 30, base - 27, 3, "#7a5b8c");
  rect(x + 27, base - 13, 6, 13, dark);
  rect(x + 28, base - 14, 4, 1, dark);

  // The right spire is a little taller than the left
  [x, x + 46].forEach((tower, i) => {
    rect(tower, base - 54, 14, 54, brick);
    rect(tower + 12, base - 54, 2, 54, "#6e3a2d");
    rect(tower, base - 20, 14, 1, stone);
    rect(tower, base - 38, 14, 1, stone);
    rect(tower + 5, base - 34, 4, 10, dark);
    rect(tower + 6, base - 35, 2, 1, dark);
    rect(tower + 5, base - 50, 4, 8, dark);
    rect(tower + 6, base - 51, 2, 1, dark);
    const spire = i === 0 ? 28 : 32;
    for (let row = 0; row < spire; row++) {
      const half = Math.max(1, Math.round(7 * (1 - row / spire)));
      rect(tower + 7 - half, base - 55 - row, half * 2, 1, slate);
    }
    rect(tower + 6, base - 58 - spire, 2, 3, stone);
    rect(tower, base - 58, 2, 4, slate);
    rect(tower + 12, base - 58, 2, 4, slate);
  });
}

// The glass bubble on 18 Septemberplein, taller on one side, with a grid
// of panels
function blob(rect: Rect, x: number) {
  const w = 64;
  for (let column = 0; column < w; column++) {
    const t = ((column + 0.5) / w) * 2 - 1;
    const tall = Math.round(Math.sqrt(1 - t * t) * (28 - 7 * t));
    for (let row = 0; row < tall; row++) {
      const isFrame = (column + row) % 6 === 0 ||
        (column - row + 60) % 6 === 0;
      const color = row === tall - 1
        ? "#4f6f88"
        : isFrame
        ? "#c6dcea"
        : column < 24
        ? "#8bb2cd"
        : "#7499b5";
      rect(x + column, base - 1 - row, 1, 1, color);
    }
  }
  rect(x + 28, base - 8, 10, 8, "#2f4252");
}

// The old Philips works with its tower, topped by the glass room where
// light bulbs were tested
function lichttoren(rect: Rect, x: number) {
  const wall = "#ece4cf";
  const shade = "#d3c9b0";
  const window = "#4b6378";
  rect(x, base - 36, 64, 36, wall);
  rect(x, base - 36, 64, 2, shade);
  rect(x, base - 5, 64, 5, shade);
  eachPane(x, base - 32, 64, 4, [3, 4], [3, 3], (px, py) => {
    rect(px, py, 3, 4, window);
  });

  const tower = x + 23;
  rect(tower, base - 66, 18, 30, wall);
  rect(tower + 16, base - 66, 2, 30, shade);
  eachPane(tower, base - 62, 18, 3, [2, 5], [3, 4], (px, py) => {
    rect(px, py, 2, 5, window);
  });
  rect(tower - 1, base - 68, 20, 2, shade);
  // The lamp room, lit like a bulb, under a dome
  rect(tower + 2, base - 78, 14, 10, "#fff3c4");
  [0, 4, 9, 13].forEach((bar) => {
    rect(tower + 2 + bar, base - 78, 1, 10, "#b8a77a");
  });
  for (let row = 0; row < 5; row++) {
    const half = 8 - row;
    rect(tower + 9 - half, base - 79 - row, half * 2, 1, "#7d8b93");
  }
  rect(tower + 8, base - 87, 2, 3, "#7d8b93");
}

// The white Philips factory: a tall grid of windows between white piers
function witteDame(rect: Rect, x: number) {
  const pier = "#dcdad2";
  rect(x + 30, base - 72, 32, 6, "#e6e4dc");
  rect(x, base - 66, 92, 66, "#f3f2ed");
  rect(x, base - 66, 92, 2, pier);
  rect(x + 90, base - 66, 2, 66, pier);
  for (let bay = x + 3; bay + 6 <= x + 89; bay += 8) {
    for (let y = base - 61; y < base - 12; y += 7) {
      rect(bay, y, 6, 5, "#7d97ad");
      rect(bay, y, 6, 1, "#a9bfd1");
    }
  }
  // Glass ground floor
  rect(x, base - 10, 92, 10, "#5f7d93");
  for (let mullion = x; mullion < x + 92; mullion += 6) {
    rect(mullion, base - 10, 1, 10, "#e6e4dc");
  }
}

// The flying saucer on its lawn: slanted legs, a bowl, a band of windows
// and a ribbed dome
function evoluon(rect: Rect, x: number) {
  const concrete = "#e6e6e0";
  const shade = "#c9c9c1";
  const center = x + 44;
  rect(x, base - 3, 88, 3, "#6aa356");
  rect(center - 18, base - 13, 36, 13, "#47606f");
  for (let row = 0; row < 14; row++) {
    const out = 15 + Math.floor(row / 2);
    rect(center - out - 1, base - 1 - row, 2, 1, shade);
    rect(center + out - 1, base - 1 - row, 2, 1, shade);
  }
  for (let row = 0; row < 12; row++) {
    const half = Math.round(44 * Math.sqrt(1 - (row / 12) ** 2));
    rect(
      center - half,
      base - 25 + row,
      half * 2,
      1,
      row > 7 ? shade : concrete,
    );
  }
  rect(center - 44, base - 29, 88, 4, "#3e5566");
  for (let bar = center - 44; bar < center + 44; bar += 3) {
    rect(bar, base - 29, 1, 4, "#9fb6c6");
  }
  for (let row = 0; row < 12; row++) {
    const half = Math.round(40 * Math.sqrt(1 - (row / 12) ** 2));
    const y = base - 30 - row;
    rect(center - half, y, half * 2, 1, concrete);
    // Ribs curving in toward the top
    for (let rib = -30; rib <= 30; rib += 10) {
      rect(center + Math.round((rib * half) / 40), y, 1, 1, shade);
    }
  }
  rect(center - 4, base - 42, 8, 1, shade);
}

// Strijp-S: the Klokgebouw factory hall with its clock tower, and the
// brick Ketelhuis with its chimney and a mural
function strijpS(rect: Rect, x: number) {
  const frame = "#d2cdc3";
  const shade = "#a39d92";
  const panel = "#5d6b74";
  rect(x, base - 44, 108, 44, frame);
  rect(x, base - 44, 108, 2, shade);
  for (let bay = x + 2; bay + 6 <= x + 106; bay += 8) {
    [39, 27, 15].forEach((up) => {
      rect(bay, base - up, 6, 10, panel);
      rect(bay + 3, base - up, 1, 10, "#7d8b94");
    });
  }

  const tower = x + 78;
  rect(tower, base - 86, 16, 42, frame);
  rect(tower + 14, base - 86, 2, 42, shade);
  rect(tower - 1, base - 88, 18, 2, shade);
  for (let y = base - 66; y < base - 46; y += 6) {
    rect(tower + 6, y, 4, 4, panel);
  }
  disc(rect, tower + 8, base - 76, 6, "#3a3f44");
  disc(rect, tower + 8, base - 76, 5, "#ffffff");
  rect(tower + 8, base - 80, 1, 4, "#3a3f44");
  rect(tower + 8, base - 76, 3, 1, "#3a3f44");

  const brick = "#9b4a36";
  const brickDark = "#7c3a2a";
  const chimney = x + 140;
  for (let row = 0; row < 84; row++) {
    const w = 8 - Math.floor(row / 30);
    const color = row % 14 === 13 ? brickDark : brick;
    rect(chimney - Math.floor(w / 2), base - 1 - row, w, 1, color);
  }
  rect(chimney - 5, base - 86, 10, 2, brickDark);
  rect(x + 112, base - 28, 38, 28, brick);
  rect(x + 112, base - 28, 38, 2, brickDark);
  for (let i = 0; i < 3; i++) {
    rect(x + 116 + i * 12, base - 22, 6, 11, "#40525e");
    rect(x + 117 + i * 12, base - 23, 4, 1, "#40525e");
  }
  ["#f25f5c", "#ffe066", "#247ba0", "#70c1b3"].forEach((color, i) => {
    rect(x + 113 + i * 9, base - 8, 9, 7, color);
  });
  for (let i = 0; i < 36; i++) {
    rect(
      x + 113 + i,
      base - 5 - (i % 4 === 1 || i % 4 === 2 ? 1 : 0),
      1,
      1,
      "#ffffff",
    );
  }
}

const landmarks: Record<
  LandmarkName,
  { width: number; draw: (rect: Rect, x: number) => void }
> = {
  catharinakerk: { width: 60, draw: catharinakerk },
  blob: { width: 64, draw: blob },
  lichttoren: { width: 64, draw: lichttoren },
  witteDame: { width: 92, draw: witteDame },
  evoluon: { width: 88, draw: evoluon },
  strijpS: { width: 150, draw: strijpS },
};

// A landmark on its own, as tall as the scenery so its rows line up
export function createLandmarkCanvas(name: LandmarkName) {
  const { width, draw } = landmarks[name];
  const { canvas, rect } = createTileCanvas(width);
  draw(rect, 0);
  return canvas;
}

// Far-off blocks of the rest of the city, pale in the haze
function drawFar() {
  const width = TILE_WIDTH * 2;
  const { canvas, rect } = createTileCanvas(width);
  for (let x = 0; x < width;) {
    const w = randomInt(14, 30);
    const tall = randomInt(36, 76);
    rect(x, base - tall, w, tall, pick(["#b4cbd8", "#a7c0cf"]));
    x += w + randomInt(0, 6);
  }
  return canvas;
}

// Streets of ordinary buildings, four tiles wide so the same building
// comes round only now and then
function drawNear() {
  const width = TILE_WIDTH * 4;
  const { canvas, rect } = createTileCanvas(width);
  street(rect, 0, width);
  return canvas;
}

// Pavement with street trees, then the road
function drawGround() {
  const width = TILE_WIDTH;
  const { canvas, rect } = createTileCanvas(width);
  rect(0, base, width, pathTop - base, "#bab6ae");
  for (let joint = 0; joint < width; joint += 6) {
    rect(joint, base, 1, pathTop - base, "#aaa69e");
  }
  for (let tree = randomInt(8, 20); tree < width - 24;) {
    streetTree(rect, tree);
    tree += randomInt(48, 80);
  }

  // A kerb, asphalt with a dashed line, then grass at the bottom
  rect(0, pathTop, width, 1, "#d7d3cb");
  rect(0, pathTop + 1, width, height - pathTop - 7, "#55595c");
  for (let i = 0; i < 80; i++) {
    const y = randomInt(pathTop + 2, height - 8);
    rect(randomInt(0, width - 1), y, 1, 1, "#62676a");
  }
  for (let dash = 0; dash < width; dash += 16) {
    rect(dash, pathTop + 18, 8, 2, "#dcdcdc");
  }
  rect(0, height - 6, width, 1, "#d7d3cb");
  rect(0, height - 5, width, 5, "#4f8a3a");

  return canvas;
}

export function createCityLayers(): SceneryLayer[] {
  return [
    { canvas: drawFar(), parallax: PARALLAX.far },
    { canvas: drawNear(), parallax: PARALLAX.near },
    { canvas: drawGround(), parallax: PARALLAX.ground },
  ];
}
