import { mainCharacter } from "./mainCharacter.ts";

export const MainCharacterStart = () => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      mainCharacter.jump();
    }
  });

  document.addEventListener("touchstart", (event) => {
    if (event.touches[0].clientY < globalThis.innerHeight / 2) {
      mainCharacter.jump();
    }
  });
};
