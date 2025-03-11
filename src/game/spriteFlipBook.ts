import * as THREE from "three";

export class SpriteFlipBook {
  private tilesHorizontal: number;
  private tilesVertical: number;
  private currentTile = 0;

  private map: THREE.Texture;
  private sprite: THREE.Sprite;

  constructor(
    spriteTexture: string,
    tilesHorizontal: number,
    tilesVertical: number,
    scene: THREE.Scene
  ) {
    this.tilesHorizontal = tilesHorizontal;
    this.tilesVertical = tilesVertical;

    this.map = new THREE.TextureLoader().load(spriteTexture);
    this.map.magFilter = THREE.NearestFilter; // sharp pixels
    this.map.repeat.set(1 / tilesHorizontal, 1 / tilesVertical);

    const material = new THREE.SpriteMaterial({ map: this.map });
    this.sprite = new THREE.Sprite(material);

    scene.add(this.sprite);
  }

  private playSpriteIndices: number[] = [];
  private runningTileArrayIndex = 0;
  private maxDisplayTime = 0;
  private elapsedTime = 0;

  public loop(playerSpriteIndices: number[], totalDuration: number) {
    this.playSpriteIndices = playerSpriteIndices;
    this.runningTileArrayIndex = 0;
    this.currentTile = playerSpriteIndices[this.runningTileArrayIndex];
    this.maxDisplayTime = totalDuration / playerSpriteIndices.length;
  }

  public update(deltaTime: number) {
    this.elapsedTime += deltaTime;
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
