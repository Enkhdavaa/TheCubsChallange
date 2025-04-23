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

// Obstacle list
const beer = new Obstracle("beer", "sprites/obstacle/beer.png");

const obstacles: IObstacle[] = [];
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

obstacles.push(beer);
// Spawn obstacle
function spawnObstacle() {
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
    setRandomPosition(textObstacle);
  } else {
    const textObstacle = new TextObstacle(
      obstacleText,
      0.2,
      helvetiker_regular_font,
      badMaterial
    );
    setRandomPosition(textObstacle);
  }
}

function setRandomPosition(obstacleMesh: IObstacle) {
  obstacleMesh.setPosition(xAxisMax + 0.2, Math.random() * aspectRatio);
  obstacles.push(obstacleMesh);
}

// Remove obstacle from scene and array
function removeObstacle(obstacle: IObstacle) {
  console.log("removing obstacle");
  obstacle.dispose();
}

// Set interval
setInterval(() => {
  spawnObstacle();
}, spawnInterval);

// Update obstacles position
function updateObstacles() {
  const playerBoudingBox = getBoudingBox();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    // Check if obstacle is colliding with the player
    const obstacleBoudingBox = obstacles[i].getBoundingBox();

    if (obstacleBoudingBox.intersectsBox(playerBoudingBox)) {
      console.log("Collision detected");
      if (isGoodObstacle(obstacles[i].name)) {
        console.log("Good obstacle hit");
        increaseSpeed();
      } else {
        console.log("Bad obstacle hit");
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
      addEffect(obstacles[i]);
    }
  }
}

function addEffect(obstacle: IObstacle) {
  const obstacleText = obstacle.name;
  const movementSpeed = 3 * getDeltaTime() * aspectRatio;
  const shake = 0.04;
  const position = obstacle.getPosition();
  const randomShake = (Math.random() - 0.5) * shake;

  if (isGoodObstacle(obstacleText)) {
    obstacle.setPosition(position.x - movementSpeed, position.y);
  } else {
    obstacle.setPosition(
      position.x - movementSpeed + randomShake,
      position.y + randomShake
    );
  }
}

function isGoodObstacle(obstacleText: string) {
  return randomTexts["good"].includes(obstacleText);
}

export const LoadObstacles = () => {
  addFrameCallback(() => {
    updateObstacles();
  });
};
