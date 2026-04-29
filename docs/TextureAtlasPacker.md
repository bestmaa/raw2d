# TextureAtlasPacker

`TextureAtlasPacker` creates a simple `TextureAtlas` from separate image-like sources.

Use it when you have multiple small sprites but want WebGL to bind one texture and keep consecutive sprites in one batch.

## Basic Usage

```ts
import { Sprite, TextureAtlasPacker } from "raw2d";

const atlas = new TextureAtlasPacker({
  padding: 2,
  edgeBleed: 1,
  maxWidth: 1024,
  maxHeight: 1024,
  powerOfTwo: true,
  sort: "area"
}).pack([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage },
  { name: "jump", source: jumpImage }
]);

const idleSprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle"),
  x: 80,
  y: 80
});
```

The returned atlas owns one generated canvas texture. Each frame points to a rectangle inside that canvas.

`edgeBleed` copies frame edge pixels into padding. This helps WebGL linear filtering avoid sampling a neighboring frame at sprite edges.

## Packing Stats

Use `packWithStats()` when you want the atlas plus diagnostics:

```ts
const result = new TextureAtlasPacker({
  padding: 2,
  maxWidth: 1024,
  sort: "area"
}).packWithStats(items);

console.log(result.stats.frameCount);
console.log(result.stats.width, result.stats.height);
console.log(result.stats.usedArea);
console.log(result.stats.wastedArea);
console.log(result.stats.occupancy);

const atlas = result.atlas;
```

`occupancy` is `usedArea / totalArea`. Higher occupancy means less empty atlas space.

## WebGL Batching

Sprites using the same packed `atlas.texture` can share one WebGL texture batch when they are consecutive in scene order.

```ts
scene.add(new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle"),
  x: 40,
  y: 40
}));

scene.add(new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("run"),
  x: 80,
  y: 40
}));

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textures);
// 1

console.log(webglRenderer.getStats().textureBinds);
// 1

console.log(webglRenderer.getStats().drawCalls);
```

Without packing, separate images usually become separate textures and require more texture binds.

## Static Atlas Sprites

Static atlas sprites can reuse their WebGL vertex buffer:

```ts
tileSprite.setRenderMode("static");

webglRenderer.render(scene, camera);
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats().staticCacheHits);
// 1
```

Keep animated sprites dynamic because their atlas frame changes often.

## Options

```ts
const packer = new TextureAtlasPacker({
  padding: 2,
  edgeBleed: 1,
  maxWidth: 2048,
  maxHeight: 2048,
  powerOfTwo: false,
  sort: "area"
});
```

- `padding`: empty pixels between frames
- `edgeBleed`: copy edge pixels into padding to reduce atlas seam artifacts
- `maxWidth`: maximum atlas row width before starting a new row
- `maxHeight`: maximum atlas height before throwing an atlas full error
- `powerOfTwo`: grow the output canvas to power-of-two dimensions
- `sort`: `none`, `height`, or `area` before row packing
- `createCanvas`: custom canvas factory for tests or non-browser environments

## Validation

Packer input is validated before drawing. Duplicate frame names, zero-size items, items wider than `maxWidth`, items taller than `maxHeight`, and rows that overflow `maxHeight` throw explicit errors.

## Browser-First

In a browser, Raw2D creates a canvas automatically:

```ts
const atlas = new TextureAtlasPacker().pack(items);
```

In Node tests or custom runtimes, pass `createCanvas`:

```ts
const atlas = new TextureAtlasPacker({
  createCanvas: (width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
}).pack(items);
```

## Current Scope

The packer uses a readable row layout with optional item sorting. `sort: "area"` is a good default for many mixed-size sprites.

Future improvements can add smarter bin packing and exportable atlas JSON without changing the `Sprite` or renderer APIs.
