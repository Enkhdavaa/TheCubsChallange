import { ObstacleManager } from "./obstracleManager.ts";
import { TextObstacle } from "./textObstacle.ts";
import { RoadObstracle } from "./roadObstracle.ts";
import { getDeltaTime } from "../helper/frameCallback.ts";
import { getCameraBounds } from "../camera.ts";
import { course, getHillSpeedFactor } from "../course.ts";
import { getWorldSpeed } from "../pace.ts";
import { getCharacterPosition } from "../positions.ts";
import { mainCharacter } from "../characters/main/mainCharacter.ts";
import { runState } from "../runState.ts";
import { SETTINGS } from "../settings.ts";

const PICKUP_CHANCE = 0.45;
const ROAD_ICON_CHANCE = 0.5;

// Seconds before the first obstacle, so the start is calm
const FIRST_SPAWN_DELAY = 1.5;
// No obstacles this close to a crossing or the finish line
const CLEARANCE = 4;
// Wider than any obstacle, in world units
const MAX_OBSTACLE_WIDTH = 3;
// Text setbacks are up to about 1.5 units wide. Slower than this (walking
// up a hill) there isn't time to jump clear of one, so only the narrow
// ground hazards go where the runner might be that slow
const MIN_SPEED_FOR_TEXT_SETBACKS = 4.1;

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
    // Nothing new comes while the runner waits at a light
    if (runState.phase !== "running" || mainCharacter.getWorldSpeed() === 0) {
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

    const startUnits = runState.getDistanceUnits() +
      (startX - getCharacterPosition().x);
    if (!course.isClear(startUnits, startUnits + MAX_OBSTACLE_WIDTH, CLEARANCE)) {
      return;
    }

    this.obstacleManager.addObstacle(this.createObstacle(startX, startUnits));
  }

  // Each level has its own good habits, setbacks and ground hazards
  private createObstacle(startX: number, startUnits: number) {
    const { pickups, setbacks, roadIcons } = course.level;
    if (Math.random() < PICKUP_CHANCE) {
      return new TextObstacle(pickRandom(pickups), "pickup", startX);
    }
    // The slowest the runner could be when it gets there: walking that hill
    const slowest = getWorldSpeed("walk") *
      getHillSpeedFactor(course.getGrade(startUnits));
    const isSlow = slowest < MIN_SPEED_FOR_TEXT_SETBACKS;
    if (isSlow || Math.random() < ROAD_ICON_CHANCE) {
      return new RoadObstracle(pickRandom(roadIcons), startX);
    }
    return new TextObstacle(pickRandom(setbacks), "hazard", startX);
  }
}
