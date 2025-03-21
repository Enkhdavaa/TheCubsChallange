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

  constructor(
    spriteFlipBook: Map<string, SpriteFlipBook>,
    defaultAnimation: string
  ) {
    this.spriteFlipBooks = spriteFlipBook;
    this.currentSelected = spriteFlipBook.get(defaultAnimation)!;
    this.currentPosition = normalizedToCanvas(0, 0);
    this.selectAnimation(defaultAnimation);
    this.startAnimation();

    this.spriteAnimationEvent.subscribe(() => {
      this.selectAnimation("run");
    });
  }

  private startAnimation() {
    addFrameCallback(() => this.currentSelected.update());
  }

  public selectAnimation(animationName: string, loop = true) {
    this.spriteFlipBooks.forEach((spriteFlipBook, name) => {
      if (name !== animationName) {
        spriteFlipBook.hide();
      }
    });
    this.currentSelected = this.spriteFlipBooks.get(animationName)!;
    this.currentSelected.setPosition(this.currentPosition);
    this.currentSelected.show(loop);
  }

  public setPosition(x: number, y: number, z: number) {
    this.currentPosition = new THREE.Vector3(x, y, z);
    this.currentSelected.setPosition(this.currentPosition);
  }

  public getPosition() {
    return this.currentSelected.getPosition();
  }
}
