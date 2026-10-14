import { getElapsedTime } from "./helper/frameCallback.ts";
import { SETTINGS } from "./settings.ts";

export type RunPhase = "ready" | "running" | "finished";
type PhaseListener = (phase: RunPhase) => void;

const goalUnits = (SETTINGS.RUN_GOAL_KM * 1000) / SETTINGS.METERS_PER_UNIT;
// Seconds after finishing before a tap restarts, so a late jump doesn't
const restartDelay = 1;

class RunState {
  public phase: RunPhase = "ready";
  public pickups = 0;
  public hits = 0;

  // World units covered
  private distance = 0;
  private finishedAt = 0;
  private listeners: PhaseListener[] = [];

  public start() {
    this.distance = 0;
    this.pickups = 0;
    this.hits = 0;
    this.setPhase("running");
  }

  public advance(units: number) {
    if (this.phase !== "running") {
      return;
    }

    this.distance = Math.min(goalUnits, this.distance + units);
    if (this.distance >= goalUnits) {
      this.finishedAt = getElapsedTime();
      this.setPhase("finished");
    }
  }

  public canRestart() {
    return (
      this.phase === "finished" &&
      getElapsedTime() - this.finishedAt >= restartDelay
    );
  }

  public recordPickup() {
    this.pickups++;
  }

  public recordHit() {
    this.hits++;
  }

  public getDistanceKm() {
    return (this.distance * SETTINGS.METERS_PER_UNIT) / 1000;
  }

  // 0 at the start, 1 at the finish line
  public getProgress() {
    return this.distance / goalUnits;
  }

  public getRemainingUnits() {
    return goalUnits - this.distance;
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
