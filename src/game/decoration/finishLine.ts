import * as THREE from "three";
import { scene } from "../scene.ts";
import { course } from "../course.ts";
import { GROUND_Y } from "../positions.ts";
import { placeOnCourse } from "./courseMarkers.ts";

// Pixel art arch, drawn at a size close to the runner's pixel scale
const pixelWidth = 48;
const pixelHeight = 64;
const unitsPerPixel = 0.05;

function createArchTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  const ctx = canvas.getContext("2d")!;

  // Posts
  ctx.fillStyle = "#e9ecef";
  ctx.fillRect(2, 14, 4, pixelHeight - 14);
  ctx.fillRect(pixelWidth - 6, 14, 4, pixelHeight - 14);
  ctx.fillStyle = "#868e96";
  ctx.fillRect(5, 14, 1, pixelHeight - 14);
  ctx.fillRect(pixelWidth - 3, 14, 1, pixelHeight - 14);

  // Checkered banner
  const square = 4;
  for (let y = 2; y < 14; y += square) {
    for (let x = 0; x < pixelWidth; x += square) {
      const isDark = (x / square + (y - 2) / square) % 2 === 0;
      ctx.fillStyle = isDark ? "#212529" : "#ffffff";
      ctx.fillRect(x, y, square, square);
    }
  }

  // Finish tape at chest height
  ctx.fillStyle = "#e03131";
  ctx.fillRect(6, pixelHeight - 26, pixelWidth - 12, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class FinishLine {
  private sprite: THREE.Sprite;

  constructor() {
    this.sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: createArchTexture() }),
    );
    this.sprite.scale.set(
      pixelWidth * unitsPerPixel,
      pixelHeight * unitsPerPixel,
      1,
    );
    this.sprite.visible = false;
    scene.add(this.sprite);
  }

  // Sits exactly at the end of the course, behind the runner
  public update() {
    placeOnCourse(this.sprite, course.goalUnits, GROUND_Y, -0.5);
  }
}
