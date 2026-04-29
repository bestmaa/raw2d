# Asset Loading

Raw2D keeps image loading explicit. The sprite package loads browser image sources, wraps them in `Texture`, and leaves rendering to Canvas or WebGL.

Use this flow when a project needs images, sprites, atlases, or sprite animation.

## TextureLoader

`TextureLoader` loads a URL into a `Texture`:

```ts
import { TextureLoader } from "raw2d";

const texture = await new TextureLoader({
  cache: true,
  crossOrigin: "anonymous"
}).load("/sprites/player.png");
```

`cache: true` reuses the same loading promise for the same URL and cross-origin setting. Failed loads are removed from cache so a later retry can work.

## Load And Render A Sprite

```ts
import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const renderer = new Canvas({ canvas: canvasElement });
const scene = new Scene();
const camera = new Camera2D();

const texture = await new TextureLoader({ cache: true }).load("/sprites/player.png");

scene.add(new Sprite({
  texture,
  x: 120,
  y: 80,
  origin: "center"
}));

renderer.render(scene, camera);
```

The same `Texture` works in Canvas and WebGL. The renderer decides how to draw or upload it.

## Existing Sources

Use `fromSource()` when you already have a browser image-like source:

```ts
const texture = new TextureLoader().fromSource(canvasSource, {
  id: "generated-minimap",
  url: "memory://minimap"
});
```

Supported sources are normal `CanvasImageSource` values such as `HTMLImageElement`, `HTMLCanvasElement`, `ImageBitmap`, `OffscreenCanvas`, and video-like sources.

## ImageBitmap Mode

Use `imageBitmap: true` when the browser should convert loaded images to `ImageBitmap` before the texture is created:

```ts
const texture = await new TextureLoader({
  imageBitmap: true,
  imageBitmapOptions: { premultiplyAlpha: "premultiply" }
}).load("/sprites/player.png");
```

This can help image upload paths in some browsers. Keep it optional because support depends on the runtime.

## Cache Lifecycle

```ts
const loader = new TextureLoader({ cache: true });

const first = await loader.load("/sprites/player.png");
const second = await loader.load("/sprites/player.png");

console.log(first === second);
// true

loader.deleteFromCache("/sprites/player.png");
loader.clearCache();
loader.dispose();
```

TextureLoader cache stores load promises. It does not delete WebGL GPU textures. Use `webglRenderer.clearTextureCache()` or renderer `dispose()` for GPU cleanup.

## Texture Lifecycle

```ts
const texture = await new TextureLoader().load("/sprites/player.png");

console.log(texture.getSnapshot());
console.log(texture.getStatus());

texture.dispose();
```

`Texture.dispose()` marks the texture as disposed and calls `close()` on closeable sources such as `ImageBitmap`. Disposed Sprite textures are skipped by Canvas and WebGL renderers.

Do not dispose a texture while a Sprite still needs it. Remove the Sprite, replace its texture, or accept that it will no longer render.

## WebGL GPU Cleanup

Texture source cleanup and GPU cleanup are separate:

```ts
texture.dispose();                 // source lifecycle
webglRenderer.clearTextureCache(); // GPU texture lifecycle
```

WebGL also releases a cached GPU texture when a disposed Sprite texture is still found during render. Use `clearTextureCache()` when unloading a whole asset pack.

## Asset Pack Cleanup Pattern

Keep loaded textures in one small owner so unload is explicit:

```ts
const loader = new TextureLoader({ cache: true });
const textures = [
  await loader.load("/sprites/player.png"),
  await loader.load("/sprites/enemy.png")
];

function unloadLevelAssets(): void {
  for (const texture of textures) {
    texture.dispose();
  }

  loader.clearCache();
  webglRenderer.clearTextureCache();
}
```

This pattern keeps Raw2D low-level: the app owns asset lifetime, and the renderer owns GPU resource lifetime.

## AssetGroupLoader

Use `AssetGroupLoader` when a screen, level, or document needs several textures and atlases before it starts:

```ts
import { AssetGroupLoader } from "raw2d";

const assets = await new AssetGroupLoader().load({
  player: "/sprites/player.png",
  enemy: { type: "texture", url: "/sprites/enemy.png" },
  playerAtlas: { type: "atlas", url: "/sprites/player.atlas.json" }
});

const playerTexture = assets.getTexture("player");
const playerAtlas = assets.getAtlas("playerAtlas");
```

String entries are shorthand for `{ type: "texture", url }`. Atlas entries use `TextureAtlasLoader` internally.

## Loading Progress

```ts
const assets = await new AssetGroupLoader().load(manifest, {
  onProgress: (event) => {
    const percent = Math.round((event.loaded / event.total) * 100);
    console.log(percent, event.name, event.status);
  }
});
```

The progress event reports the asset name, kind, loaded count, total count, and whether that asset loaded or failed.

## Failed Assets

By default, the group loader rejects when any asset fails. Use `failFast: false` when the app should continue and inspect missing assets later:

```ts
const assets = await new AssetGroupLoader({
  failFast: false
}).load(manifest);

if (assets.hasError("player")) {
  console.error(assets.getError("player"));
}
```

This is useful for editors and tools where one missing optional image should not block the whole document.

## AssetGroup Unload

`AssetGroup.dispose()` disposes all unique textures owned by the group, including atlas textures:

```ts
assets.dispose();
loader.clearCache();
webglRenderer.clearTextureCache();
```

This gives one clear place to unload a level, document, or asset pack.

## TextureAtlasLoader

Atlas JSON format:

```json
{
  "image": "player.png",
  "frames": {
    "idle1": { "x": 0, "y": 0, "width": 32, "height": 32 },
    "idle2": { "x": 32, "y": 0, "width": 32, "height": 32 }
  }
}
```

Load it:

```ts
import { TextureAtlasLoader } from "raw2d";

const atlas = await new TextureAtlasLoader({
  cache: true
}).load("/sprites/player.atlas.json");
```

The `image` path is resolved from the atlas JSON file location, so `player.png` above resolves beside `player.atlas.json`.

## Animation Clip From Names

```ts
import { createSpriteAnimationClip } from "raw2d";

const idleClip = createSpriteAnimationClip({
  atlas,
  frameNames: ["idle1", "idle2"],
  fps: 12,
  loop: true,
  name: "idle"
});
```

This keeps docs and app code readable because animation clips can reference frame names instead of copying rectangles.

Raw2D loads assets and updates frames, but the app still owns the render loop.
