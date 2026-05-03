# V1 Install And Package Split

Raw2D uses one beginner-friendly umbrella package and several focused packages.

## Recommended Install

Use `raw2d` first:

```bash
npm install raw2d
```

This package exports the stable app-facing API: scene objects, materials, Canvas, WebGLRenderer2D, textures, sprites, text, interaction tools, and common helpers.

## Focused Packages

Install focused packages only when you want explicit module boundaries:

```bash
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-text raw2d-interaction raw2d-react raw2d-mcp
```

- `raw2d-core`: scene graph, objects, materials, math, bounds, and hit testing.
- `raw2d-canvas`: Canvas renderer and Canvas-specific drawing helpers.
- `raw2d-webgl`: WebGL2 renderer, batching, buffers, shaders, and diagnostics.
- `raw2d-sprite`: textures, atlases, atlas packing, and sprite animation.
- `raw2d-text`: Text2D measurement and text helpers.
- `raw2d-interaction`: selection, dragging, resizing, keyboard, and camera controls.
- `raw2d-react`: React bridge package. Keep it outside non-React apps.
- `raw2d-mcp`: automation tools for scene JSON, docs snippets, and visual-check plans.

## Import Rule

App docs and examples should import from `raw2d`:

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";
```

Engine-builder docs may use focused packages:

```ts
import { Rect, Scene } from "raw2d-core";
import { WebGLRenderer2D } from "raw2d-webgl";
```

## Version Rule

Raw2D packages are released together. Even if one focused package did not change internally, its version should stay aligned with the umbrella package so npm users see one clear release train.
