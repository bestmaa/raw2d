import type { DocTopic } from "./DocPage.type";

export const webGLDecisionTopics: readonly DocTopic[] = [
  {
    id: "webgl-when-needed",
    label: "WebGL When Needed",
    title: "WebGL When Needed",
    description: "Start with Canvas, then move to WebGL when batching, atlas textures, or draw-call stats matter.",
    sections: [
      {
        title: "Canvas First Rule",
        body: "Canvas is the reference path. Use it while learning, debugging, building new objects, or proving exact behavior.",
        code: `import { Canvas } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement, width: 800, height: 600 });
renderer.render(scene, camera);`
      },
      {
        title: "Move To WebGL When Needed",
        body: "Use WebGL when object count, sprite count, texture binds, repeated redraws, or static map layers become the bottleneck.",
        code: `const shouldUseWebGL =
  objectCount > 500 ||
  spriteCount > 200 ||
  usesTextureAtlas ||
  hasLargeStaticLayers;`
      },
      {
        title: "Compare Stats, Not Names",
        body: "WebGL is not automatically faster for every scene. Compare draw calls, texture binds, uploads, cache hits, and frame time.",
        code: `canvasRenderer.render(scene, camera);
webglRenderer.render(scene, camera);

const stats = webglRenderer.getStats();

console.table({
  canvasDrawCalls: canvasRenderer.getStats().drawCalls,
  webglDrawCalls: stats.drawCalls,
  textureBinds: stats.textureBinds,
  staticCacheHits: stats.staticCacheHits,
  uploadedBytes: stats.uploadedBytes
});`
      },
      {
        title: "Use Safe Fallback",
        body: "Keep Canvas as the fallback when WebGL2 is unavailable or when a scene needs a Canvas-only feature.",
        code: `import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";
import type { Renderer2DLike } from "raw2d";

const renderer: Renderer2DLike = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement })
  : new Canvas({ canvas: canvasElement });`
      },
      {
        title: "Tradeoff Summary",
        body: "Canvas gives simpler debugging and broad coverage. WebGL gives batching, texture atlas leverage, static cache reuse, and explicit GPU stats.",
        code: `Canvas: simple, complete, debug-friendly
WebGL: batched, atlas-friendly, stats-driven
Rule: keep the same Scene and Camera2D, swap only the renderer`
      }
    ]
  }
];
