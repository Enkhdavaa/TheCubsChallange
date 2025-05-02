import * as THREE from "three";
import { helvetiker_regular_font } from "../helper/text3dFonts.ts";
import { ObstacleManager } from "./obstracleManager.ts";
import { randomTexts } from "./text.ts";
import { TextObstacle } from "./textObstacle.ts";
import { RoadObstracle } from "./roadObstracle.ts";
import { getDeltaTime } from "../helper/frameCallback.ts";

const BAD_OBSTACLE_SCALE = 0.2;
const ROAD_OBSTACLE_SCALE = 0.4;

const goodMaterial = new THREE.MeshBasicMaterial({
  color: 0x42f360,
});

const badMaterial = new THREE.MeshBasicMaterial({
  color: 0xee7257,
});

const combined = [
  ...randomTexts["good"],
  ...randomTexts["bad"],
  ...randomTexts["roadObstacles"],
];

export class Spawner {
  private obstacleManager: ObstacleManager;

  private elapsed = 0;
  private nextSpawnTime = this.getNextInterval();

  constructor(obstacleManager: ObstacleManager) {
    this.obstacleManager = obstacleManager;
  }

  public update() {
    this.elapsed += getDeltaTime();

    if (this.elapsed >= this.nextSpawnTime) {
      this.spawn();
      this.elapsed = 0;
      this.nextSpawnTime = this.getNextInterval();
    }
  }

  private getNextInterval(): number {
    return 1.5 + Math.random() * 1.0; // seconds
  }

  private spawn() {
    const index = Math.floor(Math.random() * combined.length);
    const obstacleText = combined[index];
    const obstacle = this.createObstacle(obstacleText);

    if (obstacle) {
      this.obstacleManager.addObstacle(obstacle);
    }
  }

  public createObstacle(obstacleText: string) {
    if (randomTexts["good"].includes(obstacleText)) {
      return new TextObstacle(
        obstacleText,
        BAD_OBSTACLE_SCALE,
        helvetiker_regular_font,
        goodMaterial
      );
    } else if (randomTexts["bad"].includes(obstacleText)) {
      return new TextObstacle(
        obstacleText,
        BAD_OBSTACLE_SCALE,
        helvetiker_regular_font,
        badMaterial
      );
    } else if (randomTexts["roadObstacles"].includes(obstacleText)) {
      return new RoadObstracle(
        obstacleText,
        `sprites/obstacle/${obstacleText}.png`,
        ROAD_OBSTACLE_SCALE
      );
    }
    return null;
  }
}
