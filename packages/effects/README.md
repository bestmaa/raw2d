# raw2d-effects

Renderer-neutral effect descriptors for Raw2D.

This package only owns effect data and validation helpers. Canvas and WebGL application code lives in renderer packages so the core stays lightweight and easy to inspect.

```bash
npm install raw2d-effects
```

Current descriptors:

- `opacity`
- `blur`
- `grayscale`
- `shadow`

```ts
import { createBlurEffect, createOpacityEffect, validateRaw2DEffects } from "raw2d-effects";

const effects = [
  createOpacityEffect(0.75),
  createBlurEffect(4)
];

const result = validateRaw2DEffects(effects);
```

Boundary rules:

- no Canvas or WebGL imports
- no DOM dependency
- no shader or filter implementation here
- renderer packages decide how to apply supported descriptors
