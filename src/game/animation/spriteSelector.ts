import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { normalizedToCanvas } from "../helper/helper.ts";
import { getAspectRatio } from "../size.ts";
import { SpriteAnimationEvent } from "./spriteAnimationEvent.ts";
import { SpriteFlipBook } from "./spriteFlipBook.ts";
import * as THREE from "three";

export class SpriteSelector {
  private spriteFlipBooks: Map<string, SpriteFlipBook>;
  private currentSelected: SpriteFlipBook;
  private currentPosition: THREE.Vector3;

  private spriteAnimationEvent = SpriteAnimationEvent.getInstance();
  private oneTimeActionPlaying = false;
  private defaultAnimation: string;

  private isJumping = false;
  private jumpDuration = 0.7;

  constructor(
    spriteFlipBook: Map<string, SpriteFlipBook>,
    defaultAnimation: string
  ) {
    this.spriteFlipBooks = spriteFlipBook;
    this.currentSelected = spriteFlipBook.get(defaultAnimation)!;
    this.currentPosition = normalizedToCanvas(0, 0);
    this.selectAnimation(defaultAnimation);
    this.startAnimation();
    this.defaultAnimation = defaultAnimation;

    this.spriteAnimationEvent.subscribe(() => {
      this.oneTimeActionPlaying = false;
      this.selectAnimation(this.defaultAnimation);
    });
  }

  private startAnimation() {
    addFrameCallback(() => {
      this.currentSelected.update();
      this.applyMovement();
    });
  }

  public collidedWith(otherBoxes: THREE.Box3[]) {
    otherBoxes.forEach((otherBox) => {
      if (this.currentSelected.getPlayerBox().intersectsBox(otherBox)) {
        console.log("Collision detected");
      }
    });
  }

  public getDefaultAnimation(): string {
    return this.defaultAnimation;
  }

  public getPlayerBox() {
    return this.currentSelected.getPlayerBox();
  }

  public selectAnimation(animationName: string, loop = true) {
    if (this.oneTimeActionPlaying) {
      return;
    }

    if (
      this.defaultAnimation === animationName &&
      this.currentSelected.isVisible()
    ) {
      return;
    }

    if (!loop) {
      this.oneTimeActionPlaying = true;
    } else {
      this.defaultAnimation = animationName;
    }

    this.spriteFlipBooks.forEach((spriteFlipBook, name) => {
      if (name !== animationName) {
        spriteFlipBook.hide();
      }
    });
    this.currentSelected = this.spriteFlipBooks.get(animationName)!;
    this.currentSelected.setPosition(this.currentPosition);
    this.currentSelected.show(loop);

    if (animationName === "jump") {
      this.jumpHeight = 0.5 * getAspectRatio();
      this.isJumping = true;
      this.jumpDuration = this.currentSelected.getAnimationDuration();
    }
  }

  public setPosition(position: THREE.Vector3) {
    this.currentPosition = position;
    this.currentSelected.setPosition(this.currentPosition);
  }

  public getPosition() {
    return this.currentSelected.getPosition().clone();
  }

  private elapsedTime = 0;
  private jumpHeight = 0.5 * getAspectRatio();

  private applyMovement() {
    if (this.isJumping) {
      this.elapsedTime += getDeltaTime();

      if (this.elapsedTime <= this.jumpDuration) {
        const t = this.elapsedTime / this.jumpDuration;
        const jumpOffset = this.jumpHeight * Math.sin(Math.PI * t);
        this.currentSelected.setPosition(
          new THREE.Vector3(
            this.currentPosition.x,
            this.currentPosition.y + jumpOffset,
            this.currentPosition.z
          )
        );
      } else {
        this.isJumping = false;
        this.elapsedTime = 0;
      }
    }
  }
}
