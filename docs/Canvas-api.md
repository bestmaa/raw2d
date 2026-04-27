# Canvas API

This document lists the current `Canvas` constructor options, properties, and methods.

## Constructor

```ts
const raw2dCanvas = new Canvas(options);
```

`Canvas` requires a `CanvasOptions` object.

```ts
interface CanvasOptions {
  readonly canvas: HTMLCanvasElement;
  readonly width?: number;
  readonly height?: number;
  readonly pixelRatio?: number;
  readonly alpha?: boolean;
  readonly backgroundColor?: string;
}
```

## Options

### `canvas`

```ts
HTMLCanvasElement
```

Required. This is the real DOM canvas element that Raw2D will control.

```ts
const raw2dCanvas = new Canvas({
  canvas: canvasElement
});
```

### `width`

```ts
number | undefined
```

Optional. Logical canvas width in CSS pixels. If not provided, `Canvas` uses `canvas.clientWidth`.

```ts
const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800
});
```

### `height`

```ts
number | undefined
```

Optional. Logical canvas height in CSS pixels. If not provided, `Canvas` uses `canvas.clientHeight`.

```ts
const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  height: 600
});
```

### `pixelRatio`

```ts
number | undefined
```

Optional. Controls high-DPI rendering. If not provided, `Canvas` uses `window.devicePixelRatio`.

```ts
const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  pixelRatio: window.devicePixelRatio
});
```

### `alpha`

```ts
boolean | undefined
```

Optional. Passed to `canvas.getContext("2d", { alpha })`. It defaults to `false`.

```ts
const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  alpha: true
});
```

## Public Properties

### `element`

```ts
public readonly element: HTMLCanvasElement;
```

The original DOM canvas element.

```ts
raw2dCanvas.element.classList.add("is-ready");
```

## Public Methods

### `getContext()`

```ts
public getContext(): CanvasRenderingContext2D
```

Returns the internal `CanvasRenderingContext2D`.

```ts
const context = raw2dCanvas.getContext();
context.fillStyle = "#ff0000";
```

### `getSize()`

```ts
public getSize(): CanvasSize
```

Returns the current logical size and pixel ratio.

```ts
const size = raw2dCanvas.getSize();

console.log(size.width);
console.log(size.height);
console.log(size.pixelRatio);
```

Return type:

```ts
interface CanvasSize {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
}
```

Object methods are documented separately:

```text
docs/Canvas-objects.md
```

### `setSize()`

```ts
public setSize(width: number, height: number, pixelRatio?: number): void
```

Updates logical size, backing buffer size, CSS size, and context transform.

```ts
raw2dCanvas.setSize(1280, 720);
raw2dCanvas.setSize(1280, 720, 2);
```

What it does:

- clamps width to at least `1`
- clamps height to at least `1`
- clamps pixel ratio to at least `1`
- updates `canvas.width`
- updates `canvas.height`
- updates `canvas.style.width`
- updates `canvas.style.height`
- calls `context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)`

### `clear()`

```ts
public clear(color?: string): void
```

Fills the full backing canvas with a color. Default color is black.

```ts
raw2dCanvas.clear();
raw2dCanvas.clear("#10141c");
```

`clear()` temporarily resets the transform to identity, fills the full backing buffer, then restores the previous context state.

### `setBackgroundColor()`

```ts
public setBackgroundColor(color: string): void
```

Updates the color used by `render()`.

```ts
raw2dCanvas.setBackgroundColor("#10141c");
```

### `render()`

```ts
public render(): void
```

Clears the canvas and draws every visible object added with `add()`.

```ts
raw2dCanvas.render();
```
