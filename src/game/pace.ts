import { SETTINGS } from "./settings.ts";

export type PaceZone = "walk" | "easy" | "steady" | "fast";

interface PaceZoneInfo {
  label: string;
  secondsPerKm: number;
  // Positive refills energy, negative uses it up
  energyPerSecond: number;
  // What the runner says when switching to this pace
  feeling: string;
}

// Slowest to fastest
export const PACE_ZONE_ORDER: PaceZone[] = ["walk", "easy", "steady", "fast"];

// Typical beginner paces: easy is a pace you can still chat at
export const PACE_ZONES: Record<PaceZone, PaceZoneInfo> = {
  walk: {
    label: "Walk",
    secondsPerKm: 600,
    energyPerSecond: 15,
    feeling: "Walk break, catching my breath",
  },
  easy: {
    label: "Easy",
    secondsPerKm: 450,
    energyPerSecond: 5,
    feeling: "I can still chat 🙂",
  },
  steady: {
    label: "Steady",
    secondsPerKm: 390,
    energyPerSecond: -5,
    feeling: "Breathing harder",
  },
  fast: {
    label: "Fast",
    secondsPerKm: 330,
    energyPerSecond: -15,
    feeling: "Can't talk!",
  },
};

// World units per second that match a zone's real pace
export function getWorldSpeed(zone: PaceZone) {
  const metersPerSecond = 1000 / PACE_ZONES[zone].secondsPerKm;
  return (metersPerSecond * SETTINGS.TIME_SCALE) / SETTINGS.METERS_PER_UNIT;
}

// 450 -> "7:30", 3725 -> "1:02:05"
export function formatDuration(totalSeconds: number) {
  const seconds = Math.round(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = String(seconds % 60).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${rest}`;
  }
  return `${minutes}:${rest}`;
}
