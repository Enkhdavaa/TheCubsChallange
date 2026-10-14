import { getElapsedTime } from "./helper/frameCallback.ts";
import { course } from "./course.ts";
import { getSelectedLevel } from "./levels.ts";
import { SETTINGS } from "./settings.ts";

export type RunPhase = "ready" | "running" | "finished";
type PhaseListener = (phase: RunPhase) => void;

// Seconds after finishing before a tap continues, so a late jump doesn't
const continueDelay = 1;

class RunState {
  public phase: RunPhase = "ready";
  public pickups = 0;
  public hits = 0;

  // World units covered and seconds of play while running
  private distance = 0;
  private elapsed = 0;
  private finishedAt = 0;
  private listeners: PhaseListener[] = [];

  // Runs the level picked on the start screen
  public start() {
    course.build(getSelectedLevel());
    this.distance = 0;
    this.elapsed = 0;
    this.pickups = 0;
    this.hits = 0;
    this.setPhase("running");
  }

  // Back to the start screen to pick the next run
  public showMenu() {
    this.setPhase("ready");
  }

  // stopUnits keeps the runner from passing a red light
  public update(deltaTime: number, worldSpeed: number, stopUnits = Infinity) {
    if (this.phase !== "running") {
      return;
    }

    this.elapsed += deltaTime;
    const remaining = course.goalUnits - this.distance;
    const units = Math.min(
      worldSpeed * deltaTime,
      Math.max(0, stopUnits - this.distance),
    );

    if (units < remaining) {
      this.distance += units;
      return;
    }

    // Count only the part of this frame before the finish line
    this.distance = course.goalUnits;
    this.elapsed -= units > 0 ? deltaTime * (1 - remaining / units) : 0;
    this.finishedAt = getElapsedTime();
    this.setPhase("finished");
  }

  public canContinue() {
    return (
      this.phase === "finished" &&
      getElapsedTime() - this.finishedAt >= continueDelay
    );
  }

  public recordPickup() {
    this.pickups++;
  }

  public recordHit() {
    this.hits++;
  }

  public getDistanceUnits() {
    return this.distance;
  }

  public getDistanceKm() {
    return (this.distance * course.metersPerUnit) / 1000;
  }

  // Seconds of play, waiting at lights included
  public getElapsed() {
    return this.elapsed;
  }

  // The time a real runner would have taken
  public getRaceSeconds() {
    return this.elapsed * SETTINGS.TIME_SCALE * course.level.timeScale;
  }

  // 0 at the start, 1 at the finish line
  public getProgress() {
    return this.distance / course.goalUnits;
  }

  public getRemainingUnits() {
    return course.goalUnits - this.distance;
  }

  public onPhaseChange(listener: PhaseListener) {
    this.listeners.push(listener);
  }

  private setPhase(phase: RunPhase) {
    this.phase = phase;
    this.listeners.forEach((listener) => listener(phase));
  }
}

export const runState = new RunState();
