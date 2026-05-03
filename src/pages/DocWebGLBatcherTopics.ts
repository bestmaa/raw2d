import type { DocTopic } from "./DocPage.type";

export const webGLBatcherTopics: readonly DocTopic[] = [
  {
    id: "webgl-batchers",
    label: "WebGL Batchers",
    title: "WebGL Batchers",
    description: "Batchers turn ordered RenderList items into fewer WebGL buffer uploads and draw ranges.",
    sections: [
      {
        title: "What A Batcher Does",
        body: "A batcher does not change scene data. It groups already ordered render items when their WebGL path is compatible.",
        code: `// RenderList keeps order.
// Batcher groups compatible adjacent items.
// Renderer still respects zIndex, renderMode, and texture boundaries.`
      },
      {
        title: "Create Render Runs",
        body: "WebGL first splits flat RenderList items by kind and renderMode. Shape, texture, static, and dynamic runs stay explicit.",
        liveDemoId: "webgl-performance",
        code: `import { createWebGLRenderRuns, getWebGLRenderRunKind } from "raw2d-webgl";

const runs = createWebGLRenderRuns(
  renderList.getFlatItems(),
  getWebGLRenderRunKind
);

console.log(runs.map((run) => [run.kind, run.mode, run.items.length]));`
      },
      {
        title: "Shape Batches",
        body: "Shape batches group compatible material keys. Rects, circles, lines, polygons, arcs, and simple ShapePath geometry share this path.",
        liveDemoId: "webgl-renderer",
        code: `webglRenderer.render(scene, camera);

const stats = webglRenderer.getStats();
console.log(stats.batches);
console.log(stats.drawCalls);`
      },
      {
        title: "Texture Batches",
        body: "Sprite and rasterized Text2D batches group by texture key. Atlas packing helps because many sprites can share one texture key.",
        liveDemoId: "webgl-performance",
        code: `webglRenderer.render(spriteScene, camera);

const stats = webglRenderer.getStats();
console.log(stats.spriteTextureBinds);
console.log(stats.spriteTextureBindReduction);`
      },
      {
        title: "Static And Dynamic Runs",
        body: "Static runs can be cached after first upload. Dynamic runs are rebuilt every frame so animation and interaction stay simple.",
        liveDemoId: "webgl-performance",
        code: `background.setRenderMode("static");
player.setRenderMode("dynamic");

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().staticCacheHits);`
      },
      {
        title: "Practical Batch Report",
        body: "Use this small report when tuning a scene. It explains whether object order, atlas packing, or static mode is helping.",
        liveDemoId: "webgl-performance",
        code: `const stats = webglRenderer.getStats();

console.table({
  objects: stats.objects,
  batches: stats.batches,
  drawCalls: stats.drawCalls,
  textureBinds: stats.textureBinds,
  staticCacheHits: stats.staticCacheHits
});`
      }
    ]
  }
];
