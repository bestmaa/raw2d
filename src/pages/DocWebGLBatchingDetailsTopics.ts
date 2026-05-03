import type { DocTopic } from "./DocPage.type";

export const webGLBatchingDetailsTopics: readonly DocTopic[] = [
  {
    id: "webgl-batching-details",
    label: "WebGL Batching Details",
    title: "WebGL Batching Details",
    description: "Use this page to connect ShapePath fallback, static/dynamic render modes, and texture bind reduction to the final WebGL stats.",
    sections: [
      {
        title: "ShapePath Fallback",
        body: "Raw2D draws simple closed ShapePath fills as geometry. Complex fills can opt into a rasterized texture fallback so the renderer stays explicit.",
        liveDemoId: "webgl-renderer",
        code: `const renderer = new WebGLRenderer2D({
  canvas,
  shapePathFillFallback: "rasterize",
  onShapePathFillFallback: (fallback) => {
    console.log(fallback.object.id, fallback.reason);
  }
});

renderer.render(scene, camera);
console.log(renderer.getStats().shapePathUnsupportedFills);`
      },
      {
        title: "Static And Dynamic Batches",
        body: "Static objects keep their GPU uploaders while their version stays unchanged. Dynamic objects rebuild each frame. This reduces upload work, not scene ownership.",
        liveDemoId: "webgl-performance",
        code: `backgroundTile.setRenderMode("static");
player.setRenderMode("dynamic");

renderer.render(scene, camera);
renderer.render(scene, camera);

const stats = renderer.getStats();
console.log(stats.staticCacheHits);
console.log(stats.uploadBufferSubDataCalls);`
      },
      {
        title: "Texture Bind Reduction",
        body: "Atlas packing and safe sprite sorting reduce texture changes. Compare spriteTextureBinds with sortedSpriteTextureBinds before changing scene order.",
        liveDemoId: "webgl-performance",
        code: `renderer.render(scene, camera, {
  spriteSorting: "texture"
});

const stats = renderer.getStats();
console.log(stats.spriteTextureBinds);
console.log(stats.sortedSpriteTextureBinds);
console.log(stats.spriteTextureBindReduction);`
      },
      {
        title: "Debug Checklist",
        body: "When WebGL feels slow, inspect stats in order: accepted objects, batches, draw calls, texture binds, upload calls, then fallback counts.",
        liveDemoId: "webgl-performance",
        code: `const stats = renderer.getStats();

console.table({
  objects: stats.objects,
  batches: stats.batches,
  drawCalls: stats.drawCalls,
  textureBinds: stats.textureBinds,
  uploads: stats.uploadBufferSubDataCalls,
  fallbackFills: stats.shapePathUnsupportedFills
});`
      }
    ]
  }
];
