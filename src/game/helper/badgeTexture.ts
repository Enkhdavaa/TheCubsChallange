import * as THREE from "three";
import { PIXEL_FONT } from "./pixelFont.ts";

export interface Badge {
  texture: THREE.CanvasTexture;
  // Width divided by height
  aspect: number;
}

// Canvas pixels; one "art pixel" of the frame is `pixel` canvas pixels
const pixel = 6;
const badgeHeight = 96;
const fontSize = 52;
const paddingX = 30;
const font = `${fontSize}px ${PIXEL_FONT}`;

const cache = new Map<string, Badge>();

// A square pixel-art label with white text, drawn once per text and color
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
  const { width, height } = canvas;

  // Border with notched corners
  ctx.fillStyle = border;
  ctx.fillRect(pixel, 0, width - pixel * 2, height);
  ctx.fillRect(0, pixel, width, height - pixel * 2);

  // Face, with a light top edge and a dark bottom edge for depth
  ctx.fillStyle = background;
  ctx.fillRect(pixel, pixel, width - pixel * 2, height - pixel * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fillRect(pixel, pixel, width - pixel * 2, pixel);
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(pixel, height - pixel * 2, width - pixel * 2, pixel);

  // Resizing the canvas resets the context, so set the font again
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const x = width / 2;
  const y = height / 2;
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillText(text, x + 4, y + 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, x, y);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const badge = { texture, aspect: width / height };
  cache.set(key, badge);
  return badge;
}
