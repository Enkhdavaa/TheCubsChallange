import * as THREE from "three";
import { scene } from "../scene.ts";
import { getCameraBounds } from "../camera.ts";
import { getElapsedTime } from "../helper/frameCallback.ts";
import { SETTINGS } from "../settings.ts";
import { IObstacle, ObstacleKind } from "./interfaces.ts";
import { OBSTACLE_COLORS } from "./obstacleColors.ts";

export interface SpriteObstacleOptions {
  name: string;
  kind: ObstacleKind;
  texture: THREE.Texture;
  width: number;
  height: number;
  // X of the image's left edge when it spawns
  startX: number;
  // Y where the bottom of the image sits
  bottomY: number;
  // Collision box size relative to the image; below 1 is more forgiving
  hitboxScale?: { x: number; y: number };
}

const markerSize = 0.5;
const markerInset = 0.4;
const markerTextures = new Map<ObstacleKind, THREE.CanvasTexture>();

// A pulsing arrow at the right edge while the obstacle is still off screen
function getMarkerTexture(kind: ObstacleKind) {
  const cached = markerTextures.get(kind);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  ctx.beginPath();
  ctx.moveTo(8, 32);
  ctx.lineTo(54, 8);
  ctx.lineTo(54, 56);
  ctx.closePath();
  ctx.lineJoin = "round";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.fillStyle = OBSTACLE_COLORS[kind].background;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  markerTextures.set(kind, texture);
  return texture;
}

export class SpriteObstacle implements IObstacle {
  public name: string;
  public kind: ObstacleKind;

  private sprite: THREE.Sprite;
  private marker: THREE.Sprite;
  private box = new THREE.Box3();
  private boxHelper: THREE.Box3Helper | null = null;
  private hitboxSize: THREE.Vector3;
  private hitboxCenter = new THREE.Vector3();
  // From the sprite center to the hitbox center
  private hitboxOffsetY: number;

  constructor({
    name,
    kind,
    texture,
    width,
    height,
    startX,
    bottomY,
    hitboxScale = { x: 1, y: 1 },
  }: SpriteObstacleOptions) {
    this.name = name;
    this.kind = kind;

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
    this.sprite.scale.set(width, height, 1);

    // The hitbox rests on the bottom of the image
    const centerY = bottomY + height / 2;
    const hitboxHeight = height * hitboxScale.y;
    this.hitboxSize = new THREE.Vector3(width * hitboxScale.x, hitboxHeight, 1);
    this.hitboxOffsetY = bottomY + hitboxHeight / 2 - centerY;

    this.marker = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: getMarkerTexture(kind) }),
    );
    this.marker.scale.set(markerSize, markerSize, 1);

    this.setPosition(startX + width / 2, centerY);

    scene.add(this.sprite);
    scene.add(this.marker);

    if (SETTINGS.DEBUG) {
      this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
      scene.add(this.boxHelper);
    }
  }

  public getPosition() {
    return this.sprite.position;
  }

  public setPosition(x: number, y: number): void {
    this.sprite.position.set(x, y, 0);
    this.hitboxCenter.set(x, y + this.hitboxOffsetY, 0);
    this.box.setFromCenterAndSize(this.hitboxCenter, this.hitboxSize);
    this.updateMarker();
  }

  public getBoundingBox() {
    return this.box;
  }

  private updateMarker() {
    const { right } = getCameraBounds();
    const imageLeft = this.sprite.position.x - this.sprite.scale.x / 2;
    const isComing = imageLeft > right;

    this.marker.visible = isComing;
    if (isComing) {
      this.marker.position.set(
        right - markerInset,
        this.sprite.position.y,
        0.5,
      );
      this.marker.material.opacity =
        0.65 + 0.35 * Math.sin(getElapsedTime() * 12);
    }
  }

  public dispose() {
    scene.remove(this.sprite);
    scene.remove(this.marker);

    // Textures are shared between obstacles, so only materials are disposed
    this.sprite.material.dispose();
    this.marker.material.dispose();

    if (this.boxHelper) {
      scene.remove(this.boxHelper);
      this.boxHelper.geometry.dispose();
      (this.boxHelper.material as THREE.LineBasicMaterial).dispose();
    }
  }
}
