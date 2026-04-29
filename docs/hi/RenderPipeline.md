# Render Pipeline

RenderPipeline scene ko renderer-ready list me badalta hai. Isme visibility, culling, hierarchy, zIndex order, aur matrix snapshots prepare hote hain.

## Iska Kaam

Renderer direct scene ko blindly draw nahi karta. Pehle RenderPipeline scene ko `RenderList` me convert karta hai, phir Canvas ya WebGL us list ko draw/batch karta hai.

```text
Scene -> RenderPipeline -> RenderList -> Renderer
```

## Kab Use Karein

Jab aap culling, render order, custom renderer, editor tooling, ya WebGL batching debug kar rahe ho, tab RenderPipeline useful hota hai.

## RenderList Reuse

```ts
const renderList = webglRenderer.createRenderList(scene, camera, {
  culling: true
});

console.log(renderList.getStats());
webglRenderer.render(scene, camera, { renderList });
```

Isse same prepared scene data inspect bhi hota hai aur renderer ko pass bhi hota hai.

## Stats

```ts
const stats = renderList.getStats();

console.log(stats.total);
console.log(stats.accepted);
console.log(stats.culled);
```

`total` scene me checked objects batata hai. `accepted` render ke liye ready objects batata hai. `culled` offscreen skipped objects batata hai.

## Important Notes

- Canvas aur WebGL dono RenderPipeline use kar sakte hain.
- Culling batching se pehle hoti hai.
- RenderList inspectable hai, isliye debugging easy hoti hai.
- Group culling abhi conservative rakhi gayi hai.

## English Reference

Detailed English version: `docs/RenderPipeline.md`
