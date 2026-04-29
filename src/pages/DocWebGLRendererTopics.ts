import type { DocTopic } from "./DocPage.type";

export const webGLRendererTopics: readonly DocTopic[] = [
  {
    id: "webgl-renderer",
    label: "WebGLRenderer2D",
    title: "WebGLRenderer2D",
    description: "WebGLRenderer2D renders primitives, Sprites, and rasterized Text2D through WebGL2 using explicit ordered batches.",
    sections: [
      {
        title: "First Working Scope",
        body: "WebGLRenderer2D renders Rect, Circle, Ellipse, Line, Polyline, simple Polygon, Sprite, and Text2D objects. Text2D is rasterized to a texture first.",
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
        title: "Text2D Texture Path",
        body: "Text2D stays an object-data class. WebGLRenderer2D rasterizes fill and optional stroke text to a small canvas texture, then draws that texture through the same ordered texture batch path as Sprites.",
        code: `import { BasicMaterial, Camera2D, Scene, Text2D, WebGLRenderer2D } from "raw2d";

const label = new Text2D({
  x: 80,
  y: 90,
  text: "GPU label",
  font: "28px sans-serif",
  material: new BasicMaterial({
    fillColor: "#f5f7fb",
    strokeColor: "#10141c",
    lineWidth: 3
  })
});

scene.add(label);
webglRenderer.render(scene, new Camera2D());`
      },
      {
        title: "Text Texture Cache",
        body: "Text texture cache keys use visual text and material data. Moving, rotating, or scaling Text2D reuses the raster texture; changing text, font, alignment, baseline, fill color, stroke color, or line width rebuilds it.",
        code: `webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textTextureCacheMisses);

label.x += 20;
webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textTextureCacheHits);`
      },
      {
        title: "Sprite Texture Batch",
        body: "Sprites use a separate textured shader path. Consecutive Sprites using the same Texture are merged into one texture draw batch while render order stays stable.",
        liveDemoId: "webgl-renderer",
        code: `import { Sprite, Texture, WebGLRenderer2D } from "raw2d";

const texture = new Texture({
  source: imageElement,
  width: imageElement.naturalWidth,
  height: imageElement.naturalHeight
});

scene.add(new Sprite({
  texture,
  x: 40,
  y: 40,
  width: 64,
  height: 64
}));

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textures);`
      },
      {
        title: "Batch Stats",
        body: "Visible shapes are written into shape buffers. Visible Sprites are written into sprite buffers. Consecutive compatible items are merged by material key or texture key. Static cache fields show whether static run uploads were reused.",
        liveDemoId: "webgl-renderer",
        code: `renderer.render(scene, camera);

console.log(renderer.getStats());

// {
//   objects: 1000,
//   drawCalls: 600,
//   batches: 600,
//   textureBinds: 142,
//   textTextureCacheHits: 20,
//   textTextureCacheMisses: 1,
//   uploadedBytes: 792000,
//   staticCacheHits: 0,
//   unsupported: 0
// }`
      },
      {
        title: "Texture Stats",
        body: "Texture stats show how much texture work happened this frame. Packed atlas sprites should use fewer texture binds and uploads than separate image textures.",
        liveDemoId: "webgl-renderer",
        code: `webglRenderer.render(sceneWithSeparateTextures, camera);
console.log(webglRenderer.getStats());
// { textures: 3, textureBinds: 3, textureUploads: 3 }

webglRenderer.render(sceneWithPackedAtlas, camera);
console.log(webglRenderer.getStats());
// { textures: 1, textureBinds: 1, textureUploads: 1 }`
      },
      {
        title: "Texture Cache Hits",
        body: "After upload, later frames reuse cached WebGLTexture objects. Clear caches when assets unload; dispose the renderer when the canvas is removed.",
        liveDemoId: "webgl-renderer",
        code: `webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textureUploads);
// 1

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textureCacheHits);
// 1
webglRenderer.clearTextureCache();
console.log(webglRenderer.getTextureCacheSize());
// 0
webglRenderer.dispose();`
      },
      {
        title: "Canvas Comparison",
        body: "Canvas supports the full object set and draws through Canvas APIs. WebGL supports the high-volume path first and groups supported shapes and Sprites into ordered draw ranges.",
        liveDemoId: "webgl-renderer",
        code: `canvasRenderer.render(scene, camera);
console.log(canvasRenderer.getStats());
// { objects: 1000, drawCalls: 1000 }

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());
// { objects: 1000, batches: 600, staticBatches: 300, dynamicBatches: 300 }`
      },
      {
        title: "Static / Dynamic Runs",
        body: "Set renderMode when you know whether an object is stable or changing often. WebGL splits runs by mode and caches clean static runs after their first upload.",
        liveDemoId: "webgl-renderer",
        code: `background.setRenderMode("static");
player.setRenderMode("dynamic");

webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats().staticBatches);
console.log(webglRenderer.getStats().dynamicBatches);`
      },
      {
        title: "Static Cache Hits",
        body: "The first static render run is a cache miss because the batch must be uploaded. Rendering the same clean static run again becomes a hit and skips vertex upload for that run.",
        liveDemoId: "webgl-renderer",
        code: `background.setRenderMode("static");

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().staticCacheMisses);
// 1

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().staticCacheHits);
// 1`
      },
      {
        title: "Static Cache Invalidation",
        body: "Object versions, material versions, sprite textures, camera state, and viewport size are part of the static cache key. A change rebuilds only the affected static run.",
        code: `background.setRenderMode("static");

webglRenderer.render(scene, camera);
webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().staticCacheHits);
// 1

background.setSize(900, 600);

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().staticCacheMisses);
// 1`
      },
      {
        title: "Static Sprites",
        body: "Use static mode for tile maps, background sprites, and decoration. A clean static Sprite skips vertex upload on later renders, while texture cache stats still show texture reuse.",
        liveDemoId: "webgl-renderer",
        code: `tileSprite.setRenderMode("static");

webglRenderer.render(scene, camera);
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats().staticCacheHits);
// 1

console.log(webglRenderer.getStats().uploadBufferSubDataCalls);
// 0`
      },
      {
        title: "Animated Sprites Stay Dynamic",
        body: "Sprite frame changes invalidate static cache. Keep frequently animated sprites dynamic so the renderer uses the normal update path.",
        liveDemoId: "sprite-animation",
        code: `tileSprite.setFrame(atlas.getFrame("grass-alt"));
webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().staticCacheMisses);
// 1

playerSprite.setRenderMode("dynamic");`
      },
      {
        title: "GPU Buffer Uploads",
        body: "WebGLRenderer2D reuses GPU buffer capacity. A larger frame uses bufferData to grow storage; later frames that fit use bufferSubData to update existing storage.",
        liveDemoId: "webgl-renderer",
        code: `webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().uploadBufferDataCalls);
// 1

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().uploadBufferSubDataCalls);
// 1`
      },
      {
        title: "Ordered Runs",
        body: "Raw2D keeps render order stable. Material and texture grouping only merge consecutive compatible objects. A Sprite between two shapes intentionally starts a new shape run.",
        liveDemoId: "webgl-renderer",
        code: `scene.add(new Rect({ material: blue }));
scene.add(new Circle({ material: blue }));

// Sprite uses the texture path, so it starts a texture run.
scene.add(new Sprite({ texture }));

// Shape drawing resumes as a new shape run.
scene.add(new Line({ material: yellowStroke }));`
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
