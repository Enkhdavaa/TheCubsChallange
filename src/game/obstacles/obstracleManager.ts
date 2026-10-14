import { isPastLeftEdge } from "../camera.ts";
import { mainCharacter } from "../characters/main/mainCharacter.ts";
import { getDeltaTime } from "../helper/frameCallback.ts";
import { runState } from "../runState.ts";
import { IObstacle } from "./interfaces.ts";

export class ObstacleManager {
  private obstacles: IObstacle[] = [];

  constructor() {}

  public addObstacle(obstacle: IObstacle) {
    this.obstacles.push(obstacle);
  }

  public updateObstacles() {
    const playerBoundingBox = mainCharacter.getBoundingBox();
    // Obstacles lie on the ground, so they move exactly as fast as it does
    const movement = mainCharacter.getWorldSpeed() * getDeltaTime();

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      const obstacleBoundingBox = obstacle.getBoundingBox();

      if (
        runState.phase === "running" &&
        obstacleBoundingBox.intersectsBox(playerBoundingBox)
      ) {
        if (obstacle.kind === "pickup") {
          mainCharacter.increaseSpeed();
          runState.recordPickup();
        } else {
          mainCharacter.decreaseSpeed();
          runState.recordHit();
        }
        this.removeObstacle(obstacle);
        continue;
      }

      if (isPastLeftEdge(obstacleBoundingBox)) {
        this.removeObstacle(obstacle);
        continue;
      }

      const position = obstacle.getPosition();
      obstacle.setPosition(position.x - movement, position.y);
    }
  }

  public clear() {
    this.obstacles.forEach((obstacle) => obstacle.dispose());
    this.obstacles = [];
  }

  private removeObstacle(obstacle: IObstacle) {
    const index = this.obstacles.indexOf(obstacle);
    if (index > -1) {
      this.obstacles.splice(index, 1);
      obstacle.dispose();
    }
  }
}
