import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  appType: "mpa",
  plugins: [glsl()],
  server: {
    open: true,
    proxy: {
      "/api/": {
        target: `http://localhost:8080`,
      },
    },
  },
  build: {
    assetsInlineLimit: 0,
    target: "esnext",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "index.html",
        game: "game.html",
      },
    },
  },
  optimizeDeps: {
    exclude: ["lit-html"],
  },
});
