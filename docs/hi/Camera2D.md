# Camera2D

Camera2D decide karta hai ki 2D world ka kaunsa part canvas par dikhna chahiye. Object world coordinates me rehte hain, camera pan aur zoom apply karta hai.

Camera khud draw nahi karta.

## Basic Usage

```ts
import { Camera2D } from "raw2d";

const camera = new Camera2D({
  x: 0,
  y: 0,
  zoom: 1
});
```

Render ke waqt camera pass hota hai:

```ts
raw2dCanvas.render(scene, camera);
```

## Pan

Camera position badalne se viewport move hota hai.

```ts
camera.setPosition(120, 80);
raw2dCanvas.render(scene, camera);
```

## Zoom

Zoom badhne par world bada dikhta hai.

```ts
camera.setZoom(2);
raw2dCanvas.render(scene, camera);
```

## Practical Example

```ts
canvasElement.addEventListener("wheel", (event) => {
  event.preventDefault();
  const nextZoom = event.deltaY < 0 ? camera.zoom * 1.1 : camera.zoom / 1.1;
  camera.setZoom(nextZoom);
  raw2dCanvas.render(scene, camera);
});
```

## Important Notes

- Object ke `x` aur `y` world position hote hain.
- Camera ke `x` aur `y` viewport ko move karte hain.
- Editor, map, large scene, aur zoomable tool ke liye Camera2D zaruri hai.

## English Reference

Detailed English version: `docs/Camera2D.md`
