import { PACE_ZONE_ORDER, PACE_ZONES, PaceZone } from "./pace.ts";

const maxEnergy = 100;
// After running out, the runner walks until energy is back to this
const recoveredEnergy = 50;

export type EffortEvent = "zone" | "exhausted" | "recovered" | "boost" | "drain";
type EffortListener = (event: EffortEvent) => void;

function emptyZoneSeconds(): Record<PaceZone, number> {
  return { walk: 0, easy: 0, steady: 0, fast: 0 };
}

// The pace the runner picked and the energy it costs
class Effort {
  public zone: PaceZone = "easy";
  public energy = maxEnergy;
  public isExhausted = false;
  public exhaustions = 0;
  // Seconds of play spent at each pace this run
  public zoneSeconds = emptyZoneSeconds();

  private listeners: EffortListener[] = [];

  public reset() {
    this.zone = "easy";
    this.energy = maxEnergy;
    this.isExhausted = false;
    this.exhaustions = 0;
    this.zoneSeconds = emptyZoneSeconds();
    this.notify("zone");
  }

  public selectZone(zone: PaceZone) {
    // Out of breath means walking until recovered
    if (this.isExhausted || zone === this.zone) {
      return;
    }
    this.zone = zone;
    this.notify("zone");
  }

  // +1 is one pace faster, -1 one pace slower
  public shiftZone(steps: number) {
    const index = PACE_ZONE_ORDER.indexOf(this.zone) + steps;
    const clamped = Math.max(0, Math.min(PACE_ZONE_ORDER.length - 1, index));
    this.selectZone(PACE_ZONE_ORDER[clamped]);
  }

  public update(deltaTime: number) {
    this.zoneSeconds[this.zone] += deltaTime;
    this.setEnergy(
      this.energy + PACE_ZONES[this.zone].energyPerSecond * deltaTime,
    );
  }

  public gainEnergy(amount: number) {
    this.notify("boost");
    this.setEnergy(this.energy + amount);
  }

  public loseEnergy(amount: number) {
    this.notify("drain");
    this.setEnergy(this.energy - amount);
  }

  // 0 when empty, 1 when full
  public getEnergyShare() {
    return this.energy / maxEnergy;
  }

  public onChange(listener: EffortListener) {
    this.listeners.push(listener);
  }

  private setEnergy(energy: number) {
    this.energy = Math.max(0, Math.min(maxEnergy, energy));

    if (!this.isExhausted && this.energy === 0) {
      this.isExhausted = true;
      this.exhaustions++;
      this.zone = "walk";
      this.notify("exhausted");
    } else if (this.isExhausted && this.energy >= recoveredEnergy) {
      // Start again gently rather than at the pace that ran out
      this.isExhausted = false;
      this.zone = "easy";
      this.notify("recovered");
    }
  }

  private notify(event: EffortEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const effort = new Effort();
