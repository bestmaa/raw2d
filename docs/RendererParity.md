# Renderer Parity

Renderer parity tells you which Raw2D objects are currently supported by Canvas and WebGL.

Canvas is still the complete reference renderer. WebGL is batch-first and grows feature by feature, so some objects may be partial or unsupported while the batching pipeline stays clean.

## Support Matrix

Current checklist:

| Object | Canvas | WebGL | Priority | Note |
| --- | --- | --- | --- | --- |
| Rect | supported | supported | done | Filled shape geometry is batched. |
| Circle | supported | supported | done | WebGL uses triangle approximation. |
| Ellipse | supported | supported | done | WebGL uses triangle approximation. |
| Arc | supported | supported | done | Open arcs become stroke geometry; closed arcs become fan geometry. |
| Line | supported | supported | done | WebGL writes stroked line geometry. |
| Polyline | supported | supported | done | Segments are expanded into stroke geometry. |
| Polygon | supported | supported | done | Simple polygons are triangulated with ear clipping. |
| ShapePath | supported | partial | medium | Strokes and simple closed fills work; complex fills can use rasterize fallback. |
| Text2D | supported | partial | medium | Text is rasterized to texture; glyph atlas is not built yet. |
| Sprite | supported | supported | done | Consecutive same-texture sprites can batch. |
| Group2D | supported | supported | done | Groups are flattened by `RenderPipeline`. |

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
- `limitation`: optional known limitation for partial support
- `nextStep`: optional planned implementation direction
- `priority`: `done`, `high`, `medium`, or `low`

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

WebGL currently focuses on batched shapes, simple ShapePath fill/stroke, opt-in rasterized ShapePath complex fill fallback, sprites, atlas textures, and cached static runs. Canvas remains the fallback for exact path behavior.

## Missing Support Plan

1. Text2D cache maturity: keep the current canvas-texture cache, then add glyph atlas or stronger pooling for large dynamic text scenes.
2. Stroke polish: improve joins, caps, and curve sampling controls after the two partial WebGL areas are stable.
3. ShapePath direct GPU fill: expand direct fill rules after the rasterized fallback has proven useful.
4. Performance proof: keep Canvas/WebGL comparison demos and stats updated as each WebGL feature lands.

Canvas remains the correctness baseline. WebGL should only draw a feature when the output is predictable; otherwise it should skip, warn, or fallback explicitly.

## Why This Exists

Raw2D is low-level, so renderer capability should be visible instead of hidden.

The matrix makes renderer differences explicit for:

- documentation
- examples
- debug tooling
- future package splitting
- future React Fiber integration
- users choosing Canvas or WebGL intentionally
