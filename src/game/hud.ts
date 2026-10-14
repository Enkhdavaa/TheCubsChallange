import { mainCharacter } from "./characters/main/mainCharacter.ts";
import { RunPhase, runState } from "./runState.ts";
import { SETTINGS } from "./settings.ts";

const byId = (id: string) => document.getElementById(id)!;

// Distance, speed and the start/finish screens, drawn as HTML over the canvas
export class Hud {
  private hud = byId("hud");
  private distanceText = byId("hud-distance-text");
  private distanceFill = byId("hud-distance-fill");
  private speed = byId("hud-speed");
  private startScreen = byId("start-screen");
  private finishScreen = byId("finish-screen");
  private finishStats = byId("finish-stats");

  private pips: HTMLElement[] = [];
  private shownDistance = "";
  private shownSpeedLevel = 0;

  constructor() {
    document.querySelectorAll("[data-goal-km]").forEach((element) => {
      element.textContent = String(SETTINGS.RUN_GOAL_KM);
    });

    const pipContainer = byId("hud-speed-pips");
    for (let i = 0; i < mainCharacter.getMaxSpeedLevel(); i++) {
      const pip = document.createElement("span");
      pip.className = "hud-pip";
      pipContainer.appendChild(pip);
      this.pips.push(pip);
    }
  }

  public showPhase(phase: RunPhase) {
    this.startScreen.classList.toggle("is-visible", phase === "ready");
    this.finishScreen.classList.toggle("is-visible", phase === "finished");
    this.hud.classList.toggle("is-visible", phase === "running");

    if (phase === "finished") {
      this.finishStats.textContent =
        `Good habits grabbed: ${runState.pickups} · Setbacks hit: ${runState.hits}`;
    }
  }

  public update() {
    const distance = runState.getDistanceKm().toFixed(1);
    if (distance !== this.shownDistance) {
      this.shownDistance = distance;
      this.distanceText.textContent = distance;
    }
    this.distanceFill.style.transform = `scaleX(${runState.getProgress()})`;

    const level = mainCharacter.getSpeedLevel();
    if (level !== this.shownSpeedLevel) {
      // Only pickups and hits flash; starting and stopping don't
      if (this.shownSpeedLevel > 0 && level > 0) {
        this.flashSpeed(level > this.shownSpeedLevel ? "is-up" : "is-down");
      }
      this.pips.forEach((pip, index) => {
        pip.classList.toggle("is-on", index < level);
      });
      this.shownSpeedLevel = level;
    }
  }

  private flashSpeed(className: string) {
    this.speed.classList.remove("is-up", "is-down");
    // Reading layout restarts the CSS animation
    void this.speed.offsetWidth;
    this.speed.classList.add(className);
  }
}
