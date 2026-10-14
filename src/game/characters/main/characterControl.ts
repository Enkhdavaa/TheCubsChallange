import { mainCharacter } from "./mainCharacter.ts";
import { runState } from "../../runState.ts";
import { effort } from "../../effort.ts";
import { PACE_ZONE_ORDER } from "../../pace.ts";

const actionKeys = new Set(["ArrowUp", " ", "w", "W", "Enter"]);
const fasterKeys = new Set(["ArrowRight", "d", "D"]);
const slowerKeys = new Set(["ArrowLeft", "a", "A"]);

// One button does everything else: start, jump, and run again
const handleAction = () => {
  if (runState.phase === "running") {
    mainCharacter.jump();
  } else if (runState.phase === "ready" || runState.canRestart()) {
    runState.start();
  }
};

// Left and right change pace; 1 to 4 pick one directly
const handlePaceKey = (key: string) => {
  if (fasterKeys.has(key)) {
    effort.shiftZone(1);
  } else if (slowerKeys.has(key)) {
    effort.shiftZone(-1);
  } else {
    const zone = PACE_ZONE_ORDER[Number(key) - 1];
    if (zone) {
      effort.selectZone(zone);
    }
  }
};

export const MainCharacterStart = () => {
  document.addEventListener("keydown", (event) => {
    if (actionKeys.has(event.key)) {
      // Space would otherwise scroll or press a focused element
      event.preventDefault();
      if (!event.repeat) {
        handleAction();
      }
    } else if (runState.phase === "running" && !event.repeat) {
      handlePaceKey(event.key);
    }
  });

  // Covers mouse, pen and touch; anywhere outside the pace buttons jumps
  document.addEventListener("pointerdown", (event) => {
    if (event.button === 0) {
      handleAction();
    }
  });
};
