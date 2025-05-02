import { MainCharacterStart } from "./characters/main/characterControl.ts";
import { LoadBackground } from "./background/background.ts";
import { RenderScreenText } from "./decoration/screenText.ts";
import { spawnDistanceBar } from "./characters/main/distanceBar.ts";
import { ObstacleManager } from "./obstacles/obstracleManager.ts";
import { Spawner } from "./obstacles/spawner.ts";
import { addFrameCallback } from "./helper/frameCallback.ts";

MainCharacterStart();
LoadBackground();
RenderScreenText();
spawnDistanceBar();

const obstracleManager = new ObstacleManager();
const spawner = new Spawner(obstracleManager);

addFrameCallback(() => {
  obstracleManager.updateObstacles();
  spawner.update();
});
