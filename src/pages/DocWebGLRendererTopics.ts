import type { DocTopic } from "./DocPage.type";

export const webGLRendererTopics: readonly DocTopic[] = [
  {
    id: "webgl-renderer",
    label: "WebGLRenderer2D",
    title: "WebGLRenderer2D",
    description: "WebGLRenderer2D renders filled Rect, Circle, and Ellipse objects through WebGL2 using RenderPipeline and one dynamic shape batch.",
    sections: [
      {
        title: "First Working Scope",
        body: "WebGLRenderer2D now renders filled Rect, Circle, and Ellipse objects. Other object types are counted as unsupported until their batches are implemented.",
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
        title: "Shape Batch Stats",
        body: "All visible filled shapes supported by WebGLRenderer2D are written into one vertex buffer. This gives one draw call for the current simple shape batch.",
        liveDemoId: "webgl-renderer",
        code: `renderer.render(scene, camera);

console.log(renderer.getStats());

// {
//   objects: 1000,
//   rects: 334,
//   circles: 333,
//   ellipses: 333,
//   vertices: 65934,
//   drawCalls: 1,
//   unsupported: 0
// }`
      },
      {
        title: "Canvas Comparison",
        body: "Canvas supports more objects today, but each shape is drawn through Canvas APIs. WebGL currently supports fewer objects but can batch filled Rect, Circle, and Ellipse geometry.",
        liveDemoId: "webgl-renderer",
        code: `canvasRenderer.render(scene, camera);
console.log(canvasRenderer.getStats());
// { objects: 1000, drawCalls: 1000 }

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());
// { objects: 1000, rects: 334, circles: 333, ellipses: 333, vertices: 65934, drawCalls: 1, unsupported: 0 }`
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
