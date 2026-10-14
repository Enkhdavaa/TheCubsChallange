import { mainCharacter } from "./mainCharacter.ts";
import { runState } from "../../runState.ts";
import { effort } from "../../effort.ts";
import { shiftLevel } from "../../levels.ts";
import { PACE_ZONE_ORDER } from "../../pace.ts";

const actionKeys = new Set(["ArrowUp", " ", "w", "W", "Enter"]);
const fasterKeys = new Set(["ArrowRight", "d", "D"]);
const slowerKeys = new Set(["ArrowLeft", "a", "A"]);

// One button does everything else: start, jump, and back to the start
// screen after finishing
const handleAction = () => {
  if (runState.phase === "running") {
    mainCharacter.jump();
  } else if (runState.phase === "ready") {
    runState.start();
  } else if (runState.canContinue()) {
    runState.showMenu();
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
    } else if (runState.phase === "ready" && !event.repeat) {
      // Left and right pick the run on the start screen
      if (fasterKeys.has(event.key)) {
        shiftLevel(1);
      } else if (slowerKeys.has(event.key)) {
        shiftLevel(-1);
      }
    }
  });

  // Covers mouse, pen and touch; anywhere outside the buttons acts
  document.addEventListener("pointerdown", (event) => {
    if (event.button === 0) {
      handleAction();
    }
  });
};
