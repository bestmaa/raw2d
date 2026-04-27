# Circle

`Circle` is a Raw2D object data class.

It stores transform data from `Object2D` and its own radius. It does not draw itself.

## Source Files

```text
src/objects/Circle.ts
src/objects/Circle.type.ts
src/objects/index.ts
```

## Import

```ts
import { Circle } from "raw2d";
```

From the public entry:

```ts
import { Circle } from "raw2d";
```

Later, when packaged:

```ts
import { Circle } from "raw2d";
```

## Create A Circle

```ts
const circle = new Circle({
  x: 260,
  y: 130,
  radius: 60,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});
```

## Options

```ts
interface CircleOptions extends Object2DOptions {
  readonly radius: number;
}
```

## Properties

```ts
circle.id;
circle.name;
circle.x;
circle.y;
circle.rotation;
circle.scaleX;
circle.scaleY;
circle.visible;
circle.radius;
```

## Methods

```ts
circle.setPosition(120, 160);
circle.setScale(2);
circle.setRadius(80);
circle.getSize();
```

`getSize()` returns:

```ts
{
  radius: number;
  diameter: number;
}
```

## Live Example

Open:

```text
/doc#circle
```

The docs page has a radius control and live canvas preview.

## Canvas Example

Use `raw2dCanvas.add(circle)` and `raw2dCanvas.render()` to show the circle.

```ts
import { Canvas } from "raw2d";
import { Circle } from "raw2d";

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();

const circle = new Circle({
  x: 260,
  y: 130,
  radius: 60
});

scene.add(circle);
raw2dCanvas.render(scene, camera);
```

## Rule

Do not add `draw()` to `Circle`. A renderer should draw it later.
