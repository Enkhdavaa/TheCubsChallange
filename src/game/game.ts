import { MainCharacterStart } from "./characters/main/characterControl.ts";
import { mainCharacter } from "./characters/main/mainCharacter.ts";
import { LoadBackground } from "./background/background.ts";
import { FinishLine } from "./decoration/finishLine.ts";
import { ObstacleManager } from "./obstacles/obstracleManager.ts";
import { Spawner } from "./obstacles/spawner.ts";
import { addFrameCallback, getDeltaTime } from "./helper/frameCallback.ts";
import { runState } from "./runState.ts";
import { effort } from "./effort.ts";
import { currentLevel } from "./levels.ts";
import { recordFinish } from "./personalBest.ts";
import { Hud } from "./hud.ts";

MainCharacterStart();
LoadBackground();

const hud = new Hud();
const finishLine = new FinishLine();
const obstracleManager = new ObstacleManager();
const spawner = new Spawner(obstracleManager);

effort.onChange(() => mainCharacter.setPace(effort.zone));

runState.onPhaseChange((phase) => {
  if (phase === "running") {
    obstracleManager.clear();
    spawner.reset();
    effort.reset();
    mainCharacter.start(effort.zone);
  } else if (phase === "finished") {
    obstracleManager.clear();
    mainCharacter.stop();
    hud.showResult(
      recordFinish(currentLevel.id, Math.round(runState.getRaceSeconds())),
    );
  }
  hud.showPhase(phase);
});
hud.showPhase(runState.phase);

addFrameCallback(() => {
  const deltaTime = getDeltaTime();
  if (runState.phase === "running") {
    effort.update(deltaTime);
  }
  runState.update(deltaTime, mainCharacter.getWorldSpeed());
  obstracleManager.updateObstacles();
  spawner.update();
  finishLine.update();
  hud.update();
});
