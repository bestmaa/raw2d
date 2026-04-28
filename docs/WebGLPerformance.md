# WebGL Performance

Raw2D exposes WebGL performance numbers instead of hiding the pipeline.

Use these stats to understand whether batching is helping:

- `drawCalls`: actual WebGL draw ranges
- `textureBinds`: texture bind operations for sprite batches
- `textureUploads`: new texture uploads this frame
- `textureCacheHits`: reused WebGL textures
- `staticCacheHits`: static runs that reused cached vertex buffers
- `uploadedBytes`: vertex bytes uploaded this frame

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
- `drawCalls` is lower than total object count

If `drawCalls` is close to `objects`, check scene order. Raw2D only batches consecutive compatible objects so render order stays predictable.
