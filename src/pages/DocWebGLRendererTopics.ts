import type { DocTopic } from "./DocPage.type";

export const webGLRendererTopics: readonly DocTopic[] = [
  {
    id: "webgl-renderer",
    label: "WebGLRenderer2D",
    title: "WebGLRenderer2D",
    description: "WebGLRenderer2D renders filled and stroked 2D primitives through WebGL2 using RenderPipeline and one dynamic primitive batch.",
    sections: [
      {
        title: "First Working Scope",
        body: "WebGLRenderer2D now renders Rect, Circle, Ellipse, Line, Polyline, and convex Polygon objects. Other object types are counted as unsupported until their batches are implemented.",
        liveDemoId: "webgl-renderer",
        code: `const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

renderer.render(scene, camera);`
      },
      {
        title: "Primitive Batch Stats",
        body: "All visible primitives supported by WebGLRenderer2D are written into one vertex buffer. This gives one draw call for the current simple primitive batch.",
        liveDemoId: "webgl-renderer",
        code: `renderer.render(scene, camera);

console.log(renderer.getStats());

// {
//   objects: 1000,
//   rects: 167,
//   circles: 167,
//   ellipses: 167,
//   lines: 167,
//   polylines: 166,
//   polygons: 166,
//   vertices: 37056,
//   drawCalls: 1,
//   unsupported: 0
// }`
      },
      {
        title: "Canvas Comparison",
        body: "Canvas supports more object types today, but each primitive is drawn through Canvas APIs. WebGL currently supports fewer objects but can batch primitive geometry.",
        liveDemoId: "webgl-renderer",
        code: `canvasRenderer.render(scene, camera);
console.log(canvasRenderer.getStats());
// { objects: 1000, drawCalls: 1000 }

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());
// { objects: 1000, rects: 167, circles: 167, ellipses: 167, lines: 167, polylines: 166, polygons: 166, vertices: 37056, drawCalls: 1, unsupported: 0 }`
      },
      {
        title: "Current Limits",
        body: "Polygon batching uses a simple triangle fan, so it is intended for convex polygons first. Line and Polyline batching writes each segment as a quad with simple joins.",
        code: `// Good first WebGL polygon target: convex points.
scene.add(new Polygon({
  points: [
    { x: 0, y: 0 },
    { x: 80, y: 0 },
    { x: 80, y: 50 },
    { x: 0, y: 50 }
  ]
}));`
      },
      {
        title: "Use Culling",
        body: "WebGLRenderer2D uses the same RenderPipeline culling idea as Canvas.",
        code: `webglRenderer.render(scene, camera, {
  culling: true
});`
      },
      {
        title: "Shared RenderList",
        body: "Build a render list manually when you want to inspect the scene before WebGL writes buffers.",
        code: `const renderList = webglRenderer.createRenderList(scene, camera, {
  culling: true
});

webglRenderer.render(scene, camera, { renderList });`
      }
    ]
  }
];
