import * as THREE from "three";
import scene from "../scene.ts";
import { addFrameCallback } from "../helper/frameCallback.ts";

// Obstacle list
const obstacles: any = [];
const obstacleSpeed = 0.05;
const spawnInterval = 2500; // milliseconds

// Spawn obstacle
function spawnObstacle() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const obstacle = new THREE.Mesh(geometry, material);

  // Random Y position and fixed X offscreen to the right
  obstacle.position.set(2, Math.random() * 3 - 1.5, 0);
  scene.add(obstacle);
  obstacles.push(obstacle);
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
    if (obstacles[i].position.x < -4) {
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
