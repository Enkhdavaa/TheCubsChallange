import { IObstacle } from "./obstacles/disposable.ts";

class Interaction {
  private obstacles: IObstacle[] = [];

  constructor() {}

  addObstacle(obstacle: IObstacle) {
    this.obstacles.push(obstacle);
  }

  updateObstacles() {
    this.obstacles.forEach((obstacle) => {
      const position = obstacle.getPosition();
      const boundingBox = obstacle.getBoundingBox();
      boundingBox.setFromObject(obstacle.getBoundingBox());
    });
  }

  removeObstacle(obstacle: IObstacle) {
    const index = this.obstacles.indexOf(obstacle);
    if (index > -1) {
      this.obstacles.splice(index, 1);
      obstacle.dispose();
    }
  }
}
