# Circle

Circle ek radius-based 2D object hai. Iska center object transform se control hota hai aur size `radius` se.

Circle bhi Rect ki tarah sirf data rakhta hai. Renderer usko draw karta hai.

## Basic Usage

```ts
import { BasicMaterial, Camera2D, Canvas, Circle, Scene } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();
const raw2dCanvas = new Canvas({ canvas: canvasElement });

const circle = new Circle({
  x: 220,
  y: 140,
  radius: 48,
  material: new BasicMaterial({
    fillColor: "#35c2ff",
    strokeColor: "#facc15",
    lineWidth: 3
  })
});

scene.add(circle);
raw2dCanvas.render(scene, camera);
```

## Update Circle

```ts
circle.setRadius(72);
circle.x += 20;
raw2dCanvas.render(scene, camera);
```

## Important Parameters

- `x`, `y`: world position
- `radius`: circle size
- `material.fillColor`: andar ka color
- `material.strokeColor`: outline color
- `material.lineWidth`: outline thickness
- `visible`: false karne par render skip hota hai

## English Reference

Detailed English version: `docs/Circle.md`
