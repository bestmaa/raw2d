import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "/studio/",
  build: {
    outDir: "../../dist-studio",
    emptyOutDir: true
  }
});
