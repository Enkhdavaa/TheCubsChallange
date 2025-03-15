import * as THREE from "three";
import getDeltaTime from "./time.ts";
import scene from "./scene.ts";

export class SpriteFlipBook {
  private tilesHorizontal: number;
  private tilesVertical: number;
  private currentTile = 0;

  private map: THREE.Texture;
  private sprite: THREE.Sprite;

  private playSpriteIndices: number[] = [];
  private runningTileArrayIndex = 0;

  private maxDisplayTime = 0;
  private elapsedTime = 0;

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
    scene.add(this.sprite);
  }

  public loop(playerSpriteIndices: number[], totalDuration: number) {
    this.playSpriteIndices = playerSpriteIndices;
    this.runningTileArrayIndex = 0;
    this.currentTile = playerSpriteIndices[this.runningTileArrayIndex];
    this.maxDisplayTime = totalDuration / playerSpriteIndices.length;
  }

  public setPosition(x: number, y: number, z: number) {
    this.sprite.position.set(x, y, z);
  }

  public getPosition() {
    return this.sprite.position;
  }

  public addPosition(x: number, y: number, z: number) {
    this.sprite.position.add(new THREE.Vector3(x, y, z));
  }

  public hide() {
    this.sprite.visible = false;
  }

  public show() {
    this.sprite.visible = true;
  }

  public update() {
    this.elapsedTime += getDeltaTime();

    if (this.elapsedTime > 0 && this.elapsedTime >= this.maxDisplayTime) {
      this.elapsedTime = 0;
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
}
