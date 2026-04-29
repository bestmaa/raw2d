# WebGL Availability

Har browser ya device me WebGL2 guaranteed nahi hota. Raw2D me Canvas stable fallback hai, aur `isWebGL2Available()` helper se app safe decision le sakta hai.

## Canvas Check

```ts
import { isWebGL2Available } from "raw2d";

const canUseWebGL = isWebGL2Available({
  canvas: canvasElement
});
```

Agar WebGL2 missing, blocked, ya context creation fail ho jaye to helper `false` return karta hai.

## Canvas Fallback Pattern

```ts
import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";
import type { Renderer2DLike } from "raw2d";

const renderer: Renderer2DLike = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement })
  : new Canvas({ canvas: canvasElement });

renderer.render(scene, camera);
```

Public app me ye pattern better hai. Agar project ko WebGL2 compulsory chahiye, tab direct `new WebGLRenderer2D()` use karo aur error ko explicit rehne do.

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

## English Reference

Detailed English version: `docs/WebGLAvailability.md`
