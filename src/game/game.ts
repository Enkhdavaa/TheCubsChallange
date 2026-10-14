import { MainCharacterStart } from "./characters/main/characterControl.ts";
import { mainCharacter } from "./characters/main/mainCharacter.ts";
import { LoadBackground, showScenery } from "./background/background.ts";
import { FinishLine } from "./decoration/finishLine.ts";
import { HillSigns, TrafficLights } from "./decoration/courseMarkers.ts";
import { ObstacleManager } from "./obstacles/obstracleManager.ts";
import { Spawner } from "./obstacles/spawner.ts";
import { addFrameCallback, getDeltaTime } from "./helper/frameCallback.ts";
import { course, getHillEnergy, getHillSpeedFactor, Stretch } from "./course.ts";
import { runState } from "./runState.ts";
import { effort } from "./effort.ts";
import { getSelectedLevel, onLevelChange } from "./levels.ts";
import { recordFinish } from "./personalBest.ts";
import { Hud } from "./hud.ts";

MainCharacterStart();
LoadBackground(getSelectedLevel().scenery);

const hud = new Hud();
const finishLine = new FinishLine();
const trafficLights = new TrafficLights();
const hillSigns = new HillSigns();

// Each item's tip shows once per run, the first time it comes up
const tipsShown = new Set<string>();
const obstracleManager = new ObstacleManager((obstacle) => {
  if (!tipsShown.has(obstacle.name)) {
    tipsShown.add(obstacle.name);
    hud.showTip(obstacle.name, obstacle.kind);
  }
});
const spawner = new Spawner(obstracleManager);

effort.onChange(() => mainCharacter.setPace(effort.zone));

// The start screen previews the scenery of the run being picked
onLevelChange((level) => {
  showScenery(level.scenery);
  hud.showLevel(level);
});

let wasWaiting = false;
let currentStretch: Stretch | null = null;

runState.onPhaseChange((phase) => {
  if (phase === "running") {
    obstracleManager.clear();
    spawner.reset();
    trafficLights.reset();
    hillSigns.reset();
    tipsShown.clear();
    wasWaiting = false;
    currentStretch = null;
    effort.reset();
    mainCharacter.start(effort.zone);
    hud.startRun();
  } else if (phase === "finished") {
    obstracleManager.clear();
    mainCharacter.stop();
    hud.showResult(
      recordFinish(course.level.id, Math.round(runState.getRaceSeconds())),
    );
  }
  hud.showPhase(phase);
});
hud.showPhase(runState.phase);

// Red lights, hills and energy for this frame of the run
function updateCourse(deltaTime: number) {
  const distance = runState.getDistanceUnits();

  const stopUnits = trafficLights.getStopUnits();
  const isWaiting = distance >= stopUnits - 0.001;
  mainCharacter.setWaiting(isWaiting);
  if (isWaiting !== wasWaiting) {
    wasWaiting = isWaiting;
    hud.say(isWaiting ? "Red light: catching my breath" : "Green! Off we go");
  }

  const stretch = course.getStretch(distance);
  const grade = stretch?.grade ?? 0;
  mainCharacter.setHillFactor(getHillSpeedFactor(grade));
  if (stretch !== currentStretch) {
    currentStretch = stretch;
    if (grade >= 0.03) {
      hud.say("Uphill: same effort, slower pace");
    } else if (grade <= -0.03) {
      hud.say("Downhill: short, quick steps");
    }
  }

  effort.update(deltaTime, isWaiting, getHillEnergy(grade));
  runState.update(deltaTime, mainCharacter.getWorldSpeed(), stopUnits);
}

addFrameCallback(() => {
  if (runState.phase === "running") {
    updateCourse(getDeltaTime());
  }
  obstracleManager.updateObstacles();
  spawner.update();
  trafficLights.update();
  hillSigns.update();
  finishLine.update();
  hud.update();
});
