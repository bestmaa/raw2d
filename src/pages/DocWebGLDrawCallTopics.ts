import type { DocTopic } from "./DocPage.type";

export const webGLDrawCallTopics: readonly DocTopic[] = [
  {
    id: "webgl-draw-calls",
    label: "WebGL Draw Calls",
    title: "WebGL Draw Calls",
    description: "Draw calls are the final WebGL commands emitted after Raw2D prepares render lists, batches, buffers, and shaders.",
    sections: [
      {
        title: "What Splits A Draw Call",
        body: "Draw ranges split when Raw2D must change material, texture, shader path, render mode, or preserve scene order boundaries.",
        code: `// Common split points:
// material key changes
// texture key changes
// shape path vs texture path
// static vs dynamic run boundary`
      },
      {
        title: "Read Draw Call Stats",
        body: "drawCalls is the simplest final signal. Compare it with objects and batches to see whether batching is helping.",
        liveDemoId: "webgl-performance",
        code: `webglRenderer.render(scene, camera);

const stats = webglRenderer.getStats();
console.log(stats.objects);
console.log(stats.batches);
console.log(stats.drawCalls);`
      },
      {
        title: "Texture Bind Pressure",
        body: "Sprite-heavy scenes can have low vertex cost but high texture bind pressure. Atlas packing should reduce textureBinds.",
        liveDemoId: "webgl-performance",
        code: `const stats = webglRenderer.getStats();

console.log(stats.textureBinds);
console.log(stats.spriteTextureBindReduction);`
      },
      {
        title: "Static Cache Effect",
        body: "Static cache does not remove draw calls. It reduces repeated buffer upload work for clean static runs.",
        liveDemoId: "webgl-performance",
        code: `const stats = webglRenderer.getStats();

console.log(stats.drawCalls);
console.log(stats.staticCacheHits);
console.log(stats.uploadBufferSubDataCalls);`
      },
      {
        title: "Practical Draw Report",
        body: "Use this report when deciding whether to change object order, atlas packing, material usage, culling, or static mode.",
        liveDemoId: "webgl-performance",
        code: `const stats = webglRenderer.getStats();

console.table({
  objects: stats.objects,
  batches: stats.batches,
  drawCalls: stats.drawCalls,
  textureBinds: stats.textureBinds,
  uploadedBytes: stats.uploadedBytes
});`
      }
    ]
  }
];
