// Functions to be called after the view size changes
const resizeCallbacks: Array<() => void> = [];

export const addResizeCallback = (callback: () => void) => {
  resizeCallbacks.push(callback);
};

export const notifyResize = () => {
  resizeCallbacks.forEach((callback) => {
    callback();
  });
};
