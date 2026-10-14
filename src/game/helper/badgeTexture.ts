import * as THREE from "three";

export interface Badge {
  texture: THREE.CanvasTexture;
  // Width divided by height
  aspect: number;
}

const badgeHeight = 96;
const fontSize = 54;
const paddingX = 30;
const borderWidth = 6;
const radius = 26;
const font =
  `700 ${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;

const cache = new Map<string, Badge>();

// A rounded label with white text, drawn once per text and color
export function getBadgeTexture(
  text: string,
  background: string,
  border: string,
): Badge {
  const key = `${text}|${background}|${border}`;
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  ctx.font = font;
  const textWidth = Math.ceil(ctx.measureText(text).width);
  canvas.width = textWidth + paddingX * 2;
  canvas.height = badgeHeight;

  // Resizing the canvas resets the context, so set the font again
  ctx.fillStyle = border;
  ctx.beginPath();
  ctx.roundRect(0, 0, canvas.width, canvas.height, radius);
  ctx.fill();

  ctx.fillStyle = background;
  ctx.beginPath();
  ctx.roundRect(
    borderWidth,
    borderWidth,
    canvas.width - borderWidth * 2,
    canvas.height - borderWidth * 2,
    radius - borderWidth,
  );
  ctx.fill();

  ctx.font = font;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const badge = { texture, aspect: canvas.width / canvas.height };
  cache.set(key, badge);
  return badge;
}
