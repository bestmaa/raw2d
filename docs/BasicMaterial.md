# BasicMaterial

`BasicMaterial` stores drawing style data for simple 2D objects.

Objects keep material data. Renderer modules read that material and decide how to draw it.

## Source Files

```text
src/materials/BasicMaterial.ts
src/materials/BasicMaterial.type.ts
src/materials/index.ts
```

## Import

```ts
import { BasicMaterial } from "raw2d";
```

From the public entry:

```ts
import { BasicMaterial } from "raw2d";
```

Later, when packaged:

```ts
import { BasicMaterial } from "raw2d";
```

## Create A Material

```ts
const material = new BasicMaterial({
  fillColor: "#f45b69",
  strokeColor: "#facc15",
  lineWidth: 6
});
```

## Options

```ts
interface BasicMaterialOptions {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly lineWidth?: number;
}
```

## Parameters

```text
fillColor?: string
```

Fill color used by `Rect`, `Circle`, and `Text2D`.

```text
strokeColor?: string
```

Stroke color used by `Line`.

```text
lineWidth?: number
```

Stroke width used by `Line`.

## Use With Rect

```ts
const rect = new Rect({
  x: 100,
  y: 80,
  width: 200,
  height: 120,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});
```

## Use With Circle

```ts
const circle = new Circle({
  x: 260,
  y: 130,
  radius: 60,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});
```

## Use With Line

```ts
const line = new Line({
  x: 100,
  y: 120,
  endX: 260,
  endY: 80,
  material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 })
});
```

## Update Material

```ts
material.setFillColor("#ffffff");
material.setStrokeColor("#111111");
material.setLineWidth(2);
```

## Use With Text2D

```ts
const text = new Text2D({
  x: 80,
  y: 135,
  text: "Hello Raw2D",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
});
```
