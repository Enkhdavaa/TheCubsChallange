import { SpriteFlipBook } from "../../animation/spriteFlipBook.ts";
import { SpriteSelector } from "../../animation/spriteSelector.ts";
import * as THREE from "three";

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
const spriteSelector = new SpriteSelector(animationMap, "walk");
spriteSelector.selectAnimation("walk");

const maxSpeed: number = 20;
const minSpeed: number = 0;
const walkMaxSpeed: number = 5;

class MainCharacter {
  private spriteSelector: SpriteSelector;
  private currentSpeed = 1;

  constructor() {
    this.spriteSelector = spriteSelector;
    this.setSpeed(this.currentSpeed);
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

  public getCurrentSpeed() {
    return this.currentSpeed;
  }

  public getMaxSpeed() {
    return maxSpeed;
  }

  public decreaseSpeed(amount = 1) {
    if (this.currentSpeed > 0) {
      this.currentSpeed = this.currentSpeed - amount;
    } else {
      this.currentSpeed = 0;
    }
    this.setSpeed(this.currentSpeed);
  }

  public increaseSpeed(amount = 1) {
    if (this.currentSpeed < maxSpeed) {
      this.currentSpeed = this.currentSpeed + amount;
    } else {
      this.currentSpeed = maxSpeed;
    }
    this.setSpeed(this.currentSpeed);
  }

  private setSpeed(speed: number) {
    console.log("speed", speed);

    if (speed > maxSpeed) {
      this.currentSpeed = maxSpeed;
    }
    if (speed < minSpeed) {
      this.currentSpeed = minSpeed;
    }
    if (this.currentSpeed == 0) {
      mainCharacter.idle();
    } else if (this.currentSpeed > walkMaxSpeed) {
      this.setRunSpeedDuration();
    } else if (this.currentSpeed <= walkMaxSpeed) {
      this.setWalkSpeedDuration();
    }
  }

  private setWalkSpeedDuration() {
    // max walk duration is 1.3 and max is 0.3 seconds
    const translatedSpeedDuration = -0.25 * this.currentSpeed + 1.55;
    walk.setDuration(translatedSpeedDuration);
    this.walk();
  }

  private setRunSpeedDuration() {
    // max run duration is 1 and min is 0.3 seconds
    const translatedSpeedDuration = -0.05 * this.currentSpeed + 1.3;
    run.setDuration(translatedSpeedDuration);
    this.run();
  }
}

export const mainCharacter = new MainCharacter();
