import scene from "../scene.ts";
import { addFrameCallback } from "../helper/frameCallback.ts";
import Add3DTextMesh from "./add3dTextMesh.ts";
import { normalizedToCanvasX } from "../helper/helper.ts";

// Obstacle list
const obstacles: any = [];
const obstacleSpeed = 0.05;
const spawnInterval = 2500; // milliseconds

const randomTexts = ["Turbo Tuesday", "Long Run", "Social Run", "Regular Run"];
const xAxisMax = normalizedToCanvasX(1);
const xAxisMin = normalizedToCanvasX(-1);

// Spawn obstacle
function spawnObstacle() {
  const index = Math.floor(Math.random() * randomTexts.length);
  const obstacleMesh = Add3DTextMesh(randomTexts[index], 0.2);

  obstacleMesh.position.set(xAxisMax + 0.2, Math.random(), 0);
  scene.add(obstacleMesh);
  obstacles.push(obstacleMesh);
}

// Remove obstacle from scene and array
function removeObstacle(obstacle: any) {
  console.log("removing obstacle");
  scene.remove(obstacle);
  obstacle.geometry.dispose();
  obstacle.material.dispose();
}

// Set interval
setInterval(() => {
  spawnObstacle();
}, spawnInterval);

// Update obstacles position
function updateObstacles() {
  // Move obstacles and remove them if they're off screen
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].position.x -= obstacleSpeed;

    // Offscreen to the left of the camera view
    if (obstacles[i].position.x < xAxisMin - 0.5) {
      removeObstacle(obstacles[i]);
      obstacles.splice(i, 1);
    }
  }
}

export const LoadObstacles = () => {
  addFrameCallback(() => {
    updateObstacles();
  });
};
