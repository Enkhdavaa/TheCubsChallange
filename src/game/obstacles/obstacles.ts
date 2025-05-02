import * as THREE from "three";
import {
  increaseSpeed,
  decreaseSpeed,
} from "../characters/main/characterSpeed.ts";
import { getBoudingBox } from "../characters/main/mainCharacter.ts";
import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { helvetiker_regular_font } from "../helper/text3dFonts.ts";
import { getAspectRatio } from "../size.ts";
import { TextObstacle } from "./textObstacle.ts";
import { RoadObstracle } from "./roadObstracle.ts";
import { IObstacle } from "./disposable.ts";

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
  roadObstacles: ["beer", "banana", "puddle"],
};

const aspectRatio = getAspectRatio();

const goodMaterial = new THREE.MeshBasicMaterial({
  color: 0x42f360,
});

const badMaterial = new THREE.MeshBasicMaterial({
  color: 0xee7257,
});

function spawnObstacle() {
  const combined = randomTexts["good"]
    .concat(randomTexts["bad"])
    .concat(randomTexts["roadObstacles"]);
  const index = Math.floor(Math.random() * combined.length);
  const obstacleText = combined[index];

  if (isGoodObstacle(obstacleText)) {
    const textObstacle = new TextObstacle(
      obstacleText,
      0.2,
      helvetiker_regular_font,
      goodMaterial
    );
    obstacles.push(textObstacle);
  } else if (randomTexts["bad"].includes(obstacleText)) {
    const textObstacle = new TextObstacle(
      obstacleText,
      0.2,
      helvetiker_regular_font,
      badMaterial
    );
    obstacles.push(textObstacle);
  } else if (randomTexts["roadObstacles"].includes(obstacleText)) {
    const obstacle = new RoadObstracle(
      obstacleText,
      `sprites/obstacle/${obstacleText}.png`,
      0.4
    );
    obstacles.push(obstacle);
  }
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
    if (position.x < -0.5) {
      removeObstacle(obstacles[i]);
      obstacles.splice(i, 1);
    } else {
      const movementSpeed = calculateSpeed();
      obstacles[i].setPosition(position.x - movementSpeed, position.y);
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
    updateObstacles();
  });
};
