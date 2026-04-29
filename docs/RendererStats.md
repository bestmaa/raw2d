# Renderer Stats

`getStats()` returns the last render pass numbers. Canvas and WebGL both expose the base renderer stats, while WebGL adds batching, texture, text-cache, and upload details.

Use stats for debugging and relative comparisons. They are not a replacement for browser performance tools.

## Canvas Stats

Canvas returns the base renderer fields:

```ts
raw2dCanvas.render(scene, camera, { culling: true });

const stats = raw2dCanvas.getStats();

console.log(stats.objects);
console.log(stats.drawCalls);
console.log(stats.renderList);
```

- `objects`: accepted render-list objects after visibility, filters, and culling
- `drawCalls`: Canvas draw operations tracked by Raw2D
- `renderList`: scene traversal counts

## Render List Stats

`renderList` explains what entered the renderer:

```ts
const stats = renderer.getStats();

console.log(stats.renderList.total);
console.log(stats.renderList.accepted);
console.log(stats.renderList.hidden);
console.log(stats.renderList.filtered);
console.log(stats.renderList.culled);
```

- `total`: candidate objects checked
- `accepted`: objects allowed into rendering
- `hidden`: invisible objects skipped
- `filtered`: objects skipped by renderer filters
- `culled`: objects outside the camera view

## WebGL Batch Stats

WebGL adds batch and draw-call details:

```ts
webglRenderer.render(scene, camera, { culling: true });

const stats = webglRenderer.getStats();

console.log(stats.batches);
console.log(stats.drawCalls);
console.log(stats.vertices);
```

- `batches`: compatible object groups built by the batcher
- `drawCalls`: WebGL draw ranges submitted
- `vertices`: vertex count written for the frame

If `drawCalls` is close to `objects`, check scene order, texture usage, and material compatibility.

## Texture Stats

Sprite-heavy scenes should watch texture numbers:

```ts
const stats = webglRenderer.getStats();

console.log(stats.textures);
console.log(stats.textureBinds);
console.log(stats.textureUploads);
console.log(stats.textureCacheHits);
console.log(stats.spriteTextureBindReduction);
```

- `textures`: unique textures used in the frame
- `textureBinds`: texture switches during drawing
- `textureUploads`: new texture uploads this frame
- `textureCacheHits`: reused GPU texture records
- `spriteTextureGroups`: unique Sprite texture groups in the frame
- `spriteTextureBinds`: Sprite-only binds in current scene order
- `sortedSpriteTextureBinds`: estimated Sprite binds after batch-friendly sorting
- `spriteTextureBindReduction`: possible bind reduction for safe reorderable Sprite layers
- `skippedSpriteTextures`: Sprites skipped because their texture is disposed

High `textureBinds` usually means sprites are not grouped by atlas or texture.

`textureBinds` includes all texture pipeline draws, including `Text2D`. Use `spriteTextureBinds` when you only want Sprite texture diagnostics.

## Text Texture Stats

WebGL renders `Text2D` through cached text textures:

```ts
const stats = webglRenderer.getStats();

console.log(stats.textTextures);
console.log(stats.textTextureCacheHits);
console.log(stats.textTextureCacheMisses);
console.log(stats.textTextureEvictions);
console.log(stats.retiredTextTextures);
```

- `textTextures`: text texture records used this frame
- `textTextureCacheHits`: reused text texture entries
- `textTextureCacheMisses`: text/style changes that needed new texture entries
- `textTextureEvictions`: old entries removed from the text texture cache
- `retiredTextTextures`: old GPU text textures waiting for cleanup

If misses stay high every frame, the text content or style is changing too often.

## Static Cache Stats

Static batches are useful for map tiles, background sprites, and stable decoration:

```ts
staticSprite.setRenderMode("static");

webglRenderer.render(scene, camera); // warm cache
webglRenderer.render(scene, camera);

const stats = webglRenderer.getStats();

console.log(stats.staticBatches);
console.log(stats.dynamicBatches);
console.log(stats.staticSpriteBatches);
console.log(stats.dynamicSpriteBatches);
console.log(stats.staticCacheHits);
console.log(stats.staticCacheMisses);
```

- `staticBatches`: cached static groups
- `dynamicBatches`: rebuilt dynamic groups
- `staticObjects`: static objects accepted this frame
- `dynamicObjects`: dynamic objects accepted this frame
- `staticSprites`: static Sprites rendered this frame
- `dynamicSprites`: dynamic Sprites rendered this frame
- `spriteBatches`: texture-pipeline draw batches for Sprite/Text2D rendering
- `staticSpriteBatches`: static texture-pipeline batches
- `dynamicSpriteBatches`: dynamic texture-pipeline batches
- `staticCacheHits`: static runs reused without rebuilding
- `staticCacheMisses`: static runs rebuilt because their version changed

## Upload Stats

Upload stats show GPU buffer churn:

```ts
const stats = webglRenderer.getStats();

console.log(stats.uploadBufferDataCalls);
console.log(stats.uploadBufferSubDataCalls);
console.log(stats.uploadedBytes);
```

- `uploadBufferDataCalls`: full buffer uploads
- `uploadBufferSubDataCalls`: partial buffer uploads
- `uploadedBytes`: vertex bytes uploaded this frame

High `uploadedBytes` on unchanged scenes usually means objects are dynamic or a static object is being mutated.

## Coverage Stats

Coverage stats show which object paths were rendered or skipped:

```ts
const stats = webglRenderer.getStats();

console.log(stats.rects);
console.log(stats.sprites);
console.log(stats.shapePaths);
console.log(stats.shapePathUnsupportedFills);
console.log(stats.unsupported);
```

- shape counters show how many objects of each type were processed
- `shapePathUnsupportedFills` tracks closed path fills WebGL could not batch
- `unsupported` tracks objects this renderer could not draw
