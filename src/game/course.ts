import { getSelectedLevel, Level } from "./levels.ts";
import { SETTINGS } from "./settings.ts";

export interface Stretch {
  startUnits: number;
  endUnits: number;
  // Rise over distance, e.g. 0.06 for a 6% climb
  grade: number;
}

// Longer runs are squeezed more, so a world unit covers more ground
export function getMetersPerUnit(level: Level) {
  return SETTINGS.METERS_PER_UNIT * level.timeScale;
}

// The route of one run in world units: its length, crossings and hills
class Course {
  public level: Level = getSelectedLevel();
  public metersPerUnit = SETTINGS.METERS_PER_UNIT;
  public goalUnits = 0;
  public lightUnits: number[] = [];
  public stretches: Stretch[] = [];

  constructor() {
    this.build(this.level);
  }

  public build(level: Level) {
    this.level = level;
    this.metersPerUnit = getMetersPerUnit(level);
    this.goalUnits = this.unitsFromKm(level.distanceKm);
    this.lightUnits = (level.trafficLightsKm ?? []).map((km) =>
      this.unitsFromKm(km)
    );

    let startUnits = 0;
    this.stretches = (level.hills ?? []).map(({ km, grade }) => {
      const endUnits = startUnits + this.unitsFromKm(km);
      const stretch = { startUnits, endUnits, grade: grade / 100 };
      startUnits = endUnits;
      return stretch;
    });
  }

  public unitsFromKm(km: number) {
    return (km * 1000) / this.metersPerUnit;
  }

  public getStretch(units: number) {
    return this.stretches.find((stretch) =>
      units >= stretch.startUnits && units < stretch.endUnits
    ) ?? null;
  }

  public getGrade(units: number) {
    return this.getStretch(units)?.grade ?? 0;
  }

  // True when no crossing or finish line is within the stretch of road
  public isClear(fromUnits: number, toUnits: number, margin: number) {
    return [...this.lightUnits, this.goalUnits].every((units) =>
      units < fromUnits - margin || units > toUnits + margin
    );
  }

  // Height in meters where each stretch starts and ends, for a chart
  public getElevationProfile() {
    let meters = 0;
    const points = [{ units: 0, meters }];
    this.stretches.forEach(({ startUnits, endUnits, grade }) => {
      meters += (endUnits - startUnits) * this.metersPerUnit * grade;
      points.push({ units: endUnits, meters });
    });
    return points;
  }
}

export const course = new Course();

// The same effort is slower uphill and a bit faster downhill
export function getHillSpeedFactor(grade: number) {
  return grade >= 0
    ? Math.max(0.55, 1 - 4 * grade)
    : Math.min(1.15, 1 - 1.5 * grade);
}

// Extra energy per second: climbing costs energy, descending gives a little
export function getHillEnergy(grade: number) {
  return grade >= 0 ? -60 * grade : -15 * grade;
}
