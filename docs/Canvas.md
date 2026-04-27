# Canvas

`Canvas` is Raw2D's first low-level browser surface wrapper.

It does not render objects, shapes, scenes, sprites, or materials. It only manages an `HTMLCanvasElement`, creates a 2D rendering context, handles pixel ratio sizing, and provides a clear method.

Detailed API reference:

- `Canvas-api.md`
- `Canvas-objects.md`
- `BasicMaterial.md`

## Import

```ts
import { Canvas } from "raw2d";
```

From the public library entry:

```ts
import { Canvas } from "raw2d";
```

Later, when Raw2D is packaged as a library:

```ts
import { Canvas } from "raw2d";
```

## Create a Canvas Element

You need a normal browser `<canvas>` element.

```html
<canvas id="raw2d-canvas"></canvas>
```

Then get it in TypeScript:

```ts
const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}
```

## Basic Usage

```ts
import { Canvas } from "raw2d";

const rawCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600
});

const context = rawCanvas.getContext();

rawCanvas.clear("#10141c");
context.fillStyle = "#f5f7fb";
context.fillText("Raw2D canvas ready", 24, 32);
```

## Fullscreen Usage

```ts
const rawCanvas = new Canvas({
  canvas: canvasElement
});

function resizeCanvas(): void {
  rawCanvas.setSize(window.innerWidth, window.innerHeight, window.devicePixelRatio);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
```

## What Canvas Does

- stores the original canvas element
- creates a `CanvasRenderingContext2D`
- stores supported objects added with `add()`
- throws if the browser cannot create the 2D context
- stores logical width and height
- stores pixel ratio
- sets backing buffer size
- sets CSS display size
- scales the 2D context transform for high-DPI screens
- clears the full backing canvas with a color
- asks the internal object renderer to draw supported objects

## What Canvas Does Not Do

- no scene graph
- no camera
- no object transform
- no materials
- no textures
- no separate renderer abstraction yet
- no animation loop
- no shape classes

For now, use `add()` and `render()` for supported objects. Drawing logic lives outside `Canvas` in the renderer module.

## Current Source Files

```text
src/core/Canvas.ts
src/core/Canvas.type.ts
src/core/index.ts
```
