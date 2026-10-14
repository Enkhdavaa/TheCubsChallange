import { SpriteFlipBook } from "../../animation/spriteFlipBook.ts";
import { SpriteSelector } from "../../animation/spriteSelector.ts";
import * as THREE from "three";
import { addResizeCallback } from "../../helper/resizeCallback.ts";
import { getCharacterPosition } from "../../positions.ts";
import { getWorldSpeed, PaceZone } from "../../pace.ts";

import idle from "../../animation/sprites/idle.ts";
import jump from "../../animation/sprites/jump.ts";
import run from "../../animation/sprites/run.ts";
import walk from "../../animation/sprites/walk.ts";

// Create animation map
const animationMap = new Map<string, SpriteFlipBook>();
animationMap.set("idle", idle);
animationMap.set("jump", jump);
animationMap.set("run", run);
animationMap.set("walk", walk);

// Animation selector
const spriteSelector = new SpriteSelector(animationMap, "idle");

// Seconds per stride cycle at each pace
const strideDurations: Record<PaceZone, number> = {
  walk: 0.8,
  easy: 0.7,
  steady: 0.58,
  fast: 0.48,
};

const pickupTint = 0x9dff9d;
const hitTint = 0xff7070;

class MainCharacter {
  private spriteSelector: SpriteSelector;
  private isMoving = false;
  private zone: PaceZone = "easy";

  constructor() {
    this.spriteSelector = spriteSelector;
    addResizeCallback(() => this.setPosition(getCharacterPosition()));
  }

  public getPosition() {
    return this.spriteSelector.getPosition();
  }

  public setPosition(position: THREE.Vector3) {
    this.spriteSelector.setPosition(position);
  }

  public getBoundingBox() {
    return this.spriteSelector.getPlayerBox();
  }

  public start(zone: PaceZone) {
    this.isMoving = true;
    this.setPace(zone);
  }

  public stop() {
    this.isMoving = false;
    this.idle();
  }

  public setPace(zone: PaceZone) {
    this.zone = zone;
    if (!this.isMoving) {
      return;
    }

    if (zone === "walk") {
      walk.setDuration(strideDurations.walk);
      this.walk();
    } else {
      run.setDuration(strideDurations[zone]);
      this.run();
    }
  }

  public jump() {
    spriteSelector.selectAnimation("jump", false);
  }

  public run() {
    spriteSelector.selectAnimation("run");
  }
  public walk() {
    spriteSelector.selectAnimation("walk");
  }

  public idle() {
    spriteSelector.selectAnimation("idle");
  }

  public getWorldSpeed() {
    return this.isMoving ? getWorldSpeed(this.zone) : 0;
  }

  public flashPickup() {
    this.spriteSelector.flash(pickupTint);
  }

  public flashHit() {
    this.spriteSelector.flash(hitTint);
  }
}

export const mainCharacter = new MainCharacter();
