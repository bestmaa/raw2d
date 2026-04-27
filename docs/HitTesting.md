# Hit Testing

Hit testing checks whether a world-space point is inside or near an object.

```ts
import { containsPoint } from "raw2d";

const hit = containsPoint({
  object: rect,
  x: pointerX,
  y: pointerY
});
```

## World Coordinates

`containsPoint()` expects world coordinates. Raw2D converts the point into object-local space using position, rotation, scale, and origin.

```ts
const rect = new Rect({
  x: 100,
  y: 80,
  width: 120,
  height: 80,
  origin: "center"
});

rect.rotation = Math.PI / 4;

const isInside = containsPoint({
  object: rect,
  x: pointerX,
  y: pointerY
});
```

## Line Tolerance

Lines and polylines use a tolerance because strokes are thin geometry.

```ts
const hitLine = containsPoint({
  object: line,
  x: pointerX,
  y: pointerY,
  tolerance: 6
});
```

## Current Support

- Rect: local rectangle test.
- Circle: radius distance test.
- Ellipse: normalized radius test.
- Line: segment distance with tolerance.
- Polyline: segment distance with tolerance.
- Polygon: ray-casting fill test.
- Arc and ShapePath: conservative local bounds for now.

Precise curved ShapePath hit testing can be added later without changing the public API.
