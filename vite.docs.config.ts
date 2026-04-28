import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      raw2d: new URL("./packages/raw2d/src/index.ts", import.meta.url).pathname,
      "raw2d-canvas": new URL("./packages/canvas/src/index.ts", import.meta.url).pathname,
      "raw2d-core": new URL("./packages/core/src/index.ts", import.meta.url).pathname,
      "raw2d-effects": new URL("./packages/effects/src/index.ts", import.meta.url).pathname,
      "raw2d-interaction": new URL("./packages/interaction/src/index.ts", import.meta.url).pathname,
      "raw2d-sprite": new URL("./packages/sprite/src/index.ts", import.meta.url).pathname,
      "raw2d-text": new URL("./packages/text/src/index.ts", import.meta.url).pathname,
      "raw2d-webgl": new URL("./packages/webgl/src/index.ts", import.meta.url).pathname
    }
  },
  build: {
    emptyOutDir: true,
    outDir: "dist"
  }
});
