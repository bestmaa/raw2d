# Pipeline Architecture

Raw2D keeps the renderer pipeline visible so engine builders can inspect each step instead of treating rendering as a black box.

## Main Flow

```text
Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall
```

`Scene` owns objects. `RenderList` is the prepared frame view after visibility, zIndex, transforms, filters, and culling. Batchers group compatible objects. Buffers hold vertex data. Shaders choose the GPU path. Draw calls are the final WebGL commands.

## Why It Matters

This naming makes debugging direct:

- if objects disappear, inspect `RenderList` stats
- if draw calls rise, inspect batch splits
- if frames stutter, inspect buffer uploads
- if sprites are slow, inspect texture binds
- if complex paths fail, inspect ShapePath fallback stats

## Practical Example

```ts
const renderList = webglRenderer.createRenderList(scene, camera, {
  culling: true
});

webglRenderer.render(scene, camera, { renderList });

const diagnostics = webglRenderer.getDiagnostics();

console.log(renderList.getStats());
console.log(diagnostics.stats.drawCalls);
console.log(diagnostics.stats.textureBinds);
console.log(diagnostics.stats.uploadedBytes);
```

## Browser Example

Open:

```text
/examples/webgl-pipeline
```

That page renders a small scene and prints the active WebGL pipeline diagnostics.
