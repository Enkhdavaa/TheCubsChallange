import * as THREE from "three";

// Add functions to be called every frame
const frameCallbacks: Array<() => void> = [];

// Calculate delta time
const timer = new THREE.Timer();
let deltaTime = 0;

// Cap a single step so a frame after a hidden tab doesn't teleport obstacles
const maxDeltaTime = 0.1;

function calculateDeltaTime() {
  timer.update();
  deltaTime = Math.min(timer.getDelta(), maxDeltaTime);
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

export const getElapsedTime = () => {
  return timer.getElapsed();
};
