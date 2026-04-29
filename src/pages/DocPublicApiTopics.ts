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
        body: "Install focused packages when you want tighter bundle control or lower-level renderer tools.",
        code: `import { Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
import { Sprite, TextureAtlasPacker } from "raw2d-sprite";`
      },
      {
        title: "Umbrella Runtime Boundary",
        body: "The umbrella package intentionally avoids exporting Canvas/WebGL implementation internals at runtime.",
        code: `// Available from raw2d:
Canvas;
WebGLRenderer2D;
TextureAtlasPacker;

// Advanced helpers stay in focused packages:
// import { createWebGLShapeBatch } from "raw2d-webgl";`
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
