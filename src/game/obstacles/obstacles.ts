import { GetBoudingBox } from "../characters/main/mainCharacter.ts";
import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { normalizedToCanvasX } from "../helper/helper.ts";
import { TextObstacle } from "./textObstacle.ts";

// Obstacle list
const obstacles: TextObstacle[] = [];
const spawnInterval = 2500; // milliseconds

const randomTexts = ["Turbo Tuesday", "Long Run", "Social Run", "Regular Run"];
const xAxisMax = normalizedToCanvasX(1);
const xAxisMin = normalizedToCanvasX(-1);

// Spawn obstacle
function spawnObstacle() {
  const index = Math.floor(Math.random() * randomTexts.length);
  const obstacleMesh = new TextObstacle(randomTexts[index], 0.2);

  obstacleMesh.setPosition(xAxisMax + 0.2, Math.random());
  obstacles.push(obstacleMesh);
}

// Remove obstacle from scene and array
function removeObstacle(obstacle: TextObstacle) {
  console.log("removing obstacle");
  obstacle.dispose();
}

// Set interval
setInterval(() => {
  spawnObstacle();
}, spawnInterval);

// Update obstacles position
function updateObstacles() {
  const movementSpeed = 1.5 * getDeltaTime();
  const playerBoudingBox = GetBoudingBox();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    // Check if obstacle is colliding with the player
    const obstacleBoudingBox = obstacles[i].getBoundingBox();

    if (obstacleBoudingBox.intersectsBox(playerBoudingBox)) {
      console.log("Collision detected");
      removeObstacle(obstacles[i]);
      obstacles.splice(i, 1);
      continue;
    }

    const position = obstacles[i].getPosition();

    // Offscreen to the left of the camera view
    if (position.x < xAxisMin - 0.5) {
      removeObstacle(obstacles[i]);
      obstacles.splice(i, 1);
    } else {
      obstacles[i].setPosition(position.x - movementSpeed, position.y);
    }
  }
}

export const LoadObstacles = () => {
  addFrameCallback(() => {
    updateObstacles();
  });
};
