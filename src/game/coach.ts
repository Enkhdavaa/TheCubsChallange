import { course } from "./course.ts";
import { effort } from "./effort.ts";
import { PACE_ZONE_ORDER, PaceZone } from "./pace.ts";
import { runState } from "./runState.ts";

// Share of the running time spent at each pace, adding up to 1
export function getZoneShares(): Record<PaceZone, number> {
  const total = PACE_ZONE_ORDER.reduce(
    (sum, zone) => sum + effort.zoneSeconds[zone],
    0,
  );
  const shares = { walk: 0, easy: 0, steady: 0, fast: 0 };
  if (total > 0) {
    PACE_ZONE_ORDER.forEach((zone) => {
      shares[zone] = effort.zoneSeconds[zone] / total;
    });
  }
  return shares;
}

// One tip based on how the run went and what kind of run it was
export function getFinishTip() {
  const shares = getZoneShares();
  const { exhaustions } = effort;
  const hasHills = course.stretches.length > 0;
  const waitingShare = effort.waitingSeconds / runState.getElapsed();

  if (exhaustions >= 2) {
    return hasHills
      ? `You ran out of breath ${exhaustions} times. On climbs, walk before you have to.`
      : `You ran out of breath ${exhaustions} times. Starting slower usually gets you to the finish sooner.`;
  }
  if (exhaustions === 1) {
    return "You ran out of breath once. Ease off before your energy runs out and you'll keep running.";
  }
  if (waitingShare > 0.08) {
    return "You waited at a lot of red lights. Easing off as you get close saves time and energy.";
  }
  if (shares.fast > 0.3) {
    return "Going fast is fun, but most runs should feel easy. That's how your body gets fitter.";
  }
  if (shares.walk > 0.25) {
    return hasHills
      ? "Walking the climbs is what experienced trail runners do too."
      : "Walk breaks are a smart way to finish. Next time, try running a little longer between them.";
  }
  return hasHills
    ? "Nice! On trails, a steady effort beats a steady pace."
    : "Nice, even pacing. Running at a pace you can keep is how you build up to longer runs.";
}
