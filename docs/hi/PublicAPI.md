# Public API

Raw2D me API ke do layer hain:

- `raw2d`: app code ke liye stable umbrella API.
- focused packages jaise `raw2d-core`, `raw2d-canvas`, `raw2d-webgl`, aur `raw2d-sprite`: tighter bundle control aur engine-builder work ke liye modular APIs.

## Pehle raw2d Use Karein

Most app code ko umbrella package se start karna chahiye:

```ts
import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Rect,
  Scene,
  WebGLRenderer2D
} from "raw2d";
```

`raw2d` object classes, renderers, materials, textures, sprites, text, interaction controllers aur common helpers export karta hai.

## Focused Packages

Jab explicit module boundary chahiye ho tab focused packages use karein:

```ts
import { Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
import { Sprite, TextureAtlasPacker } from "raw2d-sprite";
```

Focused packages testing, debugging, ya engine-builder workflow ke liye lower-level helpers expose kar sakte hain.

## Umbrella Boundary

Umbrella package runtime me renderer implementation internals export nahi karta.

Ye helpers `raw2d` runtime surface me nahi aate:

```ts
// Advanced helpers ke liye focused packages use karein.
import { createWebGLShapeBatch, WebGLFloatBuffer } from "raw2d-webgl";
import { sortWebGLSpritesForBatching } from "raw2d-webgl";
import { CanvasObjectRenderer } from "raw2d-canvas";
```

Isse `raw2d` learn karna easy rehta hai, aur low-level access focused packages ke through available rehta hai.

## Types

Types `raw2d` se import kiye ja sakte hain:

```ts
import type {
  Object2DOriginKeyword,
  Renderer2DLike,
  WebGLRenderStats
} from "raw2d";
```

Jab symbol sirf TypeScript ke liye ho, `import type` use karein.

## Stability Policy

Raw2D in cheezon ko stable public API maanta hai:

- `raw2d` ke runtime exports.
- documented focused-package exports.
- objects, materials, textures, atlases, aur interaction controllers ke constructor option names.
- renderer lifecycle methods jaise `render`, `clear`, `setSize`, `dispose`, aur `getStats`.

Agar rename zaruri ho, aur old name real app code me useful hai, to compatibility alias pehle rakhein.

## Deprecation Policy

Deprecation clear aur chhota hona chahiye:

```ts
// Pehle old import working rakhein.
import { Canvas, CanvasRenderer } from "raw2d";

console.log(Canvas === CanvasRenderer);
```

Replacement introduce karte hi old public name remove mat karein. Removal se pehle docs, examples, type tests, aur package export tests update hone chahiye.

## Examples Ka Rule

App-level examples `raw2d` se import karein.

Engine/debug examples advanced helpers ko focused packages se import kar sakte hain.
