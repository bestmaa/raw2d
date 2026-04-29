import type { DocTopic } from "./DocPage.type";

export const webGLPerformanceTopics: readonly DocTopic[] = [
  {
    id: "webgl-performance",
    label: "WebGL Performance",
    title: "WebGL Performance",
    description: "Use WebGL stats and browser timing to compare culling, draw calls, texture binds, cache reuse, frameMs, and fps.",
    sections: [
      {
        title: "Live Performance Demo",
        body: "The demo builds mostly static atlas sprites plus moving dynamic objects. Toggle culling and static cache to see how the render list, uploads, and draw calls change.",
        liveDemoId: "webgl-performance",
        code: `const atlas = new TextureAtlasPacker({ padding: 2 }).pack(spriteSources);

tileSprite.setRenderMode("static");
movingObject.setRenderMode("dynamic");

webglRenderer.render(scene, camera, { culling: true }); // warm static cache
const start = performance.now();
webglRenderer.render(scene, camera, { culling: true });
const frameMs = performance.now() - start;

console.log({ frameMs, stats: webglRenderer.getStats() });`
      },
      {
        title: "Packed Atlas Mode",
        body: "Packed atlas mode puts many sprite frames into one texture. Consecutive static sprites can use fewer texture binds and one cached static run.",
        liveDemoId: "webgl-performance",
        code: `const atlas = new TextureAtlasPacker().pack([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage }
]);

scene.add(new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle")
}));`
      },
      {
        title: "Separate Texture Mode",
        body: "Separate texture mode intentionally alternates texture objects. This makes textureBinds rise so the atlas benefit is visible.",
        liveDemoId: "webgl-performance",
        code: `scene.add(new Sprite({ texture: idleTexture }));
scene.add(new Sprite({ texture: runTexture }));
scene.add(new Sprite({ texture: idleTexture }));

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textureBinds);`
      },
      {
        title: "Batch-Friendly Sprite Order",
        body: "Raw2D does not reorder the scene automatically. For safe sprite layers, sort by zIndex, renderMode, and texture key before adding sprites to the scene.",
        liveDemoId: "webgl-performance",
        code: `const before = estimateWebGLSpriteTextureBinds({ sprites });
const sortedSprites = sortWebGLSpritesForBatching({ sprites });
const after = estimateWebGLSpriteTextureBinds({ sprites: sortedSprites });

console.log({ before, after });

for (const sprite of sortedSprites) {
  scene.add(sprite);
}`
      },
      {
        title: "Sprite Batch Report",
        body: "Use analyzeWebGLSpriteBatching before changing order. It shows current binds, sorted binds, potential reduction, and per-texture group counts.",
        liveDemoId: "webgl-performance",
        code: `const report = analyzeWebGLSpriteBatching({ sprites });

console.log(report.currentTextureBinds);
console.log(report.sortedTextureBinds);
console.log(report.potentialReduction);
console.log(report.textureGroups);`
      },
      {
        title: "Renderer Sprite Diagnostics",
        body: "After a real render, WebGL stats expose Sprite texture grouping signals directly. Use these numbers to decide whether atlas packing or safe sprite sorting is worth it.",
        liveDemoId: "webgl-performance",
        code: `webglRenderer.render(scene, camera);
const stats = webglRenderer.getStats();

console.log(stats.spriteBatches);
console.log(stats.spriteTextureBinds);
console.log(stats.sortedSpriteTextureBinds);
console.log(stats.spriteTextureBindReduction);
console.log(stats.skippedSpriteTextures);`
      },
      {
        title: "Read The Numbers",
        body: "objects is accepted render-list items after visibility, filters, and culling. renderList.total is the scene candidate count. culled shows camera-culling wins.",
        liveDemoId: "webgl-performance",
        code: `webglRenderer.render(scene, camera, { culling: true });
const stats = webglRenderer.getStats();

console.log(stats.renderList.total);
console.log(stats.renderList.culled);
console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.batches);
console.log(stats.textureBinds);
console.log(stats.spriteTextureBindReduction);
console.log(stats.staticCacheHits);
console.log(stats.uploadedBytes);`
      },
      {
        title: "Stats Categories",
        body: "Read stats in groups: render-list stats explain scene traversal, batch stats explain draw work, texture stats explain GPU texture work, and upload stats explain buffer churn.",
        liveDemoId: "webgl-performance",
        code: `webglRenderer.render(scene, camera, { culling: true });
const stats = webglRenderer.getStats();

console.log(stats.renderList);
console.log(stats.drawCalls, stats.batches, stats.vertices);
console.log(stats.textureBinds, stats.textureUploads);
console.log(stats.spriteTextureBinds, stats.sortedSpriteTextureBinds);
console.log(stats.textTextureCacheHits, stats.textTextureCacheMisses);
console.log(stats.uploadBufferDataCalls, stats.uploadBufferSubDataCalls);
console.log(stats.uploadedBytes);`
      },
      {
        title: "Culling Toggle",
        body: "Culling skips objects outside the camera world bounds before batching. Turn it off when debugging missing objects, then turn it on for large scenes.",
        liveDemoId: "webgl-performance",
        code: `renderer.render(scene, camera, { culling: true });
console.log(renderer.getStats().renderList);

renderer.render(scene, camera, { culling: false });
console.log(renderer.getStats().renderList);`
      },
      {
        title: "Timing Is Approximate",
        body: "Browser frame timing depends on tab focus, GPU driver, display refresh, devtools, and other work on the page. Use it for relative comparisons, not final benchmarks.",
        liveDemoId: "webgl-performance",
        code: `const samples: number[] = [];

function recordFrame(frameMs: number): number {
  samples.push(frameMs);
  if (samples.length > 60) samples.shift();
  return samples.reduce((sum, value) => sum + value, 0) / samples.length;
}`
      }
    ]
  }
];
