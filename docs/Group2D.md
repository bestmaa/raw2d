# Group2D

`Group2D` stores child objects so they can render under one shared transform.

It is Raw2D's first scene graph composition primitive. A group does not draw pixels by itself. It only stores children and transform data. The renderer is still responsible for drawing.

## Why It Is Important

Use `Group2D` when several objects should behave like one unit:

- a composed character made from multiple shapes
- a UI panel with background and text
- a selected editor group
- a tile chunk or decorative cluster
- a reusable composed object

Without a group, you must update every child manually when the whole composition moves. With a group, the parent transform is applied first, then each child transform is applied inside it.

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Canvas, Circle, Group2D, Rect, Scene } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();
const group = new Group2D({
  x: 220,
  y: 140,
  rotation: 0.2
});

const rect = new Rect({
  x: -80,
  y: -40,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

const circle = new Circle({
  x: 70,
  y: 0,
  radius: 42,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

group.add(rect);
group.add(circle);
scene.add(group);

raw2dCanvas.render(scene, camera);
```

## Group Transform

```ts
group.setPosition(260, 160);
group.rotation = 0.4;
group.setScale(1.2);
```

The group transform affects every child at render time. Child positions remain local to the group.

## Add And Remove Children

```ts
group.add(rect);
group.add(circle);

group.remove(rect);
group.clear();
```

Adding the same child twice does not duplicate it.

## Child Render Order

Children follow the same `zIndex` rule as scene objects:

```ts
backPart.setZIndex(0);
frontPart.setZIndex(10);

group.add(frontPart);
group.add(backPart);
```

`backPart` draws first because it has the lower `zIndex`.

## Current Scope

`Group2D` currently covers:

- child storage
- group transform
- recursive Canvas rendering
- child `zIndex` sorting

The next deeper parts are intentionally separate:

- group-aware bounds
- group-aware hit testing
- group-aware culling
- parent references

Keeping those separate keeps the MVP readable and avoids mixing rendering, picking, and bounds logic into the data object.
