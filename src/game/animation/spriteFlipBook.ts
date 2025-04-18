import * as THREE from "three";
import { addToScene } from "../scene.ts";
import { getDeltaTime } from "../helper/frameCallback.ts";
import { SpriteAnimationEvent } from "./spriteAnimationEvent.ts";

export class SpriteFlipBook {
  private tilesHorizontal: number;
  private tilesVertical: number;
  private currentTile = 0;

  private map: THREE.Texture;
  private sprite: THREE.Sprite;

  private playerBox: THREE.Box3;
  private playerBoxHelper: THREE.Box3Helper;
  private enabledColision = false;

  private playSpriteIndices: number[] = [];
  private positionIndices: THREE.Vector3[] = []; //TODO: use this to set the position of the sprite

  private runningTileArrayIndex = 0;

  private totalDuration = 0;
  private animationFinished = false;
  private loop = false;
  private tileDisplayTime = 0;
  private elapsedTime = 0;

  private spriteAnimationEvent = SpriteAnimationEvent.getInstance();

  constructor(
    spriteTexture: string,
    tilesHorizontal: number,
    tilesVertical: number
  ) {
    this.tilesHorizontal = tilesHorizontal;
    this.tilesVertical = tilesVertical;

    this.map = new THREE.TextureLoader().load(spriteTexture);
    this.map.magFilter = THREE.NearestFilter; // sharp pixels
    this.map.repeat.set(1 / tilesHorizontal, 1 / tilesVertical);

    const material = new THREE.SpriteMaterial({ map: this.map });
    this.sprite = new THREE.Sprite(material);
    this.sprite.visible = false;

    this.playerBox = new THREE.Box3();
    this.playerBoxHelper = new THREE.Box3Helper(this.playerBox, 0xffff00);

    this.hide();

    addToScene(this.sprite);
    addToScene(this.playerBoxHelper);
  }

  public setArrayAndDuration(
    playerSpriteIndices: number[],
    totalDuration: number
  ) {
    this.totalDuration = totalDuration;
    this.playSpriteIndices = playerSpriteIndices;
    this.runningTileArrayIndex = 0;
    this.currentTile = playerSpriteIndices[this.runningTileArrayIndex];
    this.tileDisplayTime = totalDuration / playerSpriteIndices.length;
  }

  public setDuration(totalDuration: number) {
    this.totalDuration = totalDuration;
    this.tileDisplayTime = totalDuration / this.playSpriteIndices.length;
    this.totolDurationBuff = totalDuration;
  }

  public setPosition(position: THREE.Vector3) {
    this.sprite.position.set(position.x, position.y, position.z);
  }

  public getPosition() {
    return this.sprite.position;
  }

  public setPositionIndex(THREEPositionIndex: THREE.Vector3[]) {
    this.positionIndices = THREEPositionIndex;
  }

  public hide() {
    this.elapsedTime = 0;
    this.sprite.visible = false;
    this.enabledColision = false;
    this.playerBoxHelper.visible = false;
  }

  public show(loop: boolean = true) {
    this.loop = loop;
    this.elapsedTime = 0;
    this.animationFinished = false;
    this.totolDurationBuff = this.totalDuration;
    this.runningTileArrayIndex = 0;
    this.setOffsetToSetTile();
    this.sprite.visible = true;
    this.enabledColision = true;
  }

  public isVisible() {
    return this.sprite.visible;
  }

  private setBoudingBox() {
    this.playerBox.setFromCenterAndSize(
      this.sprite.position,
      new THREE.Vector3(this.sprite.scale.x / 4, this.sprite.scale.y / 2, 0.1)
    );
    this.playerBoxHelper.box.copy(this.playerBox);
    this.playerBoxHelper.updateMatrixWorld(true);
    this.playerBoxHelper.visible = true;
  }

  public getPlayerBox() {
    return this.playerBox;
  }

  public getAnimationDuration() {
    return this.totalDuration;
  }

  public getElapsedTime() {
    return this.elapsedTime;
  }

  totolDurationBuff = this.totalDuration;

  public update() {
    if (this.animationFinished) {
      return;
    }

    this.elapsedTime += getDeltaTime();

    if (this.elapsedTime > 0 && this.elapsedTime >= this.tileDisplayTime) {
      if (this.loop === false) {
        this.totolDurationBuff -= this.elapsedTime;
        if (this.totolDurationBuff <= 0) {
          this.animationFinished = true;
          this.sprite.visible = false;

          this.spriteAnimationEvent.publish("animationFinished");
          return;
        }
      }

      this.elapsedTime = 0;

      this.setOffsetToSetTile();
      this.setBoudingBox();
    }
  }

  private setOffsetToSetTile() {
    this.runningTileArrayIndex =
      (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length;
    this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex];

    const offsetX =
      (this.currentTile % this.tilesHorizontal) / this.tilesHorizontal;
    const offsetY =
      (this.tilesVertical -
        Math.floor(this.currentTile / this.tilesHorizontal) -
        1) /
      this.tilesVertical;

    this.map.offset.set(offsetX, offsetY);
  }
}
