# raw2d-effects

Renderer-neutral effect descriptors for Raw2D.

This package only owns effect data and validation helpers. Canvas and WebGL application code lives in renderer packages so the core stays lightweight and easy to inspect.

```bash
npm install raw2d-effects
```

## APIs

Factories:

- `createOpacityEffect(opacity, id?)`
- `createBlurEffect(radius, id?)`
- `createGrayscaleEffect(amount, id?)`
- `createShadowEffect({ color, blur, offsetX, offsetY, id })`

Validation:

- `validateRaw2DEffect(effect)`
- `validateRaw2DEffects(effects)`
- `isRaw2DEffect(effect)`

```ts
import {
  createBlurEffect,
  createGrayscaleEffect,
  createOpacityEffect,
  createShadowEffect,
  validateRaw2DEffects
} from "raw2d-effects";

const effects = [
  createOpacityEffect(0.75, "fade"),
  createBlurEffect(4, "soften"),
  createGrayscaleEffect(0.25, "tone"),
  createShadowEffect({ id: "shadow", color: "rgba(0,0,0,0.35)", blur: 12, offsetX: 4, offsetY: 6 })
];

const result = validateRaw2DEffects(effects);
```

## Renderer Separation

Canvas applies descriptors through `CanvasRenderOptions.effects` from `raw2d-canvas`.

WebGL exposes `createWebGLEffectPassPlan` from `raw2d-webgl` so shader-pass boundaries are visible before full WebGL effect execution exists.

## Non-goals

- no filter execution
- no post-processing pipeline
- no shader source
- no scene graph behavior
- no renderer selection

## Boundary Rules

- no Canvas or WebGL imports
- no DOM dependency
- no shader or filter implementation here
- renderer packages decide how to apply supported descriptors
