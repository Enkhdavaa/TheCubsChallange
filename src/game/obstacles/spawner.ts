import { ObstacleManager } from "./obstracleManager.ts";
import { randomTexts } from "./text.ts";
import { TextObstacle } from "./textObstacle.ts";
import { RoadObstracle, roadIconNames } from "./roadObstracle.ts";
import { getDeltaTime } from "../helper/frameCallback.ts";
import { getCameraBounds } from "../camera.ts";
import { getCharacterPosition } from "../positions.ts";
import { mainCharacter } from "../characters/main/mainCharacter.ts";
import { runState } from "../runState.ts";
import { SETTINGS } from "../settings.ts";

const PICKUP_CHANCE = 0.45;
const ROAD_ICON_CHANCE = 0.5;

// Seconds before the first obstacle, so the start is calm
const FIRST_SPAWN_DELAY = 1.5;
// No obstacles this close to the finish line
const FINISH_CLEARANCE = 4;

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export class Spawner {
  private obstacleManager: ObstacleManager;

  private elapsed = 0;
  private nextSpawnTime = FIRST_SPAWN_DELAY;

  constructor(obstacleManager: ObstacleManager) {
    this.obstacleManager = obstacleManager;
  }

  public reset() {
    this.elapsed = 0;
    this.nextSpawnTime = FIRST_SPAWN_DELAY;
  }

  public update() {
    if (runState.phase !== "running") {
      return;
    }

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
    // Start off screen far enough that the edge marker shows for a moment
    const { right } = getCameraBounds();
    const leadDistance = mainCharacter.getWorldSpeed() * SETTINGS.WARNING_LEAD_TIME;
    const startX = right + leadDistance;

    const finishX = getCharacterPosition().x + runState.getRemainingUnits();
    if (finishX < startX + FINISH_CLEARANCE) {
      return;
    }

    this.obstacleManager.addObstacle(this.createObstacle(startX));
  }

  private createObstacle(startX: number) {
    if (Math.random() < PICKUP_CHANCE) {
      return new TextObstacle(pickRandom(randomTexts.good), "pickup", startX);
    }
    if (Math.random() < ROAD_ICON_CHANCE) {
      return new RoadObstracle(pickRandom(roadIconNames), startX);
    }
    return new TextObstacle(pickRandom(randomTexts.bad), "hazard", startX);
  }
}
