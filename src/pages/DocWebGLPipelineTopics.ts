import type { DocTopic } from "./DocPage.type";

export const webGLPipelineTopics: readonly DocTopic[] = [
  {
    id: "webgl-pipeline",
    label: "WebGL Pipeline",
    title: "WebGL Pipeline",
    description: "Raw2D keeps the WebGL path transparent: Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall.",
    sections: [
      {
        title: "Pipeline Chain",
        body: "Raw2D does not hide the renderer pipeline. The app owns Scene data, the renderer prepares a RenderList, then WebGL groups compatible items before drawing.",
        code: `// Browser example:
// /examples/webgl-pipeline

// Raw2D WebGL direction:
// Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall`
      },
      {
        title: "Scene To RenderList",
        body: "Scene stores objects. RenderList is the prepared view of that scene after visibility, zIndex ordering, transforms, culling, and filters are applied.",
        code: `const renderList = webglRenderer.createRenderList(scene, camera, {
  culling: true
});

console.log(renderList.getStats());`
      },
      {
        title: "RenderList To Batcher",
        body: "The WebGL renderer reads the flat RenderList and splits it into ordered shape and texture runs. Static and dynamic objects stay separate.",
        code: `webglRenderer.render(scene, camera, { renderList });

const stats = webglRenderer.getStats();
console.log(stats.staticBatches);
console.log(stats.dynamicBatches);`
      },
      {
        title: "Batcher To Buffer",
        body: "Batchers write vertices into reusable CPU buffers. The renderer uploads those buffers with bufferData only when capacity must grow, then bufferSubData for later updates.",
        code: `webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats().uploadBufferDataCalls);
console.log(webglRenderer.getStats().uploadBufferSubDataCalls);`
      },
      {
        title: "Buffer To Shader",
        body: "Raw2D uses separate shader paths for solid shape geometry and textured quads. Sprites and rasterized Text2D share the texture shader path.",
        code: `scene.add(rect);   // shape shader path
scene.add(sprite); // texture shader path
scene.add(label);  // rasterized texture path`
      },
      {
        title: "Shader To DrawCall",
        body: "Draw calls are the final GPU commands. Material changes, texture changes, render mode boundaries, and zIndex boundaries can split draw ranges.",
        code: `webglRenderer.render(scene, camera);

const stats = webglRenderer.getStats();
console.log(stats.drawCalls);
console.log(stats.textureBinds);`
      }
    ]
  }
];
