# TextureAtlasPacker

`TextureAtlasPacker` creates a simple `TextureAtlas` from separate image-like sources.

Use it when you have multiple small sprites but want WebGL to bind one texture and keep consecutive sprites in one batch.

## Basic Usage

```ts
import { Sprite, TextureAtlasPacker } from "raw2d";

const atlas = new TextureAtlasPacker({
  padding: 2,
  maxWidth: 1024,
  powerOfTwo: true
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
```

Without packing, separate images usually become separate textures and require more texture binds.

## Options

```ts
const packer = new TextureAtlasPacker({
  padding: 2,
  maxWidth: 2048,
  powerOfTwo: false
});
```

- `padding`: empty pixels between frames
- `maxWidth`: maximum atlas row width before starting a new row
- `powerOfTwo`: grow the output canvas to power-of-two dimensions
- `createCanvas`: custom canvas factory for tests or non-browser environments

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

The packer uses a simple row layout. It is intentionally readable and deterministic.

Future improvements can add smarter bin packing, duplicate detection, and exportable atlas JSON without changing the `Sprite` or renderer APIs.
