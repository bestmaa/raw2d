# Rect

`Rect` is Raw2D's first renderable object data class.

It follows the same direction as Three.js: create object data first, then let a renderer decide how to draw it. `Rect` does not call Canvas APIs by itself.

## Source Files

```text
src/objects/Rect.ts
src/objects/Rect.type.ts
src/objects/index.ts
```

`Rect` extends:

```text
src/core/Object2D.ts
```

## Import

```ts
import { Rect } from "raw2d";
```

From the public entry:

```ts
import { Rect } from "raw2d";
```

Later, when packaged:

```ts
import { Rect } from "raw2d";
```

## Create A Rect

```ts
const rect = new Rect({
  x: 100,
  y: 80,
  width: 200,
  height: 120,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});
```

## Options

```ts
interface RectOptions extends Object2DOptions {
  readonly width: number;
  readonly height: number;
}
```

`Rect` also accepts `Object2DOptions`:

```ts
interface Object2DOptions {
  readonly name?: string;
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly visible?: boolean;
}
```

## Properties

```ts
rect.id;
rect.name;
rect.x;
rect.y;
rect.rotation;
rect.scaleX;
rect.scaleY;
rect.visible;
rect.width;
rect.height;
```

## Methods

### `setPosition()`

```ts
rect.setPosition(120, 160);
```

Updates `x` and `y`.

### `setScale()`

```ts
rect.setScale(2);
rect.setScale(2, 1);
```

Updates `scaleX` and `scaleY`.

### `getTransform()`

```ts
const transform = rect.getTransform();
```

Returns:

```ts
{
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}
```

### `setSize()`

```ts
rect.setSize(320, 180);
```

Updates rect width and height. Negative values are clamped to `0`.

### `getSize()`

```ts
const size = rect.getSize();
```

Returns:

```ts
{
  width: number;
  height: number;
}
```

## Canvas Example

Use `raw2dCanvas.add(rect)` and `raw2dCanvas.render()` to show the rect.

The live docs page also includes width and height controls:

```text
http://localhost:5174/doc#rect
```

```ts
import { Canvas } from "raw2d";
import { Rect } from "raw2d";

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();

const rect = new Rect({
  x: 100,
  y: 80,
  width: 200,
  height: 120
});

scene.add(rect);
raw2dCanvas.render(scene, camera);
```

This is the current MVP API. Later, `CanvasRenderer` can take over drawing.

## Important Rule

Do not add `draw()` to `Rect`.

`Rect` should only store object data. A future `CanvasRenderer` will draw it.
