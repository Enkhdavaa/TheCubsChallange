import * as THREE from "three";
import { mainCharacter } from "../characters/main/mainCharacter.ts";
import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { helvetiker_regular_font } from "../helper/text3dFonts.ts";
import { getAspectRatio } from "../size.ts";
import { TextObstacle } from "./textObstacle.ts";
import { RoadObstracle } from "./roadObstracle.ts";
import { IObstacle } from "./interfaces.ts";
import { isOffScreenCached } from "../camera.ts";

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

const GOOD_OBSTACLE_SCALE = 0.2;
const BAD_OBSTACLE_SCALE = 0.2;
const ROAD_OBSTACLE_SCALE = 0.4;
const OFFSCREEN_THRESHOLD = -3;

function createObstacle(obstacleText: string) {
  if (isGoodObstacle(obstacleText)) {
    return new TextObstacle(
      obstacleText,
      GOOD_OBSTACLE_SCALE,
      helvetiker_regular_font,
      goodMaterial
    );
  } else if (randomTexts["bad"].includes(obstacleText)) {
    return new TextObstacle(
      obstacleText,
      BAD_OBSTACLE_SCALE,
      helvetiker_regular_font,
      badMaterial
    );
  } else if (randomTexts["roadObstacles"].includes(obstacleText)) {
    return new RoadObstracle(
      obstacleText,
      `sprites/obstacle/${obstacleText}.png`,
      ROAD_OBSTACLE_SCALE
    );
  }
  return null;
}

function spawnObstacle() {
  const combined = [
    ...randomTexts["good"],
    ...randomTexts["bad"],
    ...randomTexts["roadObstacles"],
  ];
  const index = Math.floor(Math.random() * combined.length);
  const obstacleText = combined[index];
  const obstacle = createObstacle(obstacleText);

  if (obstacle) {
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
  const playerBoundingBox = mainCharacter.getBoundingBox();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    const obstacleBoundingBox = obstacle.getBoundingBox();

    if (obstacleBoundingBox.intersectsBox(playerBoundingBox)) {
      handleCollision(obstacle);
      obstacles.splice(i, 1);
      continue;
    }

    const position = obstacle.getPosition();
    const boundingBox = obstacle.getBoundingBox();

    if (isOffScreenCached(boundingBox)) {
      removeObstacle(obstacle);
      obstacles.splice(i, 1);
    } else {
      const movementSpeed = calculateSpeed();
      obstacle.setPosition(position.x - movementSpeed, position.y);
    }
  }
}

function handleCollision(obstacle: IObstacle) {
  if (isGoodObstacle(obstacle.name)) {
    mainCharacter.increaseSpeed();
  } else {
    mainCharacter.decreaseSpeed();
  }
  removeObstacle(obstacle);
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
