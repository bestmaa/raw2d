# WebGL Performance

Raw2D exposes WebGL performance numbers instead of hiding the pipeline.

Use these stats to understand whether batching is helping:

- `frameMs`: browser-side render timing for one measured render pass
- `fps`: `1000 / frameMs`, usually averaged across recent frames
- `objects`: render-list items accepted after visibility, filters, and culling
- `renderList.total`: scene candidates checked by the renderer
- `renderList.culled`: candidates skipped because they are outside the camera view
- `batches`: compatible object groups sent through the batcher
- `drawCalls`: actual WebGL draw ranges
- `textureBinds`: texture bind operations for sprite batches
- `spriteTextureBinds`: Sprite-only texture binds in current scene order
- `sortedSpriteTextureBinds`: estimated Sprite binds after batch-friendly sorting
- `spriteTextureBindReduction`: possible bind reduction for safe reorderable Sprite layers
- `textureUploads`: new texture uploads this frame
- `textureCacheHits`: reused WebGL textures
- `textTextureCacheHits`: reused cached `Text2D` textures
- `textTextureCacheMisses`: `Text2D` entries created this frame
- `staticCacheHits`: static runs that reused cached vertex buffers
- `uploadBufferDataCalls`: full vertex-buffer uploads
- `uploadBufferSubDataCalls`: partial vertex-buffer uploads
- `uploadedBytes`: vertex bytes uploaded this frame

For the complete field reference, see `docs/RendererStats.md`.

## Practical Setup

```ts
import { Camera2D, Scene, Sprite, TextureAtlasPacker, WebGLRenderer2D } from "raw2d";

const atlas = new TextureAtlasPacker({ padding: 2 }).pack([
  { name: "grass", source: grassImage },
  { name: "stone", source: stoneImage }
]);

const scene = new Scene();
const camera = new Camera2D();
const renderer = new WebGLRenderer2D({ canvas: canvasElement });

const tile = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("grass"),
  x: 0,
  y: 0
});

tile.setRenderMode("static");
scene.add(tile);
```

Render twice when checking static cache behavior:

```ts
renderer.render(scene, camera);
renderer.render(scene, camera);

console.log(renderer.getStats().staticCacheHits);
// 1
```

## Culling

Culling removes off-camera objects before the batcher works. This is useful for large maps and editor scenes:

```ts
renderer.render(scene, camera, { culling: true });

const stats = renderer.getStats();

console.log(stats.renderList.total);
console.log(stats.renderList.culled);
console.log(stats.objects);
```

Turn culling off when debugging visibility:

```ts
renderer.render(scene, camera, { culling: false });
```

## Canvas vs WebGL Timing

Use browser timing when you want a quick relative check between Canvas and WebGL. Keep app logic outside the measured section when you only want renderer cost:

```ts
const canvasStart = performance.now();
canvasRenderer.render(scene, camera, { culling: true });
const canvasFrameMs = performance.now() - canvasStart;

renderer.render(scene, camera, { culling: true }); // warm static cache
const webglStart = performance.now();
renderer.render(scene, camera, { culling: true });
const webglFrameMs = performance.now() - webglStart;

console.log({
  canvasFrameMs,
  canvasFps: 1000 / canvasFrameMs,
  webglFrameMs,
  webglFps: 1000 / webglFrameMs
});
```

## Stats Categories

Read stats in groups so the numbers point to the right system:

```ts
renderer.render(scene, camera, { culling: true });

const stats = renderer.getStats();

console.log(stats.renderList);
console.log(stats.drawCalls, stats.batches, stats.vertices);
console.log(stats.textureBinds, stats.textureUploads);
console.log(stats.spriteTextureBinds, stats.sortedSpriteTextureBinds);
console.log(stats.spriteTextureBindReduction);
console.log(stats.textTextureCacheHits, stats.textTextureCacheMisses);
console.log(stats.uploadBufferDataCalls, stats.uploadBufferSubDataCalls);
console.log(stats.uploadedBytes);
```

- render-list stats explain scene traversal
- batch stats explain draw work
- texture stats explain GPU texture work
- upload stats explain buffer churn

For smoother display numbers, keep a rolling average over the last 60 frames:

```ts
const samples: number[] = [];

function recordFrame(frameMs: number): number {
  samples.push(frameMs);

  if (samples.length > 60) {
    samples.shift();
  }

  return samples.reduce((sum, value) => sum + value, 0) / samples.length;
}
```

These numbers are approximate. Browser timing changes with tab focus, display refresh rate, GPU driver, devtools, background tasks, and the rest of your app. Use this timing to compare approaches in the same page, then use browser performance tools for final profiling.

## Packed Atlas vs Separate Textures

Packed atlas sprites share one texture:

```ts
scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("grass") }));
scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("stone") }));

renderer.render(scene, camera);
console.log(renderer.getStats().textureBinds);
// 1
```

Separate textures can require more binds:

```ts
scene.add(new Sprite({ texture: grassTexture }));
scene.add(new Sprite({ texture: stoneTexture }));

renderer.render(scene, camera);
console.log(renderer.getStats().textureBinds);
// 2
```

## Batch-Friendly Sprite Order

Raw2D does not reorder the scene automatically. For safe sprite layers, compare and sort explicitly:

```ts
const before = estimateWebGLSpriteTextureBinds({ sprites });
const sortedSprites = sortWebGLSpritesForBatching({ sprites });
const after = estimateWebGLSpriteTextureBinds({ sprites: sortedSprites });

console.log({ before, after });
```

For a fuller pre-render report:

```ts
const report = analyzeWebGLSpriteBatching({ sprites });

console.log(report.currentTextureBinds);
console.log(report.sortedTextureBinds);
console.log(report.potentialReduction);
```

Use this for tile maps, particles, or background layers where reordering does not break visual stacking. For overlapping gameplay sprites, keep explicit `zIndex` and scene order.

After a real render, the renderer exposes the same idea through stats:

```ts
renderer.render(scene, camera);

const stats = renderer.getStats();

console.log(stats.spriteTextureBinds);
console.log(stats.sortedSpriteTextureBinds);
console.log(stats.spriteTextureBindReduction);
console.log(stats.skippedSpriteTextures);
```

When the layer is safe to reorder, enable explicit texture sorting:

```ts
renderer.render(scene, camera, {
  culling: true,
  spriteSorting: "texture"
});
```

The default is `"none"` because texture sorting can change visual stacking for overlapping sprites.

## Static And Dynamic Split

Use static mode for stable objects:

```ts
backgroundTile.setRenderMode("static");
mapDecoration.setRenderMode("static");
```

Use dynamic mode for animated or moving objects:

```ts
playerSprite.setRenderMode("dynamic");
projectile.setRenderMode("dynamic");
```

Static mode is a performance hint. It does not lock the object. If a static Sprite frame changes, Raw2D rebuilds that cached run.

## Reading Results

Good signs:

- packed atlas has lower `textureBinds`
- second render has higher `staticCacheHits`
- unchanged static runs have `uploadedBytes` near zero
- culling makes `renderList.culled` rise when objects leave the camera view
- `drawCalls` is lower than total object count

If `drawCalls` is close to `objects`, check scene order. Raw2D only batches consecutive compatible objects so render order stays predictable.
