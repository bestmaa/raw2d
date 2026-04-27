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
        body: "Use containsPoint for click selection, hover, drag tools, and future resize handles.",
        code: `import { containsPoint } from "raw2d";

const hit = containsPoint({
  object: rect,
  x: pointerX,
  y: pointerY
});`
      },
      {
        title: "World To Local",
        body: "Raw2D converts world coordinates into object-local coordinates using x/y, rotation, scale, and origin.",
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
