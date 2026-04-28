# Render Order

Render order controls which object is drawn first and which object appears on top.

Canvas draws like a painter: every new draw call is painted over the previous one. Because of that, object order matters. Raw2D uses `zIndex` to make this explicit and predictable.

## Why It Is Important

Use render order when:

- backgrounds should stay behind gameplay objects
- selected objects should appear above normal objects
- UI should draw above the world
- editor overlays should draw above shapes
- overlapping objects need predictable stacking

Without explicit order, the result depends only on the order objects were added to the scene. That can become confusing as a scene grows.

## Basic Usage

```ts
const background = new Rect({
  width: 800,
  height: 600,
  zIndex: -100
});

const player = new Rect({
  x: 120,
  y: 90,
  width: 48,
  height: 48,
  zIndex: 10
});

const uiPanel = new Rect({
  x: 20,
  y: 20,
  width: 180,
  height: 48,
  zIndex: 100
});
```

Lower `zIndex` draws first. Higher `zIndex` draws later and appears on top.

## Update Order

```ts
card.setZIndex(20);
raw2dCanvas.render(scene, camera);
```

This is useful for selection tools and editors where a clicked object may need to appear above other objects.

## Stable Same-zIndex Order

If two objects have the same `zIndex`, Raw2D keeps scene insertion order:

```ts
scene.add(first);
scene.add(second);

first.zIndex = 0;
second.zIndex = 0;

raw2dCanvas.render(scene, camera);
```

`first` draws before `second`.

## Canvas Renderer

Canvas automatically sorts render objects before drawing:

```ts
raw2dCanvas.render(scene, camera);
```

You do not need to manually sort for normal Canvas rendering.

## Custom Pipelines

Engine builders can sort objects manually:

```ts
import { sortRenderObjects } from "raw2d";

const sortedObjects = sortRenderObjects({
  objects: scene.getObjects()
});
```

This keeps Raw2D transparent: the sort helper is public, and renderers can use the same ordering rule.

## When Not To Use It

Do not use `zIndex` as a layout system. It only controls draw order. Position, origin, scale, bounds, and hit testing are still separate responsibilities.
