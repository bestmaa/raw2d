import type { DocTopic } from "./DocPage.type";

export const canvasQATopics: readonly DocTopic[] = [
  {
    id: "canvas-docs-qa",
    label: "Canvas Docs QA",
    title: "Canvas Docs Visual QA",
    description: "Use this browser checklist before Canvas examples are accepted.",
    sections: [
      {
        title: "Open The Routes",
        body: "Check the docs and the standalone Canvas example. Both must load without console errors, blank canvases, or broken imports.",
        code: `http://localhost:5197/doc#canvas-init
http://localhost:5197/doc#rect
http://localhost:5197/doc#circle
http://localhost:5197/doc#line
http://localhost:5197/doc#text2d
http://localhost:5197/examples/canvas-basic/`
      },
      {
        title: "Canvas Pixels",
        body: "The canvas should show real drawn pixels after Raw2DCanvas.render(scene, camera). A black or transparent-only canvas fails the visual check.",
        code: `const canvas = document.querySelector("canvas");
const pixels = canvas
  ?.getContext("2d")
  ?.getImageData(0, 0, canvas.width, canvas.height).data;`
      },
      {
        title: "Object Coverage",
        body: "Confirm Rect, Circle, Line, Text2D, and Sprite examples explain their parameters and show a matching live result.",
        code: `Rect: position, size, origin, material fill
Circle: position, radius, origin, material fill
Line: start/end points, stroke color, line width
Text2D: text, font size, fill color
Sprite: texture loading and source rectangle`
      },
      {
        title: "Resize And Clear",
        body: "Resize or reload the route and verify the renderer clears the previous frame before drawing the next one.",
        code: `raw2dCanvas.setSize(800, 600);
raw2dCanvas.render(scene, camera);`
      }
    ]
  }
];
