import type { DocTopic } from "./DocPage.type";

export const hitTestingTopics: readonly DocTopic[] = [
  {
    id: "hit-testing",
    label: "Hit Testing",
    title: "Hit Testing",
    description: "Detect whether a world-space pointer is inside or near an object.",
    sections: [
      {
        title: "containsPoint",
        body: "Use containsPoint for click selection, hover states, drag tools, and future resize handles.",
        liveDemoId: "hit-testing",
        code: `import { containsPoint } from "raw2d";

const hit = containsPoint({
  object: rect,
  x: pointerX,
  y: pointerY
});`
      },
      {
        title: "Click Selection",
        body: "Convert the browser pointer into canvas coordinates, then test each object. The objects do not draw or select themselves.",
        liveDemoId: "hit-testing",
        code: `canvasElement.addEventListener("pointerdown", (event) => {
  const bounds = canvasElement.getBoundingClientRect();
  const pointerX = event.clientX - bounds.left;
  const pointerY = event.clientY - bounds.top;

  const selected = scene.children.find((object) =>
    containsPoint({ object, x: pointerX, y: pointerY })
  );
});`
      },
      {
        title: "World Coordinates",
        body: "Raw2D expects world coordinates. It converts that point into object-local coordinates using x/y, rotation, scale, and origin.",
        liveDemoId: "hit-testing",
        code: `const rect = new Rect({
  x: 100,
  y: 80,
  width: 120,
  height: 80,
  origin: "center"
});

rect.rotation = Math.PI / 4;

containsPoint({ object: rect, x: pointerX, y: pointerY });`
      },
      {
        title: "Line Tolerance",
        body: "Lines and polylines use tolerance because they are stroke geometry.",
        liveDemoId: "hit-testing",
        code: `const hitLine = containsPoint({
  object: line,
  x: pointerX,
  y: pointerY,
  tolerance: 6
});`
      },
      {
        title: "Supported Objects",
        body: "Curve-heavy objects use conservative bounds first; precise curve hit testing can be added later.",
        liveDemoId: "hit-testing",
        code: `Rect       // exact local rectangle
Circle     // radius distance
Ellipse    // normalized radius
Line       // segment distance with tolerance
Polyline   // segment distance with tolerance
Polygon    // ray-casting fill
Arc        // conservative local bounds
ShapePath  // conservative local bounds`
      }
    ]
  }
];
