# Renderer Parity

Renderer parity tells you which Raw2D objects are currently supported by Canvas and WebGL.

Canvas is still the complete reference renderer. WebGL is batch-first and grows feature by feature, so some objects may be partial or unsupported while the batching pipeline stays clean.

## Support Matrix

```ts
import { getRendererSupportMatrix } from "raw2d";

const matrix = getRendererSupportMatrix();

console.table(matrix);
```

Each row has:

- `kind`: object name
- `canvas`: Canvas support level
- `webgl`: WebGL support level
- `note`: short implementation detail

Support levels are:

- `supported`: expected to render normally
- `partial`: works with an important limitation
- `unsupported`: intentionally not drawn by that renderer yet

## Check One Object

```ts
import { getRendererSupportMatrix } from "raw2d";

const rectSupport = getRendererSupportMatrix().find((entry) => entry.kind === "Rect");

if (rectSupport?.webgl === "supported") {
  console.log("Rect is ready for WebGL.");
}
```

Use this when docs, demos, or tools need to show the correct renderer choice.

## Check The Active Renderer

Every public renderer exposes the same support profile:

```ts
const support = renderer.getSupport();

console.log(support.renderer);
console.log(support.objects.Rect);
console.log(support.objects.ShapePath);
console.log(support.notes.ShapePath);
```

Use this when your app already has a renderer instance and wants to show UI hints or warnings.

## Current Direction

```ts
const webglReady = getRendererSupportMatrix()
  .filter((entry) => entry.webgl !== "unsupported")
  .map((entry) => entry.kind);

console.log(webglReady);
```

WebGL currently focuses on batched shapes, simple ShapePath fill/stroke, sprites, atlas textures, and cached static runs. Canvas remains the fallback for exact path behavior. WebGL reports skipped complex ShapePath fills through `shapePathUnsupportedFills` instead of drawing them incorrectly.

## Why This Exists

Raw2D is low-level, so renderer capability should be visible instead of hidden.

The matrix makes renderer differences explicit for:

- documentation
- examples
- debug tooling
- future package splitting
- future React Fiber integration
- users choosing Canvas or WebGL intentionally
