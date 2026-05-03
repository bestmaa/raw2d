import type { DocTopic } from "./DocPage.type";

export const installSmokeTopics: readonly DocTopic[] = [
  {
    id: "install-smoke",
    label: "Install Smoke",
    title: "Final Package Install Smoke",
    description: "Use this smoke test before v1 release to confirm Raw2D installs in a fresh app.",
    sections: [
      {
        title: "Fresh App",
        body: "Create a temporary Vite TypeScript app and install the published Raw2D package or local package tarball.",
        code: `npm create vite@latest raw2d-smoke -- --template vanilla-ts
cd raw2d-smoke
npm install raw2d`
      },
      {
        title: "Import Check",
        body: "Import the umbrella package and at least one focused package. The app should typecheck without path aliases.",
        code: `import { Scene, Camera2D, CanvasRenderer } from "raw2d";
import { Rect } from "raw2d-core";
import { CanvasRenderer as FocusedCanvasRenderer } from "raw2d-canvas";`
      },
      {
        title: "Build Check",
        body: "The consumer project must build with TypeScript and Vite. This catches missing files, bad exports, and broken package metadata.",
        code: `npm run build
npm ls raw2d
npm ls raw2d-core raw2d-canvas raw2d-webgl`
      },
      {
        title: "Browser Check",
        body: "Open the built app and confirm a tiny scene renders. This is a release gate, not a replacement for unit tests.",
        code: `const scene = new Scene();
const camera = new Camera2D();
const renderer = new CanvasRenderer({ canvas, width: 320, height: 180 });
renderer.render(scene, camera);`
      }
    ]
  }
];
