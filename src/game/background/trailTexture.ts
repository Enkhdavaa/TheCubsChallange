// A repeating trail scene: hills, trees and a dirt path. One canvas pixel
// is one art pixel at the runner's scale (24 per world unit), and the
// path lines up with the city road so the runner and obstacles fit both
const width = 256;
const height = 144;
// Where the path starts, matching the city road (70% down)
const pathTop = Math.round(height * 0.7);

function wave(x: number, waves: number, phase = 0) {
  return Math.sin((x / width) * Math.PI * 2 * waves + phase);
}

export function createTrailTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    // Draw a second copy across the edge so the image tiles seamlessly
    ctx.fillRect(x, y, w, h);
    if (x < 0) ctx.fillRect(x + width, y, w, h);
    if (x + w > width) ctx.fillRect(x - width, y, w, h);
  };

  // Distant hills, then nearer ones; whole waves per width keep them seamless
  for (let x = 0; x < width; x++) {
    const far = Math.round(78 + 10 * wave(x, 2) + 5 * wave(x, 5, 1));
    rect(x, far, 1, pathTop - far, "#8cbf6e");
    const near = Math.round(90 + 5 * wave(x, 3, 2) + 3 * wave(x, 7));
    rect(x, near, 1, pathTop - near, "#6aa356");
  }

  // Trees standing on the verge
  const verge = pathTop - 4;
  for (let i = 0; i < 9; i++) {
    const x = Math.floor((i / 9) * width + Math.random() * 20);
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
