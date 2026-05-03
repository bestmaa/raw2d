import type { DocTopic } from "./DocPage.type";

export const publicApiTopics: readonly DocTopic[] = [
  {
    id: "public-api",
    label: "Public API",
    title: "Public API",
    description: "Use the umbrella package for stable app code and focused packages for low-level engine work.",
    sections: [
      {
        title: "Use raw2d First",
        body: "The raw2d package exports the stable runtime API most apps should start with.",
        code: `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Rect,
  Scene,
  WebGLRenderer2D
} from "raw2d";`
      },
      {
        title: "Focused Packages",
        body: "Install focused packages when you want tighter bundle control or lower-level renderer tools. raw2d-core has its own audited public surface.",
        code: `import { Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
import { Sprite, TextureAtlasPacker } from "raw2d-sprite";`
      },
      {
        title: "Canvas Package Boundary",
        body: "raw2d-canvas exports CanvasRenderer as the explicit renderer name. Canvas stays as the short compatibility name.",
        code: `import { CanvasRenderer, drawRect } from "raw2d-canvas";
import { Rect, Scene } from "raw2d-core";

const renderer = new CanvasRenderer({ canvas: canvasElement });
renderer.render(scene, camera);`
      },
      {
        title: "Renderer Naming",
        body: "Use CanvasRenderer when you want naming parity with WebGLRenderer2D. Existing Canvas examples keep working.",
        code: `import { CanvasRenderer, WebGLRenderer2D } from "raw2d";

const renderer = new CanvasRenderer({ canvas: canvasElement });
const webgl = new WebGLRenderer2D({ canvas: canvasElement });`
      },
      {
        title: "Compatibility Alias",
        body: "Canvas is the compatibility alias for CanvasRenderer. Keep it in existing code; prefer CanvasRenderer in new renderer-focused docs.",
        code: `import { Canvas, CanvasRenderer } from "raw2d";

console.log(Canvas === CanvasRenderer); // true`
      },
      {
        title: "Frozen Option Names",
        body: "Constructor option names for objects, materials, textures, atlases, and interaction controllers are treated as public API. Type tests guard these names before releases.",
        code: `new Rect({ width: 120, height: 80, material });
new Sprite({ texture, frame, width: 64, height: 64 });
new InteractionController({
  canvas,
  scene,
  camera,
  selection,
  onChange: render
});`
      },
      {
        title: "API Stability Policy",
        body: "Raw2D keeps runtime exports, documented focused-package exports, constructor option names, and renderer lifecycle methods stable. Renames should add aliases before removals.",
        code: `// Stable app-level API:
import { CanvasRenderer, Rect, Scene } from "raw2d";

// Stable focused-package API:
import { RectOptions } from "raw2d-core";

// Compatibility alias stays available:
import { Canvas } from "raw2d";`
      },
      {
        title: "Deprecation Policy",
        body: "Do not remove a public name in the same task that introduces its replacement. Update docs, examples, type tests, and export tests first.",
        notice: {
          tone: "warning",
          title: "Deprecation helper",
          body: "Use a visible note before a breaking rename, then keep the old name working until the migration is documented and tested."
        },
        code: `// Step 1: add replacement and alias.
export { Canvas as CanvasRenderer };

// Step 2: document preferred name.
// Step 3: keep tests proving old and new imports work.`
      },
      {
        title: "WebGL Package Boundary",
        body: "raw2d-webgl exports WebGLRenderer2D plus batcher, buffer, texture-cache, and diagnostics helpers for engine-level tools.",
        code: `import {
  WebGLRenderer2D,
  createWebGLShapeBatch,
  WebGLFloatBuffer
} from "raw2d-webgl";

const renderer = new WebGLRenderer2D({ canvas: canvasElement });`
      },
      {
        title: "Feature Package Boundary",
        body: "Sprite, text, and interaction packages are focused public surfaces. raw2d-effects is reserved and intentionally empty for now.",
        code: `import { Sprite, TextureLoader } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { InteractionController } from "raw2d-interaction";`
      },
      {
        title: "Umbrella Runtime Boundary",
        body: "The umbrella runtime exports are audited by tests. App-level classes stay available here, while Canvas/WebGL implementation internals stay out.",
        code: `// Available from raw2d:
Canvas;
WebGLRenderer2D;
TextureAtlasPacker;

// Advanced helpers stay in focused packages:
// import {
//   createWebGLShapeBatch,
//   sortWebGLSpritesForBatching
// } from "raw2d-webgl";`
      },
      {
        title: "Audited Export Surface",
        body: "Raw2D keeps an exact runtime export test for the umbrella package so accidental internals cannot leak into app code.",
        code: `import * as Raw2D from "raw2d";

console.log(Raw2D.Canvas);
console.log(Raw2D.Scene);
console.log(Raw2D.WebGLRenderer2D);

// Internal renderer helpers are not exported from raw2d.
// Import advanced tools from focused packages only.`
      },
      {
        title: "Type Exports",
        body: "Types remain available from the umbrella package so app code can stay ergonomic without pulling runtime internals.",
        code: `import type {
  Object2DOriginKeyword,
  Renderer2DLike,
  WebGLRenderStats
} from "raw2d";`
      },
      {
        title: "Stability Rule",
        body: "App-level examples should import from raw2d. Engine-builder examples can import advanced helpers from focused packages.",
        code: `// App code:
import { Canvas, Scene, Rect } from "raw2d";

// Engine/debug code:
import { createWebGLShapeBatch } from "raw2d-webgl";`
      }
    ]
  }
];
