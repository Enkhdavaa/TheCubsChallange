export const sizes = () => {
  return {
    width: globalThis.innerWidth,
    height: globalThis.innerHeight,
  };
};

export const getWindowAspectRatio = () => {
  const { width, height } = sizes();
  return width / height;
};
