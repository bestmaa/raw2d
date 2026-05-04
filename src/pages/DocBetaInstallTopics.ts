import type { DocTopic } from "./DocPage.type";

export const betaInstallTopics: readonly DocTopic[] = [
  {
    id: "umbrella-beta-install",
    label: "Umbrella Install",
    title: "Umbrella Beta Install Audit",
    description: "Verify the one-package `raw2d` install path in a fresh Vite TypeScript app.",
    sections: [
      {
        title: "Run The Audit",
        body: "Use the umbrella consumer smoke when checking the beginner install path. It creates a temporary Vite app and installs packed Raw2D packages.",
        code: `npm run test:consumer:umbrella`
      },
      {
        title: "Expected Imports",
        body: "The generated app must import public classes from the umbrella package only.",
        code: `import { BasicMaterial, Camera2D, CanvasRenderer, Rect, Scene, Text2D } from "raw2d";`
      },
      {
        title: "Render Gate",
        body: "The app must create a scene, add visible objects, and call the renderer. Build success alone is not enough for the beta gate.",
        code: `scene.add(rect).add(label);
renderer.render(scene, camera);`
      },
      {
        title: "Runtime Gate",
        body: "The runtime import check confirms stable public exports and rejects leaked low-level renderer internals.",
        code: `const m = await import("raw2d");
console.log("umbrella-runtime-ok", typeof m.Scene, typeof m.CanvasRenderer);`
      }
    ]
  }
];
