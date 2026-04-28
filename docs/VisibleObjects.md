# Visible Objects

`getVisibleObjects` returns scene objects whose world bounds intersect the camera viewport.

It is the first culling foundation helper in Raw2D. Renderers do not use it automatically yet, so engine builders can decide where culling belongs in their own pipeline.

## Basic Usage

```ts
import { getVisibleObjects } from "raw2d";

const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width: 800,
  height: 600
});
```

## Invisible Objects

Invisible objects are skipped by default.

```ts
const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width,
  height,
  includeInvisible: true
});
```

## Filter

Use `filter` when you only want to cull a subset of supported objects.

```ts
const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width,
  height,
  filter: (object) => object.name.startsWith("enemy")
});
```

Unsupported base `Object2D` instances are skipped because they do not have local bounds yet.
