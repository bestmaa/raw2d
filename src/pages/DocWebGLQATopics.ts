import type { DocTopic } from "./DocPage.type";

export const webGLQATopics: readonly DocTopic[] = [
  {
    id: "webgl-docs-qa",
    label: "WebGL Docs QA",
    title: "WebGL Docs Visual QA",
    description: "Use this checklist before WebGL examples or batching docs are accepted.",
    sections: [
      {
        title: "Open The Routes",
        body: "Check the WebGL docs, benchmark, visual test, and standalone example in a real browser. The page must not fall back silently or show a blank canvas.",
        code: `http://localhost:5197/doc#webgl-renderer
http://localhost:5197/doc#webgl-performance
http://localhost:5197/doc#webgl-visual-tests
http://localhost:5197/benchmark
http://localhost:5197/visual-test
http://localhost:5197/examples/webgl-basic/`
      },
      {
        title: "Renderer Diagnostics",
        body: "Confirm stats are visible when the example exposes them: frame time, FPS, drawCalls, textureBinds, static cache hits, and unsupported objects.",
        code: `const stats = webglRenderer.getStats();
console.log(stats.drawCalls, stats.textureBinds, stats.unsupportedObjects);`
      },
      {
        title: "Visual Result",
        body: "WebGL output must show the expected geometry or sprites. Compare it with the Canvas route only when both renderers support the same feature.",
        code: `Canvas reference: Rect, Circle, Line, Text2D, Sprite
WebGL check: batched shapes, sprites, text textures, path fallback
Failure: blank canvas, wrong color, missing texture, bad zIndex`
      },
      {
        title: "Context And Fallback",
        body: "Reload the page, force a resize, and verify WebGL2 support messaging is clear when the browser cannot create a WebGL2 context.",
        code: `const ok = WebGLRenderer2D.isAvailable(canvas);
if (!ok) {
  console.warn("WebGL2 is not available.");
}`
      }
    ]
  }
];
