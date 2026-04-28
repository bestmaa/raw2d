# Render Mode

`renderMode` is a low-level hint that tells renderers how often an object is expected to change.

Raw2D keeps this explicit because future WebGL performance work needs to know which objects are stable and which objects are animated.

## Modes

```ts
type Object2DRenderMode = "dynamic" | "static";
```

- `dynamic`: default mode for objects that may move, resize, rotate, animate, or change material often
- `static`: hint for objects that rarely change, such as background geometry, map chunks, or fixed decoration

## Basic Usage

```ts
import { Rect } from "raw2d";

const background = new Rect({
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  renderMode: "static"
});

const player = new Rect({
  x: 100,
  y: 80,
  width: 32,
  height: 32,
  renderMode: "dynamic"
});
```

You can update it later:

```ts
background.setRenderMode("static");
player.setRenderMode("dynamic");
```

## WebGL Behavior

`WebGLRenderer2D` separates consecutive render runs by both object type and render mode.

```text
static Rects -> static shape run
dynamic Rects -> dynamic shape run
static Sprites -> static sprite run
dynamic Sprites -> dynamic sprite run
```

Static runs are cached by `WebGLRenderer2D` after the first upload. Dynamic runs keep using the dynamic upload path because they are expected to change often.

```ts
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats());
// {
//   staticBatches: 1,
//   dynamicBatches: 1,
//   staticObjects: 20,
//   dynamicObjects: 3,
//   staticCacheHits: 0,
//   staticCacheMisses: 1
// }
```

On the next render, the same clean static run can become a cache hit:

```ts
webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().staticCacheHits);
// 1
```

## When To Use Static

Use `static` when an object is mostly fixed:

```ts
tile.setRenderMode("static");
backgroundShape.setRenderMode("static");
```

Use `dynamic` when an object changes often:

```ts
player.setRenderMode("dynamic");
particle.setRenderMode("dynamic");
animatedSprite.setRenderMode("dynamic");
```

## Important

`static` is a performance hint, not a lock. You can still move a static object. Dirty versioning decides when static batch buffers need to rebuild.

Dirty versioning is the signal for that rebuild:

```ts
background.markClean();
background.setPosition(10, 20);

console.log(background.getDirtyState());
// { version: 1, dirty: true }
```
