# Line

`Line` is a Raw2D object data class.

It stores transform data from `Object2D` and local start/end points. It does not draw itself.

## Source Files

```text
src/objects/Line.ts
src/objects/Line.type.ts
src/objects/index.ts
```

## Import

```ts
import { Line } from "raw2d";
```

From the public entry:

```ts
import { Line } from "raw2d";
```

Later, when packaged:

```ts
import { Line } from "raw2d";
```

## Create A Line

```ts
const line = new Line({
  x: 100,
  y: 120,
  startX: 0,
  startY: 0,
  endX: 260,
  endY: 80,
  material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 })
});
```

## Options

```ts
interface LineOptions extends Object2DOptions {
  readonly startX?: number;
  readonly startY?: number;
  readonly endX: number;
  readonly endY: number;
}
```

`startX` and `startY` default to `0`.

## Properties

```ts
line.id;
line.name;
line.x;
line.y;
line.rotation;
line.scaleX;
line.scaleY;
line.visible;
line.startX;
line.startY;
line.endX;
line.endY;
```

## Methods

```ts
line.setPosition(100, 120);
line.setScale(2);
line.setPoints(0, 0, 260, 80);
line.getPoints();
```

`getPoints()` returns:

```ts
{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
```

## Live Example

Open:

```text
/doc#line
```

The docs page has end point controls and live canvas preview.

## Canvas Example

Use `rawCanvas.add(line)` and `rawCanvas.render()` to show the line.

```ts
import { Canvas } from "raw2d";
import { Line } from "raw2d";

const rawCanvas = new Canvas({
  canvas: canvasElement,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();

const line = new Line({
  x: 100,
  y: 120,
  startX: 0,
  startY: 0,
  endX: 260,
  endY: 80
});

scene.add(line);
rawCanvas.render(scene, camera);
```

## Rule

Do not add `draw()` to `Line`. A renderer should draw it later.
