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
  },
  {
    id: "canvas-focused-install",
    label: "Canvas Install",
    title: "Canvas Focused Install Audit",
    description: "Verify the smallest Canvas package path with `raw2d-core` and `raw2d-canvas`.",
    sections: [
      {
        title: "Run The Audit",
        body: "Use this smoke when checking users who want Canvas only. It installs only the core and Canvas focused packages.",
        code: `npm run test:consumer:canvas`
      },
      {
        title: "Expected Install",
        body: "The generated app must not need the umbrella, WebGL, sprite, text, React, or MCP packages.",
        code: `npm install raw2d-core raw2d-canvas`
      },
      {
        title: "Expected Imports",
        body: "Use core for scene data and Canvas for drawing. Objects stay renderer-agnostic.",
        code: `import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { CanvasRenderer } from "raw2d-canvas";`
      },
      {
        title: "Render Gate",
        body: "The app must add a visible object and call the Canvas renderer.",
        code: `scene.add(rect);
renderer.render(scene, camera);`
      }
    ]
  },
  {
    id: "webgl-focused-install",
    label: "WebGL Install",
    title: "WebGL Focused Install Audit",
    description: "Verify the focused WebGL package path with `raw2d-core` and `raw2d-webgl`.",
    sections: [
      {
        title: "Run The Audit",
        body: "Use this smoke for users who want WebGL without the umbrella package.",
        code: `npm run test:consumer:webgl`
      },
      {
        title: "Expected Install",
        body: "The generated app should directly depend on core scene data and the WebGL renderer package.",
        code: `npm install raw2d-core raw2d-webgl`
      },
      {
        title: "Expected Imports",
        body: "Use core for scene data and WebGL for drawing. Canvas is not part of this focused app code.",
        code: `import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { WebGLRenderer2D, isWebGL2Available } from "raw2d-webgl";`
      },
      {
        title: "Render Gate",
        body: "The app must create a WebGL renderer and render when WebGL2 is available.",
        code: `if (isWebGL2Available({ canvas })) {
  renderer.render(scene, camera);
}`
      }
    ]
  },
  {
    id: "react-beta-install",
    label: "React Install",
    title: "React Beta Install Audit",
    description: "Verify the optional `raw2d-react` bridge in a fresh React/Vite app.",
    sections: [
      {
        title: "Run The Audit",
        body: "Use this smoke for the current React adapter. It is not the future Fiber package.",
        code: `npm run test:consumer:react`
      },
      {
        title: "Expected Install",
        body: "React users install Raw2D, the bridge package, and React itself. The bridge keeps Raw2D public APIs visible.",
        code: `npm install raw2d raw2d-react react react-dom`
      },
      {
        title: "Expected Imports",
        body: "The generated app must cover the current bridge component set.",
        code: `import { Raw2DCanvas, RawCircle, RawRect, RawSprite, RawText2D } from "raw2d-react";`
      },
      {
        title: "Runtime Gate",
        body: "The runtime import check confirms the package metadata and bridge exports are available.",
        code: `const react = await import("raw2d-react");
console.log("react-runtime-ok", react.RAW2D_REACT_PACKAGE_INFO.packageName);`
      }
    ]
  }
];
