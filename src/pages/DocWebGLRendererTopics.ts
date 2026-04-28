import type { DocTopic } from "./DocPage.type";

export const webGLRendererTopics: readonly DocTopic[] = [
  {
    id: "webgl-renderer",
    label: "WebGLRenderer2D",
    title: "WebGLRenderer2D",
    description: "WebGLRenderer2D renders Rect objects through WebGL2 using RenderPipeline and one dynamic rect batch.",
    sections: [
      {
        title: "First Working Scope",
        body: "WebGLRenderer2D now renders Rect. Other object types are counted as unsupported until their batches are implemented.",
        code: `const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

renderer.render(scene, camera);`
      },
      {
        title: "Rect Batch Stats",
        body: "All visible rects are written into one vertex buffer. For rect-only scenes this gives one draw call.",
        code: `renderer.render(scene, camera);

console.log(renderer.getStats());

// {
//   objects: 1000,
//   rects: 1000,
//   vertices: 6000,
//   drawCalls: 1,
//   unsupported: 0
// }`
      },
      {
        title: "Canvas Comparison",
        body: "Canvas supports more objects today, but each shape is drawn through Canvas APIs. WebGL currently supports fewer objects but can batch Rect geometry.",
        code: `canvasRenderer.render(scene, camera);
console.log(canvasRenderer.getStats());
// { objects: 1000, drawCalls: 1000 }

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());
// { objects: 1000, rects: 1000, vertices: 6000, drawCalls: 1, unsupported: 0 }`
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

