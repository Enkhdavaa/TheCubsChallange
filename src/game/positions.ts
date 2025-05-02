import { getScreenAnchor } from "./helper/helper.ts";

const introTextPosition = { x: 0.5, y: 0.9 };
const characterPosition = { x: 0.1, y: 0.1 };
const textObstaclePosition = { x: 0.5, y: 0 };
const roadObsraclePosition = { x: 0.5, y: 0 };

export const getIntroTextPosition = () => {
  const anchorPosition = getScreenAnchor(
    introTextPosition.x,
    introTextPosition.y
  );
  return anchorPosition;
};

export const getCharacterPosition = () => {
  const anchorPosition = getScreenAnchor(
    characterPosition.x,
    characterPosition.y
  );
  return anchorPosition;
};

export const getTextObstaclePosition = () => {
  const anchorPosition = getScreenAnchor(
    textObstaclePosition.x,
    textObstaclePosition.y
  );
  return anchorPosition;
};

export const getRoadObstaclePosition = () => {
  const anchorPosition = getScreenAnchor(
    roadObsraclePosition.x,
    roadObsraclePosition.y
  );
  return anchorPosition;
};
