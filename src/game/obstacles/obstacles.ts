import * as THREE from "three";
import {
  increaseSpeed,
  decreaseSpeed,
} from "../characters/main/characterSpeed.ts";
import { getBoudingBox } from "../characters/main/mainCharacter.ts";
import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { normalizedToCanvasX } from "../helper/helper.ts";
import { helvetiker_regular_font } from "../helper/text3dFonts.ts";
import { getAspectRatio } from "../size.ts";
import { TextObstacle } from "./textObstacle.ts";
import { Obstracle } from "./obstracle.ts";
import { IObstacle } from "./disposable.ts";

const obstacles: IObstacle[] = [];
const roadObstacles: IObstacle[] = [];
const spawnInterval = 2500; // milliseconds

const randomTexts = {
  good: ["Turbo Tuesday", "Long Run", "Social Run", "Regular Run"],
  bad: [
    "Bad Weather",
    "Alcohol",
    "Injury",
    "No Run",
    "No Food",
    "No Water",
    "No Sleep",
  ],
};

const xAxisMax = normalizedToCanvasX(1);
const xAxisMin = normalizedToCanvasX(-1);
const aspectRatio = getAspectRatio();

const goodMaterial = new THREE.MeshBasicMaterial({
  color: 0x42f360,
});

const badMaterial = new THREE.MeshBasicMaterial({
  color: 0xee7257,
});

// Spawn obstacle
function spawnRoadObstacle() {
  const obstacleList = ["beer", "banana", "puddle"];
  const randomIndex = Math.floor(Math.random() * obstacleList.length);
  const obstacleName = obstacleList[randomIndex];
  const obstacle = new Obstracle(
    obstacleName,
    `sprites/obstacle/${obstacleName}.png`,
    0.4
  );
  obstacle.setPosition(xAxisMax + 0.2, -0.15 * aspectRatio);
  roadObstacles.push(obstacle);
}

function spawnTextObstacle() {
  const combined = randomTexts["good"].concat(randomTexts["bad"]);
  const index = Math.floor(Math.random() * combined.length);
  const obstacleText = combined[index];

  if (isGoodObstacle(obstacleText)) {
    const textObstacle = new TextObstacle(
      obstacleText,
      0.2,
      helvetiker_regular_font,
      goodMaterial
    );
    setTextObstraclePosition(textObstacle);
  } else {
    const textObstacle = new TextObstacle(
      obstacleText,
      0.2,
      helvetiker_regular_font,
      badMaterial
    );
    setTextObstraclePosition(textObstacle);
  }
}

function setTextObstraclePosition(obstacleMesh: IObstacle) {
  obstacleMesh.setPosition(xAxisMax + 0.2, 0.65 * aspectRatio);
  obstacles.push(obstacleMesh);
}

// Remove obstacle from scene and array
function removeObstacle(obstacle: IObstacle) {
  console.log("removing obstacle");
  obstacle.dispose();
}

// Set interval
setInterval(() => {
  spawnTextObstacle();
  spawnRoadObstacle();
}, spawnInterval);

// Update obstacles position
function updateTextObstacles() {
  const playerBoudingBox = getBoudingBox();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    // Check if obstacle is colliding with the player
    const obstacleBoudingBox = obstacles[i].getBoundingBox();

    if (obstacleBoudingBox.intersectsBox(playerBoudingBox)) {
      if (isGoodObstacle(obstacles[i].name)) {
        increaseSpeed();
      } else {
        decreaseSpeed();
      }
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
      const movementSpeed = calculateSpeed();
      obstacles[i].setPosition(position.x - movementSpeed, position.y);
    }
  }
}

function updateRoadObstacles() {
  const playerBoudingBox = getBoudingBox();

  for (let i = roadObstacles.length - 1; i >= 0; i--) {
    // Check if obstacle is colliding with the player
    const obstacleBoudingBox = roadObstacles[i].getBoundingBox();

    if (obstacleBoudingBox.intersectsBox(playerBoudingBox)) {
      decreaseSpeed();
      removeObstacle(roadObstacles[i]);
      roadObstacles.splice(i, 1);
      continue;
    }

    const position = roadObstacles[i].getPosition();

    // Offscreen to the left of the camera view
    if (position.x < xAxisMin - 0.5) {
      removeObstacle(roadObstacles[i]);
      roadObstacles.splice(i, 1);
    } else {
      const movementSpeed = calculateSpeed();
      roadObstacles[i].setPosition(position.x - movementSpeed, position.y);
    }
  }
}

function calculateSpeed() {
  return 3 * getDeltaTime() * aspectRatio;
}

function isGoodObstacle(obstacleText: string) {
  return randomTexts["good"].includes(obstacleText);
}

export const LoadObstacles = () => {
  addFrameCallback(() => {
    updateTextObstacles();
    updateRoadObstacles();
  });
};
