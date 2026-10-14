import { mainCharacter } from "./mainCharacter.ts";
import { runState } from "../../runState.ts";

const actionKeys = new Set(["ArrowUp", " ", "w", "W", "Enter"]);

// One button does everything: start, jump, and run again
const handleAction = () => {
  if (runState.phase === "running") {
    mainCharacter.jump();
  } else if (runState.phase === "ready" || runState.canRestart()) {
    runState.start();
  }
};

export const MainCharacterStart = () => {
  document.addEventListener("keydown", (event) => {
    if (!actionKeys.has(event.key)) {
      return;
    }
    // Space would otherwise scroll or press a focused element
    event.preventDefault();
    if (!event.repeat) {
      handleAction();
    }
  });

  // Covers mouse, pen and touch; anywhere on the screen works
  document.addEventListener("pointerdown", (event) => {
    if (event.button === 0) {
      handleAction();
    }
  });
};
