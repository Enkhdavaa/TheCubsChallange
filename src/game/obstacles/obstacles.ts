import { GetBoudingBox } from "../characters/main/mainCharacter.ts";
import { addFrameCallback, getDeltaTime } from "../helper/frameCallback.ts";
import { normalizedToCanvasX } from "../helper/helper.ts";
import { glitch_regular_font } from "../helper/text3dFonts.ts";
import { getAspectRatio } from "../size.ts";
import { TextObstacle } from "./textObstacle.ts";

// Obstacle list
const obstacles: TextObstacle[] = [];
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

// Spawn obstacle
function spawnObstacle() {
  const combined = randomTexts["good"].concat(randomTexts["bad"]);
  const index = Math.floor(Math.random() * combined.length);
  const obstacleText = combined[index];

  if (isGoodObstacle(obstacleText)) {
    setRandomPosition(new TextObstacle(obstacleText, 0.2));
  } else {
    setRandomPosition(new TextObstacle(obstacleText, 0.2, glitch_regular_font));
  }
}

function setRandomPosition(obstacleMesh: TextObstacle) {
  obstacleMesh.setPosition(xAxisMax + 0.2, Math.random() * aspectRatio);
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
      addEffect(obstacles[i]);
    }
  }
}

function addEffect(obstacle: TextObstacle) {
  const obstacleText = obstacle.getText();
  const movementSpeed = 1.5 * getDeltaTime() * aspectRatio;
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
