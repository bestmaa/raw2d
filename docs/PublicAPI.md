# Public API

Raw2D has two API layers:

- `raw2d`: stable umbrella API for app code.
- focused packages like `raw2d-core`, `raw2d-canvas`, `raw2d-webgl`, and `raw2d-sprite`: modular APIs for tighter bundle control and engine-builder work.

## Use raw2d First

Most app code should start with the umbrella package:

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

`raw2d` exports object classes, renderers, materials, textures, sprites, text, interaction controllers, and common helpers.

## Focused Packages

Use focused packages when you want explicit module boundaries:

```ts
import { Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
import { Sprite, TextureAtlasPacker } from "raw2d-sprite";
```

Focused packages may expose lower-level helpers for testing, debugging, or engine-builder workflows.

## Umbrella Boundary

The umbrella package avoids exporting renderer implementation internals at runtime.

Examples of internals that stay out of `raw2d` runtime exports:

```ts
// Use focused packages for these advanced helpers.
import { createWebGLShapeBatch, WebGLFloatBuffer } from "raw2d-webgl";
import { CanvasObjectRenderer } from "raw2d-canvas";
```

This keeps `raw2d` easy to learn while preserving transparent low-level access through focused packages.

## Types

Types can still be imported from `raw2d`:

```ts
import type {
  Object2DOriginKeyword,
  Renderer2DLike,
  WebGLRenderStats
} from "raw2d";
```

Use `import type` when a symbol is only needed for TypeScript.

## Rule For Examples

App-level examples should import from `raw2d`.

Engine/debug examples can import advanced helpers from focused packages.
