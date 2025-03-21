import { addFrameCallback } from "./helper/frameCallback.ts";
import { normalizedToCanvas } from "./helper/helper.ts";
import { SpriteFlipBook } from "./spriteFlipBooks/spriteFlipBook.ts";
import * as THREE from "three";

export class SpriteAnimationSelector {
  private spriteFlipBooks: SpriteFlipBook[] = [];
  private currentSelected: SpriteFlipBook;
  private currentPosition: THREE.Vector3 = normalizedToCanvas(-0.8, 0);

  constructor(
    spriteFlipBook: SpriteFlipBook[],
    defaultFlipbookIndex: number = 0
  ) {
    this.spriteFlipBooks = spriteFlipBook;
    this.currentSelected = this.spriteFlipBooks[defaultFlipbookIndex];
    this.selectSpriteIndex(defaultFlipbookIndex);
    this.startAnimation();
  }

  private startAnimation() {
    addFrameCallback(() => this.currentSelected.update());
  }

  public selectSpriteIndex(spriteIndex: number) {
    this.spriteFlipBooks.forEach((spriteFlipBook, index) => {
      if (index !== spriteIndex) {
        spriteFlipBook.hide();
      }
    });
    this.currentSelected = this.spriteFlipBooks[spriteIndex];
    this.currentSelected.setPosition(this.currentPosition);
    this.currentSelected.show();
  }

  public setPosition(x: number, y: number, z: number) {
    this.currentPosition = new THREE.Vector3(x, y, z);
    this.currentSelected.setPosition(this.currentPosition);
  }

  public getPosition() {
    return this.currentSelected.getPosition();
  }
}
