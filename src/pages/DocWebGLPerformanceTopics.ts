import type { DocTopic } from "./DocPage.type";

export const webGLPerformanceTopics: readonly DocTopic[] = [
  {
    id: "webgl-performance",
    label: "WebGL Performance",
    title: "WebGL Performance",
    description: "Use WebGL stats and browser timing to compare draw calls, texture binds, texture uploads, cache reuse, frameMs, and fps.",
    sections: [
      {
        title: "Live Performance Demo",
        body: "The demo builds mostly static atlas sprites plus moving dynamic objects. Canvas is timed once. WebGL warms static cache first, then times the cached render pass.",
        liveDemoId: "webgl-performance",
        code: `const atlas = new TextureAtlasPacker({ padding: 2 }).pack(spriteSources);

tileSprite.setRenderMode("static");
movingObject.setRenderMode("dynamic");

webglRenderer.render(scene, camera); // warm static cache
const start = performance.now();
webglRenderer.render(scene, camera);
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
        title: "Read The Numbers",
        body: "drawCalls counts actual WebGL draw ranges. textureBinds counts texture switches. staticCacheHits shows static runs that skipped vertex upload. frameMs and fps are rolling browser timing estimates.",
        liveDemoId: "webgl-performance",
        code: `const start = performance.now();
webglRenderer.render(scene, camera);
const frameMs = performance.now() - start;
const fps = frameMs > 0 ? 1000 / frameMs : 0;
const stats = webglRenderer.getStats();

console.log(frameMs);
console.log(fps);
console.log(stats.drawCalls);
console.log(stats.textureBinds);
console.log(stats.staticCacheHits);
console.log(stats.uploadedBytes);`
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
