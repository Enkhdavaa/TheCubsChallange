import * as THREE from "three";

// Add functions to be called every frame
const frameCallbacks: Array<() => void> = [];

// Calculate delta time
const clock = new THREE.Clock();
let previousElapsedTime = clock.getElapsedTime();
let deltaTime = 0;

function calculateDeltaTime() {
  const currentElapsedTime = clock.getElapsedTime();
  deltaTime = currentElapsedTime - previousElapsedTime;
  previousElapsedTime = currentElapsedTime;
}

// Call all frame functions
const tick = () => {
  // Calculate delta time
  calculateDeltaTime();

  // Call all frame functions
  frameCallbacks.forEach((callback) => {
    callback();
  });

  // Request next frame
  globalThis.requestAnimationFrame(tick);
};

// Start the frame loop
tick();

// Export functions
export const addFrameCallback = (callback: () => void) => {
  frameCallbacks.push(callback);
};

export const getDeltaTime = () => {
  return deltaTime;
};
