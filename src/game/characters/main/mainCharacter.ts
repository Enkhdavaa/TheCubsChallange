import { SpriteFlipBook } from "../../animation/spriteFlipBook.ts";
import { SpriteSelector } from "../../animation/spriteSelector.ts";
import * as THREE from "three";
import { addResizeCallback } from "../../helper/resizeCallback.ts";
import { getCharacterPosition } from "../../positions.ts";

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

// Speed levels while running; 0 means standing still
const maxSpeedLevel = 10;
const minSpeedLevel = 1;
const startSpeedLevel = 4;
const walkMaxSpeedLevel = 2;

// World units per second the ground moves at a given level
const baseWorldSpeed = 3.5;
const worldSpeedPerLevel = 0.55;

const pickupTint = 0x9dff9d;
const hitTint = 0xff7070;

class MainCharacter {
  private spriteSelector: SpriteSelector;
  private speedLevel = 0;

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

  public start() {
    this.setSpeedLevel(startSpeedLevel);
  }

  public stop() {
    this.setSpeedLevel(0);
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

  public getSpeedLevel() {
    return this.speedLevel;
  }

  public getMaxSpeedLevel() {
    return maxSpeedLevel;
  }

  public getWorldSpeed() {
    if (this.speedLevel === 0) {
      return 0;
    }
    return baseWorldSpeed + worldSpeedPerLevel * this.speedLevel;
  }

  public increaseSpeed(amount = 1) {
    this.spriteSelector.flash(pickupTint);
    this.setSpeedLevel(Math.min(maxSpeedLevel, this.speedLevel + amount));
  }

  // Setbacks slow the runner down but never stop them mid-run
  public decreaseSpeed(amount = 2) {
    this.spriteSelector.flash(hitTint);
    this.setSpeedLevel(Math.max(minSpeedLevel, this.speedLevel - amount));
  }

  private setSpeedLevel(level: number) {
    this.speedLevel = level;

    if (level === 0) {
      this.idle();
    } else if (level <= walkMaxSpeedLevel) {
      this.setWalkSpeedDuration();
    } else {
      this.setRunSpeedDuration();
    }
  }

  private setWalkSpeedDuration() {
    // Walk cycle takes 0.8 seconds at level 1 and 0.65 at the top walk level
    const translatedSpeedDuration = 0.8 - (this.speedLevel - 1) * 0.15;
    walk.setDuration(translatedSpeedDuration);
    this.walk();
  }

  private setRunSpeedDuration() {
    // Run cycle takes 0.75 seconds just above walking and 0.45 at max speed
    const runLevels = maxSpeedLevel - walkMaxSpeedLevel - 1;
    const progress = (this.speedLevel - walkMaxSpeedLevel - 1) / runLevels;
    const translatedSpeedDuration = 0.75 - progress * 0.3;
    run.setDuration(translatedSpeedDuration);
    this.run();
  }
}

export const mainCharacter = new MainCharacter();
