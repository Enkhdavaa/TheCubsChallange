import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",
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
    rolldownOptions: {
      input: {
        main: "index.html",
        game: "game.html",
      },
    },
  },
});
