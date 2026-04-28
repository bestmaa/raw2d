import type { DocTopic } from "./DocPage.type";

export const webGLPerformanceTopics: readonly DocTopic[] = [
  {
    id: "webgl-performance",
    label: "WebGL Performance",
    title: "WebGL Performance",
    description: "Use WebGL stats to compare draw calls, texture binds, texture uploads, and static cache reuse.",
    sections: [
      {
        title: "Live Performance Demo",
        body: "The demo builds one scene with mostly static atlas sprites plus dynamic objects. WebGL renders twice so the second frame shows static cache hits.",
        liveDemoId: "webgl-performance",
        code: `const atlas = new TextureAtlasPacker({ padding: 2 }).pack(spriteSources);

tileSprite.setRenderMode("static");
movingObject.setRenderMode("dynamic");

webglRenderer.render(scene, camera);
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats());`
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
        body: "drawCalls counts actual WebGL draw ranges. textureBinds counts texture switches. staticCacheHits shows static runs that skipped vertex upload.",
        liveDemoId: "webgl-performance",
        code: `const stats = webglRenderer.getStats();

console.log(stats.drawCalls);
console.log(stats.textureBinds);
console.log(stats.staticCacheHits);
console.log(stats.uploadedBytes);`
      }
    ]
  }
];
