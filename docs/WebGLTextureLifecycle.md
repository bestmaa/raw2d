# WebGL Texture Lifecycle

WebGL textures and buffers live on the GPU. JavaScript garbage collection does not immediately free those GPU resources, so long-running editors and games should clear renderer caches when assets change and dispose renderers when a canvas is removed.

## Texture Cache

`WebGLRenderer2D` uploads each `Texture` object once, then reuses the same `WebGLTexture` on later renders:

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().textureUploads);
// 1

renderer.render(scene, camera);
console.log(renderer.getStats().textureCacheHits);
// 1
```

Use `getTextureCacheSize()` to inspect how many uploaded GPU textures are currently cached:

```ts
console.log(renderer.getTextureCacheSize());
```

## Text Texture Cache

`Text2D` is rasterized to a small canvas texture before WebGL draws it. The cache key includes only visual text data: text, font, alignment, baseline, and fill color. Moving, rotating, or scaling a text object reuses the same text texture.

```ts
const renderer = new WebGLRenderer2D({
  canvas,
  textTextureCacheMaxEntries: 128
});

console.log(renderer.getTextTextureCacheSize());
```

Changing text, font, alignment, baseline, or fill color retires the old text texture so the matching GPU texture can be deleted.

```ts
renderer.render(scene, camera);
console.log(renderer.getStats().textTextureCacheMisses);

label.x += 20;
renderer.render(scene, camera);
console.log(renderer.getStats().textTextureCacheHits);
```

## Clear Caches

Use `clearTextureCache()` when a level, document, or asset pack is unloaded but the renderer will continue to be used:

```ts
renderer.clearTextureCache();

console.log(renderer.getTextureCacheSize());
// 0
```

This clears sprite texture uploads and rasterized text texture entries. The next render uploads only the textures that are still visible.

## Disposed Textures

`texture.dispose()` and WebGL cache cleanup are separate. Disposing a Texture closes the source when possible and marks it as unavailable. WebGL skips Sprites that reference disposed textures.

```ts
texture.dispose();
renderer.render(scene, camera);
```

If the disposed Texture was already uploaded, WebGL releases that cached GPU texture when it sees the disposed Sprite texture during render. Use `clearTextureCache()` when unloading a whole asset pack.

## Dispose Renderer

Use `dispose()` when the canvas or renderer is no longer needed:

```ts
renderer.dispose();
```

`dispose()` releases static batch buffers, dynamic upload buffers, cached textures, text texture entries, and shader programs. Create a new renderer after disposal.

## Why This Matters

Editors often load and unload many images, labels, and scenes. Without explicit cleanup, old GPU textures can stay allocated longer than expected. Raw2D keeps this visible instead of hiding it, so engine builders can decide when memory should be released.
