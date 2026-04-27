import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: new URL("./src/index.ts", import.meta.url).pathname,
      name: "Raw2D",
      formats: ["es", "umd"],
      fileName: (format): string => (format === "es" ? "raw2d.js" : "raw2d.umd.cjs")
    },
    rollupOptions: {
      output: {
        exports: "named"
      }
    }
  }
});
