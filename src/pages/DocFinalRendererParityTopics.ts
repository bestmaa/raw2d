import type { DocTopic } from "./DocPage.type";

export const finalRendererParityTopics: readonly DocTopic[] = [
  {
    id: "renderer-parity-checklist",
    label: "Renderer Parity Checklist",
    title: "Final Renderer Parity Checklist",
    description: "Use this checklist before claiming Canvas and WebGL behavior is release-ready.",
    sections: [
      {
        title: "Shared Behavior",
        body: "CanvasRenderer and WebGLRenderer2D should agree on scene traversal, visibility, transforms, zIndex order, Camera behavior, and supported object basics.",
        code: `Scene traversal
object.visible
position / rotation / scale / origin
zIndex render order
Camera x/y/zoom`
      },
      {
        title: "Browser Matrix",
        body: "The visual-test route exposes window.__raw2dPixelResult.matrix with a Canvas and WebGL row for every support-matrix object: Rect, Circle, Ellipse, Arc, Line, Polyline, Polygon, ShapePath, Sprite, Text2D, and Group2D.",
        code: `const result = window.__raw2dPixelResult;

for (const row of result.matrix) {
  console.log(row.kind, row.canvas.status, row.webgl.status);
}`
      },
      {
        title: "Known Differences",
        body: "Document any renderer difference clearly. WebGL may batch, cache, or fallback differently, but it should not silently hide supported content.",
        code: `Canvas: reference renderer
WebGL: batched renderer
ShapePath fills: direct or texture fallback
WebGL2 unavailable: clear message`
      },
      {
        title: "Checks",
        body: "Run Canvas, WebGL, benchmark, visual-test, and support matrix checks before release.",
        code: `npm run test:browser
node --test tests/browser/visual-pixel.test.mjs
http://localhost:5197/benchmark
http://localhost:5197/visual-test`
      }
    ]
  }
];
