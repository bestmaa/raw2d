import type { DocTopic } from "./DocPage.type";

export const renderOrderTopics: readonly DocTopic[] = [
  {
    id: "render-order",
    label: "Render Order",
    title: "Render Order",
    description: "Use zIndex to control which object is drawn first and which object appears on top.",
    sections: [
      {
        title: "Why It Matters",
        body: "Canvas is a painter's model: later draw calls cover earlier draw calls. zIndex gives Raw2D objects an explicit draw order.",
        liveDemoId: "render-order",
        code: `back.zIndex = 0;
front.zIndex = 10;

raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Set zIndex",
        body: "Lower zIndex objects draw first. Higher zIndex objects draw later and appear above them.",
        liveDemoId: "render-order",
        code: `const background = new Rect({ width: 800, height: 600, zIndex: -100 });
const player = new Rect({ width: 48, height: 48, zIndex: 10 });
const ui = new Rect({ width: 180, height: 40, zIndex: 100 });`
      },
      {
        title: "Update zIndex",
        body: "Use setZIndex when an object needs to move above or below other objects.",
        liveDemoId: "render-order",
        code: `card.setZIndex(20);
raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Stable Order",
        body: "If two objects have the same zIndex, Raw2D keeps scene insertion order. This keeps ordering predictable.",
        liveDemoId: "render-order",
        code: `scene.add(first);
scene.add(second);

first.zIndex = 0;
second.zIndex = 0;

// first draws before second`
      },
      {
        title: "Manual Sorting",
        body: "Engine builders can use sortRenderObjects directly for custom render pipelines.",
        liveDemoId: "render-order",
        code: `const sortedObjects = sortRenderObjects({
  objects: scene.getObjects()
});`
      }
    ]
  }
];
