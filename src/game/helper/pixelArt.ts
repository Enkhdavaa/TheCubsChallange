import * as THREE from "three";

// Turns rows of characters into a crisp texture: each character is one
// pixel, colored from the palette; "." (or any unlisted character) is clear
export function createPixelArtTexture(
  rows: string[],
  palette: Record<string, string>,
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(...rows.map((row) => row.length));
  canvas.height = rows.length;
  const ctx = canvas.getContext("2d")!;

  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      const color = palette[cell];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
