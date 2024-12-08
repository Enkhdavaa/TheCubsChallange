import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",
  plugins: [],
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
  },
  optimizeDeps: {
    exclude: ["lit-html"],
  },
});
