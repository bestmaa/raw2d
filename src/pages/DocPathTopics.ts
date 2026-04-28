import { fullShapePathExample } from "./DocPathExamples";
import type { DocTopic } from "./DocPage.type";

export const pathTopics: readonly DocTopic[] = [
  {
    id: "shape-path",
    label: "ShapePath",
    title: "ShapePath",
    description: "Create custom low-level paths with explicit drawing commands.",
    sections: [
      {
        title: "Create A ShapePath",
        body: "ShapePath stores Canvas-like path commands as data. The renderer decides how to draw them.",
        liveDemoId: "shape-path",
        code: `const shapePath = new ShapePath({
  x: 105,
  y: 55,
  material: new BasicMaterial({
    fillColor: "#38bdf8",
    strokeColor: "#f5f7fb",
    lineWidth: 3
  })
});

shapePath
  .moveTo(0, 95)
  .quadraticCurveTo(260, 18, 300, 95)
  .bezierCurveTo(255, 190, 45, 190, 0, 95)
  .closePath();`
      },
      {
        title: "ShapePath Commands",
        body: "Commands are explicit so future Canvas and WebGL renderers can inspect the pipeline clearly.",
        liveDemoId: "shape-path",
        code: `moveTo(x, y)
lineTo(x, y)
quadraticCurveTo(cpx, cpy, x, y)
bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
closePath()
clear()
setCommands(commands)
getCommands()`
      },
      {
        title: "ShapePath Parameters",
        body: "Use fill and stroke flags to control whether the renderer fills or strokes the command path.",
        liveDemoId: "shape-path",
        code: `x?: number
y?: number
commands?: readonly PathCommand[]
fill?: boolean
stroke?: boolean
rotation?: number
scaleX?: number
scaleY?: number
origin?: Object2DOriginValue
visible?: boolean
material?: BasicMaterial`
      },
      {
        title: "Flatten For Renderers",
        body: "flattenShapePath converts move, line, quadratic, cubic, and close commands into sampled subpaths. This is the foundation for future WebGL ShapePath stroke and fill.",
        liveDemoId: "shape-path",
        code: `import { flattenShapePath } from "raw2d";

const flattened = flattenShapePath(shapePath, {
  curveSegments: 12
});

for (const subpath of flattened.subpaths) {
  console.log(subpath.points);
  console.log(subpath.closed);
}`
      },
      {
        title: "Flatten Commands Directly",
        body: "Use flattenPathCommands when a tool already has command data and does not need to create a ShapePath object.",
        liveDemoId: "shape-path",
        code: `const flattened = flattenPathCommands([
  { type: "moveTo", x: 0, y: 0 },
  { type: "quadraticCurveTo", cpx: 80, cpy: 60, x: 160, y: 0 },
  { type: "lineTo", x: 160, y: 80 },
  { type: "closePath" }
], {
  curveSegments: 12
});`
      },
      {
        title: "Full ShapePath Code",
        body: "Complete setup from canvas element to rendered ShapePath.",
        liveDemoId: "shape-path",
        code: fullShapePathExample
      }
    ]
  }
];
