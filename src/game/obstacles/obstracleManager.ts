import { isOffScreen } from "../camera.ts";
import { mainCharacter } from "../characters/main/mainCharacter.ts";
import { getDeltaTime } from "../helper/frameCallback.ts";
import { IObstacle } from "./interfaces.ts";
import { getWindowAspectRatio } from "../size.ts";
import { randomTexts } from "./text.ts";

export class ObstacleManager {
  private obstacles: IObstacle[] = [];
  private aspectRatio = getWindowAspectRatio();

  constructor() {}

  public addObstacle(obstacle: IObstacle) {
    this.obstacles.push(obstacle);
  }

  public updateObstacles() {
    const playerBoundingBox = mainCharacter.getBoundingBox();

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      const obstacleBoundingBox = obstacle.getBoundingBox();

      if (obstacleBoundingBox.intersectsBox(playerBoundingBox)) {
        if (this.isGoodObstacle(obstacle.name)) {
          mainCharacter.increaseSpeed();
        } else {
          mainCharacter.decreaseSpeed();
        }
        this.removeObstacle(obstacle);
        continue;
      }

      const boundingBox = obstacle.getBoundingBox();

      if (isOffScreen(boundingBox)) {
        this.removeObstacle(obstacle);
        continue;
      }

      const position = obstacle.getPosition();
      const movementSpeed = this.calculateSpeed();
      obstacle.setPosition(position.x - movementSpeed, position.y);
    }
  }

  private calculateSpeed() {
    return 3 * getDeltaTime() * this.aspectRatio;
  }

  private removeObstacle(obstacle: IObstacle) {
    const index = this.obstacles.indexOf(obstacle);
    if (index > -1) {
      this.obstacles.splice(index, 1);
      obstacle.dispose();
      console.log("removing obstacle");
    }
  }

  private isGoodObstacle(obstacleText: string) {
    return randomTexts["good"].includes(obstacleText);
  }
}
