import * as THREE from "three";

const clock = new THREE.Clock();

let previousElapsedTime = clock.getElapsedTime();
let deltaTime = 0;

function calculateDeltaTime() {
  const currentElapsedTime = clock.getElapsedTime();
  deltaTime = currentElapsedTime - previousElapsedTime;
  previousElapsedTime = currentElapsedTime;
}

const tick = () => {
  calculateDeltaTime();
  globalThis.requestAnimationFrame(tick);
};

tick();

const getDeltaTime = () => {
  return deltaTime;
};

export default getDeltaTime;
