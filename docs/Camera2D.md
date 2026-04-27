# Camera2D

`Camera2D` controls the visible part of the 2D world.

It stores pan and zoom data. It does not draw anything.

## Source Files

```text
src/core/Camera2D.ts
src/core/Camera2D.type.ts
```

## Basic Usage

```ts
const camera = new Camera2D({
  x: 0,
  y: 0,
  zoom: 1
});

raw2dCanvas.render(scene, camera);
```

## Pan

```ts
camera.setPosition(100, 80);
raw2dCanvas.render(scene, camera);
```

## Zoom

```ts
camera.setZoom(2);
raw2dCanvas.render(scene, camera);
```

## Why Camera Exists

Objects live in world coordinates. The camera decides what part of that world is visible.

Later this enables:

- pan
- zoom
- editor viewport
- game camera
- large scenes
