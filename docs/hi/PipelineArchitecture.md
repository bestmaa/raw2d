# Pipeline Architecture

Raw2D renderer pipeline ko clear rakhta hai. Isse engine banane wale developers har step inspect kar sakte hain, rendering ko black box ki tarah treat nahi karna padta.

## Main Flow

```text
Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall
```

`Scene` objects rakhta hai. `RenderList` current frame ka prepared view hota hai, jisme visibility, zIndex, transform, filter, aur culling apply ho chuke hote hain. Batchers compatible objects ko group karte hain. Buffers vertex data rakhte hain. Shaders GPU path choose karte hain. Draw calls final WebGL commands hote hain.

## Ye Kyun Important Hai

Debugging direct ho jati hai:

- object gayab ho to `RenderList` stats dekho
- draw calls badh rahe ho to batch splits dekho
- frame stutter ho to buffer uploads dekho
- sprites slow ho to texture binds dekho
- complex path fail ho to ShapePath fallback stats dekho

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

Open karein:

```text
/examples/webgl-pipeline
```

Ye page ek small scene render karta hai aur active WebGL pipeline diagnostics print karta hai.
