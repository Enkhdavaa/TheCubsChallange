// Best finish times live in this browser only; storage can be blocked or
// cleared, so every access is allowed to fail
const storageKey = (levelId: string) => `cubs-run:best:${levelId}`;

function loadBest(levelId: string): number | null {
  try {
    const value = globalThis.localStorage.getItem(storageKey(levelId));
    const seconds = value === null ? NaN : Number(value);
    return Number.isFinite(seconds) ? seconds : null;
  } catch {
    return null;
  }
}

function saveBest(levelId: string, seconds: number) {
  try {
    globalThis.localStorage.setItem(storageKey(levelId), String(seconds));
  } catch {
    // Nothing to do; the best time just isn't remembered
  }
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
    saveBest(levelId, seconds);
  }
  return { previousBest, isNewBest };
}
