import { addFrameCallback } from "../helper/frameCallback.ts";
import { normalizedToCanvas } from "../helper/helper.ts";
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
    addFrameCallback(() => this.currentSelected.update());
  }

  public collidedWith(otherBoxes: THREE.Box3[]) {
    otherBoxes.forEach((otherBox) => {
      if (this.currentSelected.getPlayerBox().intersectsBox(otherBox)) {
        console.log("Collision detected");
      }
    });
  }

  public getPlayerBox() {
    return this.currentSelected.getPlayerBox();
  }

  public selectAnimation(animationName: string, loop = true) {
    if (this.oneTimeActionPlaying) {
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
  }

  public setPosition(x: number, y: number) {
    this.currentPosition = normalizedToCanvas(x, y);
    this.currentSelected.setPosition(this.currentPosition);
  }

  public getPosition() {
    return this.currentSelected.getPosition();
  }
}
