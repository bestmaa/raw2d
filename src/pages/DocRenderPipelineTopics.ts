import type { DocTopic } from "./DocPage.type";

export const renderPipelineTopics: readonly DocTopic[] = [
  {
    id: "render-pipeline",
    label: "Render Pipeline",
    title: "Render Pipeline",
    description: "Build a transparent render list before drawing so Canvas and future WebGL can share the same scene preparation path.",
    sections: [
      {
        title: "Why It Matters",
        body: "RenderPipeline makes Scene -> RenderList -> Renderer explicit. It collects objects, applies visibility, culling, filters, group hierarchy, and zIndex sorting before drawing starts.",
        liveDemoId: "render-pipeline",
        code: `const renderList = raw2dCanvas.createRenderList(scene, camera, {
  culling: true
});

raw2dCanvas.render(scene, camera, { renderList });`
      },
      {
        title: "Inspect Render Items",
        body: "A RenderList exposes root items for hierarchical rendering and flat items for debugging, tools, and future batching.",
        liveDemoId: "render-pipeline",
        code: `const rootItems = renderList.getRootItems();
const flatItems = renderList.getFlatItems();

console.log(flatItems.map((item) => ({
  id: item.id,
  depth: item.depth,
  zIndex: item.zIndex,
  bounds: item.bounds
})));`
      },
      {
        title: "Pipeline Stats",
        body: "Stats make the pipeline easy to debug. You can see how many objects were accepted, hidden, filtered, or culled.",
        liveDemoId: "render-pipeline",
        code: `const stats = renderList.getStats();

console.log(stats.accepted);
console.log(stats.culled);`
      },
      {
        title: "Custom Pipeline",
        body: "Engine builders can create RenderPipeline directly when they need their own bounds provider or filter.",
        liveDemoId: "render-pipeline",
        code: `const pipeline = new RenderPipeline({
  boundsProvider: (object) => getWorldBounds({
    object,
    localBounds: getCoreLocalBounds(object)
  })
});

const renderList = pipeline.build({
  scene,
  camera,
  viewport: { width: 800, height: 600 },
  culling: true
});`
      },
      {
        title: "WebGL Direction",
        body: "WebGLRenderer2D can later consume the same RenderList, group items by material or texture, build buffers, then issue draw calls.",
        liveDemoId: "render-pipeline",
        code: `// Future WebGL path:
// Scene -> RenderPipeline -> RenderList
// RenderList -> Batcher -> Buffer -> Shader -> DrawCall`
      }
    ]
  }
];

