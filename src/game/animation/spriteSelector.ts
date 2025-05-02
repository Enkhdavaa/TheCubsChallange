import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { getCharacterPosition } from "../positions.ts";
import { scene } from "../scene.ts";
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

  private playerBox: THREE.Box3;
  private playerBoxHelper: THREE.Box3Helper;

  private boundingBoxDimensions: THREE.Vector3;

  constructor(
    spriteFlipBook: Map<string, SpriteFlipBook>,
    defaultAnimation: string
  ) {
    this.spriteFlipBooks = spriteFlipBook;
    this.currentSelected = spriteFlipBook.get(defaultAnimation)!;
    this.currentPosition = getCharacterPosition();
    this.setPosition(this.currentPosition);
    this.selectAnimation(defaultAnimation);
    this.startAnimation();
    this.defaultAnimation = defaultAnimation;

    this.spriteAnimationEvent.subscribe(() => {
      this.oneTimeActionPlaying = false;
      this.selectAnimation(this.defaultAnimation);
    });

    this.playerBox = new THREE.Box3();
    this.playerBoxHelper = new THREE.Box3Helper(this.playerBox, 0xffff00);
    this.playerBoxHelper.visible = true;

    const sprite = this.currentSelected.getSprite();
    this.boundingBoxDimensions = new THREE.Vector3(
      sprite.scale.x / 4,
      sprite.scale.y / 2,
      0.1
    );

    this.applyBoundingBox();
    this.playerBoxHelper.visible = true;

    scene.add(this.playerBoxHelper);
  }

  private startAnimation() {
    addFrameCallback(() => {
      this.currentSelected.update();
      this.applyMovement();
      this.applyBoundingBox();
    });
  }

  private applyBoundingBox() {
    this.playerBox.setFromCenterAndSize(
      this.currentSelected.getPosition(),
      this.boundingBoxDimensions
    );
    this.playerBoxHelper.position.copy(this.playerBox);
  }

  public collidedWith(otherBoxes: THREE.Box3[]) {
    otherBoxes.forEach((otherBox) => {
      if (this.playerBox.intersectsBox(otherBox)) {
        console.log("Collision detected");
      }
    });
  }

  public getDefaultAnimation(): string {
    return this.defaultAnimation;
  }

  public getPlayerBox() {
    return this.playerBox;
  }

  public selectAnimation(animationName: string, loop = true) {
    if (this.oneTimeActionPlaying) {
      if (loop) {
        this.defaultAnimation = animationName;
      }
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
      this.isJumping = true;
      this.jumpDuration = this.currentSelected.getAnimationDuration();
    }
  }

  public setPosition(position: THREE.Vector3) {
    this.currentPosition = position;
    this.currentSelected.setPosition(this.currentPosition);
  }

  public getPosition(): THREE.Vector3 {
    return this.currentSelected.getPosition().clone();
  }

  private elapsedTime = 0;
  private jumpHeight = 0.5;

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
