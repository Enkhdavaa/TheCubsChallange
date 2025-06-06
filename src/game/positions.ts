import { orthographicCamera } from "./camera.ts";
import { getScreenAnchor } from "./helper/helper.ts";

const introTextPosition = { x: 0.5, y: 0.9 };
const characterPosition = { x: 0.05, y: 0.4 };
const textObstaclePosition = { x: 1, y: 0.55 };
const roadObsraclePosition = { x: 1, y: 0.35 };

export const getIntroTextPosition = () => {
  const anchorPosition = getScreenAnchor(
    introTextPosition.x,
    introTextPosition.y,
    orthographicCamera
  );
  return anchorPosition;
};

export const getCharacterPosition = () => {
  const anchorPosition = getScreenAnchor(
    characterPosition.x,
    characterPosition.y,
    orthographicCamera
  );
  return anchorPosition;
};

export const getTextObstaclePosition = () => {
  const anchorPosition = getScreenAnchor(
    textObstaclePosition.x,
    textObstaclePosition.y,
    orthographicCamera
  );
  return anchorPosition;
};

export const getRoadObstaclePosition = () => {
  const anchorPosition = getScreenAnchor(
    roadObsraclePosition.x,
    roadObsraclePosition.y,
    orthographicCamera
  );
  return anchorPosition;
};
