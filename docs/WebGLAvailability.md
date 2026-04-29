# WebGL Availability

WebGL2 is not guaranteed on every browser, device, or embedded webview. Raw2D keeps Canvas as the stable fallback and exposes `isWebGL2Available()` so apps can choose safely.

## Check A Canvas

```ts
import { isWebGL2Available } from "raw2d";

const canUseWebGL = isWebGL2Available({
  canvas: canvasElement
});
```

The helper returns `false` when WebGL2 is missing, blocked, or context creation throws.

## Canvas Fallback

```ts
import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";
import type { Renderer2DLike } from "raw2d";

const renderer: Renderer2DLike = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement })
  : new Canvas({ canvas: canvasElement });

renderer.render(scene, camera);
```

Use this pattern for public apps. Use direct `new WebGLRenderer2D()` when WebGL2 is required and failure should be explicit.

## Context Attributes

```ts
const canUseWebGL = isWebGL2Available({
  canvas: canvasElement,
  contextAttributes: {
    alpha: false,
    antialias: true
  }
});
```

Pass the same attributes you expect your WebGL renderer to use.

## Why This Exists

Raw2D is browser-first, but browser capability varies. A visible helper makes renderer selection explicit instead of hiding fallback behavior inside the renderer constructor.
