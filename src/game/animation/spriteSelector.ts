import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { getCharacterPosition } from "../positions.ts";
import { scene } from "../scene.ts";
import { SETTINGS } from "../settings.ts";
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
  private boundingBoxOffset: THREE.Vector3;

  private tintTimeLeft = 0;
  private tintDuration = 0.3;

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

    // Match the visible body instead of the whole sprite frame
    const { width, bottom, top } = SETTINGS.PLAYER_HITBOX;
    this.boundingBoxDimensions = new THREE.Vector3(width, top - bottom, 0.1);
    this.boundingBoxOffset = new THREE.Vector3(0, (top + bottom) / 2, 0);

    this.applyBoundingBox();
    this.playerBoxHelper.visible = SETTINGS.DEBUG;

    scene.add(this.playerBoxHelper);
  }

  private startAnimation() {
    addFrameCallback(() => {
      this.currentSelected.update();
      this.applyMovement();
      this.applyBoundingBox();
      this.applyTint();
    });
  }

  private applyBoundingBox() {
    this.playerBox.setFromCenterAndSize(
      this.currentSelected.getPosition().clone().add(this.boundingBoxOffset),
      this.boundingBoxDimensions
    );
  }

  // Briefly color the runner, e.g. green for a pickup and red for a hit
  public flash(color: THREE.ColorRepresentation) {
    this.tintTimeLeft = this.tintDuration;
    this.spriteFlipBooks.forEach((spriteFlipBook) => {
      spriteFlipBook.setTint(color);
    });
  }

  private applyTint() {
    if (this.tintTimeLeft <= 0) {
      return;
    }

    this.tintTimeLeft -= getDeltaTime();
    if (this.tintTimeLeft <= 0) {
      this.spriteFlipBooks.forEach((spriteFlipBook) => {
        spriteFlipBook.setTint(0xffffff);
      });
    }
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
  private jumpHeight = SETTINGS.JUMP_HEIGHT;

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
