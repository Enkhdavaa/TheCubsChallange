import { readItem, writeItem } from "./helper/storage.ts";

// Best finish times, in seconds of real running, per level
const storageKey = (levelId: string) => `cubs-run:best:${levelId}`;

export function loadBest(levelId: string): number | null {
  const value = readItem(storageKey(levelId));
  const seconds = value === null ? NaN : Number(value);
  return Number.isFinite(seconds) ? seconds : null;
}

export interface FinishRecord {
  previousBest: number | null;
  isNewBest: boolean;
}

// Compares a finish time with the stored best and keeps the faster one
export function recordFinish(levelId: string, seconds: number): FinishRecord {
  const previousBest = loadBest(levelId);
  const isNewBest = previousBest === null || seconds < previousBest;
  if (isNewBest) {
    writeItem(storageKey(levelId), String(seconds));
  }
  return { previousBest, isNewBest };
}
