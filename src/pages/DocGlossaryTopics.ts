import type { DocTopic } from "./DocPage.type";

export const glossaryTopics: readonly DocTopic[] = [
  {
    id: "glossary",
    label: "Glossary",
    title: "Raw2D Glossary",
    description: "Short definitions for common Raw2D renderer, scene, and tooling words.",
    sections: [
      {
        title: "Scene",
        body: "A Scene stores objects in the render tree. It does not draw. Renderers read the Scene and decide how to draw visible objects.",
        code: `const scene = new Scene();
scene.add(rect);`
      },
      {
        title: "Renderer",
        body: "A renderer owns drawing. Canvas is the correctness-first renderer, while WebGLRenderer2D is the batch-first renderer.",
        code: `const renderer = new Canvas({ canvas });
renderer.render(scene, camera);`
      },
      {
        title: "Batch",
        body: "A batch is a group of compatible objects that WebGL can draw together with fewer state changes and fewer draw calls.",
        code: `const stats = webglRenderer.getStats();
console.log(stats.batches);
console.log(stats.drawCalls);`
      },
      {
        title: "Atlas",
        body: "An atlas packs many sprite frames into one texture. This lets WebGL keep sprites in fewer texture-bind groups.",
        code: `const sprite = createSpriteFromAtlas({
  atlas,
  frameName: "hero-idle"
});`
      },
      {
        title: "Bounds",
        body: "Bounds describe an object's rectangle. Raw2D uses bounds for culling, hit testing, selection, and resize tools.",
        code: `const bounds = getWorldBounds({
  object: rect,
  localBounds: getRectLocalBounds(rect)
});`
      },
      {
        title: "Hit Testing",
        body: "Hit testing checks whether a point is inside or near an object. Picking builds on hit testing to return the topmost matching object.",
        code: `const hit = containsPoint({ object: rect, x: pointerX, y: pointerY });
const picked = pickObject({ scene, x: pointerX, y: pointerY });`
      }
    ]
  }
];
