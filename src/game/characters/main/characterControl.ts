import { spriteSelector } from "./mainCharacter.ts";

export const MainCharacterStart = () => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      spriteSelector.selectAnimation("jump", false);
    }
  });

  document.addEventListener("touchstart", (event) => {
    if (event.touches[0].clientY < globalThis.innerHeight / 2) {
      spriteSelector.selectAnimation("jump", false);
    }
  });
};
